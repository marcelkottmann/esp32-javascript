#define LOG_LOCAL_LEVEL ESP_LOG_INFO
#include <stdio.h>
#include <string.h>
#include <stddef.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "esp_system.h"
#include "duktape.h"
#include "tcp.h"
#include "esp_event.h"
#include "esp_system.h"
#include "freertos/event_groups.h"
#include "esp_wifi.h"
#include "esp_event_loop.h"
#include "esp_log.h"
#include "nvs_flash.h"
#include "lwip/err.h"
#include "lwip/arch.h"
#include "lwip/api.h"
#include "freertos/timers.h"
#include <lwip/sockets.h>
#include "nvs.h"
#include <netdb.h>

static EventGroupHandle_t wifi_event_group;
static const int CONNECTED_BIT = BIT0;

static const char *tag = "esp32-javascript";

// global task handle
TaskHandle_t task;
xQueueHandle el_event_queue;
xQueueHandle el_select_queue;

TaskHandle_t stask;
int notConnectedSockets_len = 0;
int *notConnectedSockets = NULL;
int connectedSockets_len = 0;
int *connectedSockets = NULL;

int selectClientSocket = -1;
int selectServerSocket = -1;
struct sockaddr_in target;

#define EL_TIMER_EVENT_TYPE 0
#define EL_WIFI_EVENT_TYPE 1
#define EL_SOCKET_EVENT_TYPE 2

#define EL_WIFI_STATUS_DISCONNECTED 0
#define EL_WIFI_STATUS_CONNECTED 1
#define EL_WIFI_STATUS_CONNECTING 2

#define EL_SOCKET_STATUS_WRITE 0
#define EL_SOCKET_STATUS_READ 1
#define EL_SOCKET_STATUS_ERROR 2

typedef struct
{
    int type;
    int status;
    int fd;
} timer_event_t;

typedef struct
{
    timer_event_t events[16];
    int events_len;
} eventlist_t;

void el_add_event(eventlist_t *events, timer_event_t *event)
{
    events->events[events->events_len] = *event;
    events->events_len = events->events_len + 1;
}

void el_fire_events(eventlist_t *events)
{
    if (events->events_len > 0)
    {
        ESP_LOGD(tag, "Send %d events to queue...\n", events->events_len);
        xQueueSendFromISR(el_event_queue, events, NULL);
    }
}

void el_create_event(timer_event_t *event, int type, int status, int fd)
{
    event->type = type;
    event->status = status;
    event->fd = fd;
}

void vTimerCallback(TimerHandle_t xTimer)
{
    timer_event_t event;
    el_create_event(&event, EL_TIMER_EVENT_TYPE, (int)pvTimerGetTimerID(xTimer), 0);

    eventlist_t events;
    events.events_len = 0;
    el_add_event(&events, &event);
    el_fire_events(&events);
}

static esp_err_t event_handler(void *ctx, system_event_t *sysevent)
{
    eventlist_t events;
    events.events_len = 0;

    timer_event_t event;
    timer_event_t event2;

    switch (sysevent->event_id)
    {
    case SYSTEM_EVENT_STA_START:
        el_create_event(&event, EL_WIFI_EVENT_TYPE, EL_WIFI_STATUS_CONNECTING, 0);
        el_add_event(&events, &event);
        esp_wifi_connect();
        break;
    case SYSTEM_EVENT_STA_GOT_IP:
        xEventGroupSetBits(wifi_event_group, CONNECTED_BIT);
        el_create_event(&event, EL_WIFI_EVENT_TYPE, EL_WIFI_STATUS_CONNECTED, 0);
        el_add_event(&events, &event);
        break;
    case SYSTEM_EVENT_STA_DISCONNECTED:
        xEventGroupSetBits(wifi_event_group, CONNECTED_BIT);

        el_create_event(&event, EL_WIFI_EVENT_TYPE, EL_WIFI_STATUS_DISCONNECTED, 0);
        el_add_event(&events, &event);

        el_create_event(&event2, EL_WIFI_EVENT_TYPE, EL_WIFI_STATUS_CONNECTING, 0);
        el_add_event(&events, &event2);

        /* This is a workaround as ESP32 WiFi libs don't currently
       auto-reassociate. */
        esp_wifi_connect();
        xEventGroupClearBits(wifi_event_group, CONNECTED_BIT);
        break;
    default:
        ESP_LOGE(tag, "UNKNOWN WIFI EVENT %d\n", sysevent->event_id);
        break;
    }

    el_fire_events(&events);

    return ESP_OK;
}

void init_timer(int timer_period_us, int handle)
{
    int interval = timer_period_us / portTICK_PERIOD_MS;

    //interval must be at least 1
    if (interval <= 0)
    {
        interval = 1;
    }
    TimerHandle_t tmr = xTimerCreate("MyTimer", interval, pdFALSE, (void *)handle, vTimerCallback);
    if (xTimerStart(tmr, 10) != pdPASS)
    {
        ESP_LOGE(tag, "Timer start error");
    }
}

int createSocketPair()
{
    struct sockaddr_in server;

    ESP_LOGD(tag, "Start creating socket paair\n");
    int bits = xEventGroupGetBits(wifi_event_group);
    int connected = CONNECTED_BIT & bits;

    if (connected)
    {
        int sd = createNonBlockingSocket(AF_INET, SOCK_DGRAM, 0, true);
        if (sd >= 0)
        {
            int port = 6789;
            //memset((char *)&server, 0, sizeof(server));
            server.sin_family = AF_INET;
            server.sin_addr.s_addr = htonl(INADDR_ANY);
            server.sin_port = htons(port);

            ESP_LOGD(tag, "Trying to bind socket %d...\n", sd);

            if (bind(sd, (struct sockaddr *)&server, sizeof(server)) >= 0)
            {
                ESP_LOGD(tag, "Trying to create client socket...\n");

                int sc = createNonBlockingSocket(AF_INET, SOCK_DGRAM, 0, true);

                ESP_LOGD(tag, "Created socket pair: %d<-->%d\n", sd, sc);

                ESP_LOGD(tag, "Send test data...\n");

                // memset((char *)&target, 0, sizeof(target));
                target.sin_family = AF_INET;
                target.sin_port = htons(port);
                inet_pton(AF_INET, "127.0.0.1", &(target.sin_addr));

                if (sendto(sc, "test", 5, 0, &target, sizeof(target)) < 0)
                {
                    ESP_LOGE(tag, "Error sending test data to self-socket: %d\n", errno);
                }
                else
                {
                    ESP_LOGD(tag, "Trying to receive test data...\n");
                    char msg[5] = "TEST";
                    struct sockaddr_in remaddr;
                    socklen_t addrlen = sizeof(remaddr);
                    if (recvfrom(sd, msg, 5, 0, (struct sockaddr *)&remaddr, &addrlen) < 0)
                    {
                        ESP_LOGE(tag, "Error receiving test data from self-socket: %d\n", errno);
                    }
                    ESP_LOGD(tag, "Finished reading.\n");

                    if (strcmp(msg, "test") == 0)
                    {
                        ESP_LOGI(tag, "Self-Socket Test successful!\n");

                        selectClientSocket = sc;
                        selectServerSocket = sd;
                        ESP_LOGD(tag, "Successfully created socket pair: %d<-->%d\n", selectServerSocket, selectClientSocket);
                        return 0;
                    }
                    else
                    {
                        ESP_LOGE(tag, "Self-socket test NOT successful: %s\n", msg);
                    }
                }
                close(sc);
            }
            else
            {
                ESP_LOGE(tag, "Binding self-socket was unsuccessful: %d\n", errno);
            }

            close(sd);
        }
        else
        {
            ESP_LOGE(tag, "Self-socket could not be created: %d", errno);
        }
    }
    else
    {
        ESP_LOGI(tag, "Skip until wifi connected: %d\n", errno);
    }

    ESP_LOGD(tag, "Could not create socket pair... no wifi?\n");
    return -1;
}

void select_task(void *ignore)
{
    ESP_LOGD(tag, "Starting select task...\n");

    while (true)
    {
        ESP_LOGD(tag, "Starting next select loop.\n");

        // create socket pair
        if (selectServerSocket < 0)
        {
            createSocketPair();
        }

        if (selectServerSocket >= 0 && (notConnectedSockets_len + connectedSockets_len) > 0)
        {
            fd_set readset;
            fd_set writeset;
            fd_set errset;

            int sockfd_max = -1;
            FD_ZERO(&readset);
            FD_ZERO(&writeset);
            FD_ZERO(&errset);

            //register not connected sockets for write ready event
            for (int i = 0; i < notConnectedSockets_len; i++)
            {
                int sockfd = notConnectedSockets[i];
                FD_SET(sockfd, &writeset);
                FD_SET(sockfd, &errset);
                if (sockfd > sockfd_max)
                {
                    sockfd_max = sockfd;
                }
            }

            //register connected sockets for read ready event
            for (int i = 0; i < connectedSockets_len; i++)
            {
                int sockfd = connectedSockets[i];
                FD_SET(sockfd, &readset);
                FD_SET(sockfd, &errset);
                if (sockfd > sockfd_max)
                {
                    sockfd_max = sockfd;
                }
            }

            //set self-socket flag
            //reset (read all data) from self socket
            int dataAvailable;
            if (ioctl(selectServerSocket, FIONREAD, &dataAvailable) < 0)
            {
                ESP_LOGE(tag, "Error getting data available from self-socket: %d.", errno);
            }
            ESP_LOGD(tag, "DATA AVAILABLE %d.\n", dataAvailable);
            //read self-socket if flag is set
            if (dataAvailable > 0)
            {
                char msg[dataAvailable];
                struct sockaddr_in remaddr;
                socklen_t addrlen = sizeof(remaddr);
                if (recvfrom(selectServerSocket, msg, dataAvailable, 0, (struct sockaddr *)&remaddr, &addrlen) < 0)
                {
                    ESP_LOGE(tag, "READ self-socket FAILED: %d\n", errno);
                }
                else
                {
                    ESP_LOGD(tag, "READ of self-socket.\n");
                }
            }

            FD_SET(selectServerSocket, &readset);
            if (selectServerSocket > sockfd_max)
            {
                sockfd_max = selectServerSocket;
            }
            // self socket end

            int ret = select(sockfd_max + 1, &readset, &writeset, &errset, NULL);
            ESP_LOGD(tag, "Select return %d.\n", ret);
            if (ret >= 0)
            {
                if (ret > 0)
                {
                    eventlist_t events;
                    events.events_len = 0;

                    for (int i = 0; i < notConnectedSockets_len; i++)
                    {
                        int sockfd = notConnectedSockets[i];
                        if (FD_ISSET(sockfd, &errset))
                        {
                            timer_event_t event;
                            el_create_event(&event, EL_SOCKET_EVENT_TYPE, EL_SOCKET_STATUS_ERROR, sockfd);
                            el_add_event(&events, &event);
                        }
                        else if (FD_ISSET(sockfd, &writeset))
                        {
                            timer_event_t event;
                            el_create_event(&event, EL_SOCKET_EVENT_TYPE, EL_SOCKET_STATUS_WRITE, sockfd);
                            el_add_event(&events, &event);
                        }
                    }
                    for (int i = 0; i < connectedSockets_len; i++)
                    {
                        int sockfd = connectedSockets[i];
                        if (FD_ISSET(sockfd, &errset))
                        {
                            timer_event_t event;
                            el_create_event(&event, EL_SOCKET_EVENT_TYPE, EL_SOCKET_STATUS_ERROR, sockfd);
                            el_add_event(&events, &event);
                        }
                        else if (FD_ISSET(sockfd, &readset))
                        {
                            timer_event_t event;
                            el_create_event(&event, EL_SOCKET_EVENT_TYPE, EL_SOCKET_STATUS_READ, sockfd);
                            el_add_event(&events, &event);
                        }
                    }

                    if (events.events_len > 0)
                    {
                        ESP_LOGD(tag, "Fire all %d socket events!\n", events.events_len);
                        el_fire_events(&events);
                    }
                    else
                    {
                        ESP_LOGD(tag, "No socket events to fire!\n");
                    }
                }
            }
            else
            {
                ESP_LOGE(tag, "select returns ERROR\n");
            }
        }
        //wait for next loop
        ESP_LOGD(tag, "Select loop finished and now waits for next iteration.\n");
        int trigger;
        xQueueReceive(el_select_queue, &trigger, portMAX_DELAY);
    }
}

void startSelectTask()
{
    xTaskCreatePinnedToCore(&select_task, "select_task", 16 * 1024, NULL, 5, &stask, 1);
}

static duk_ret_t el_load(duk_context *ctx)
{
    int ret;
    esp_err_t err;

    const char *key = duk_to_string(ctx, 0);

    nvs_handle my_handle;
    err = nvs_open("storage", NVS_READWRITE, &my_handle);
    if (err != ESP_OK)
    {
        ESP_LOGE(tag, "Error (%d) opening NVS!\n", err);
        return -1;
    }

    size_t string_size;
    err = nvs_get_str(my_handle, key, NULL, &string_size);
    if (err < 0)
    {
        ESP_LOGE(tag, "Cannot get key %s from storage.\n", key);
        ret = -1;
    }
    else
    {
        char *value = malloc(string_size);
        err = nvs_get_str(my_handle, key, value, &string_size);
        if (err < 0)
        {
            ESP_LOGE(tag, "Cannot get key %s from storage.\n", key);
            ret = -1;
        }
        else
        {
            duk_push_string(ctx, value);
            ret = 1;
        }
    }
    err = nvs_commit(my_handle);
    if (err < 0)
    {
        ESP_LOGE(tag, "Cannot commit changes.\n");
        ret = -1;
    }
    nvs_close(my_handle);
    return ret;
}

static duk_ret_t el_store(duk_context *ctx)
{
    int ret;
    esp_err_t err;

    const char *key = duk_to_string(ctx, 0);
    const char *value = duk_to_string(ctx, 1);

    ESP_LOGD(tag, "Opening Non-Volatile Storage (NVS) ... ");
    nvs_handle my_handle;
    err = nvs_open("storage", NVS_READWRITE, &my_handle);
    if (err != ESP_OK)
    {
        ESP_LOGE(tag, "Error (%d) opening NVS!\n", err);
        return -1;
    }

    err = nvs_set_str(my_handle, key, value);
    if (err < 0)
    {
        ESP_LOGE(tag, "Cannot set key %s and value %s from storage.\n", key, value);
        ret = -1;
    }
    else
    {
        ret = 0;
    }

    err = nvs_commit(my_handle);
    if (err < 0)
    {
        ESP_LOGE(tag, "Cannot commit changes.\n");
        ret = -1;
    }
    nvs_close(my_handle);
    return ret;
}

static duk_ret_t el_registerSocketEvents(duk_context *ctx)
{
    int c_len, nc_len;
    int *c_sockfds;
    int *nc_sockfds;

    //not connected sockets
    if (duk_is_array(ctx, 0))
    {
        nc_len = duk_get_length(ctx, 0);
        nc_sockfds = (int *)calloc(nc_len, sizeof(int));
        for (int i = 0; i < nc_len; i++)
        {
            duk_get_prop_index(ctx, 0, i);
            nc_sockfds[i] = duk_to_int(ctx, -1);
            duk_pop(ctx);
        }
    }
    else
    {
        //error
        return -1;
    }

    //connected sockets
    if (duk_is_array(ctx, 1))
    {
        c_len = duk_get_length(ctx, 1);
        c_sockfds = (int *)calloc(c_len, sizeof(int));
        for (int i = 0; i < c_len; i++)
        {
            duk_get_prop_index(ctx, 1, i);
            c_sockfds[i] = duk_to_int(ctx, -1);
            duk_pop(ctx);
        }
    }
    else
    {
        //error
        return -1;
    }

    /*
    //check if there are changes between this and the previous call
    bool changes = c_len != connectedSockets_len || nc_len != notConnectedSockets_len;
    //deep check
    if (!changes)
    {
        for (int i = 0; i < nc_len; i++)
        {
            if (notConnectedSockets[i] != nc_sockfds[i])
            {
                changes = true;
                break;
            }
        }
        if (!changes)
        {
            for (int i = 0; i < c_len; i++)
            {
                if (connectedSockets[i] != c_sockfds[i])
                {
                    changes = true;
                    break;
                }
            }
        }
    }

    if (changes)
    {
        */
    //swap
    free(notConnectedSockets);
    notConnectedSockets_len = nc_len;
    notConnectedSockets = nc_sockfds;

    free(connectedSockets);
    connectedSockets_len = c_len;
    connectedSockets = c_sockfds;

    /*
    }
    else
    {
        free(nc_sockfds);
        free(c_sockfds);
    }
*/

    ESP_LOGD(tag, "Trying to trigger the next select iteration... ");
    //reset queue
    xQueueReset(el_select_queue);

    if (selectClientSocket >= 0)
    {
        //interrupt select through self-socket
        ESP_LOGD(tag, "Sending . to self-socket.");
        if (sendto(selectClientSocket, ".", 1, 0, &target, sizeof(target)) < 0)
        {
            ESP_LOGE(tag, "Self-socket sending was NOT successful: %d\n", errno);
        }
        else
        {
            ESP_LOGD(tag, "Self-socket sending was successful.\n");
        }
    }

    //trigger next select loop
    int trigger = 1;
    xQueueSendFromISR(el_select_queue, &trigger, NULL);

    return 0;
}

static duk_ret_t el_createNonBlockingSocket(duk_context *ctx)
{
    int sockfd = createNonBlockingSocket(AF_INET, SOCK_STREAM, IPPROTO_TCP, true);

    duk_push_int(ctx, sockfd);
    return 1;
}

static duk_ret_t el_connectNonBlocking(duk_context *ctx)
{
    int sockfd = duk_to_int(ctx, 0);
    const char *hostname = duk_to_string(ctx, 1);
    int port = duk_to_int(ctx, 2);

    int ret = connectNonBlocking(sockfd, hostname, port);
    duk_push_int(ctx, ret);
    return 1;
}

static duk_ret_t el_bindAndListen(duk_context *ctx)
{
    int sockfd = duk_to_int(ctx, 0);
    int port = duk_to_int(ctx, 1);

    int ret = bindAndListen(sockfd, port);
    duk_push_int(ctx, ret);
    return 1;
}

static duk_ret_t el_acceptIncoming(duk_context *ctx)
{
    int sockfd = duk_to_int(ctx, 0);

    int ret = acceptIncoming(sockfd);

    duk_push_int(ctx, ret);
    return 1;
}

static duk_ret_t el_closeSocket(duk_context *ctx)
{
    int socketfd = duk_to_int(ctx, 0);
    closeSocket(socketfd);
    return 0;
}

static duk_ret_t el_getSocketStatus(duk_context *ctx)
{
    fd_set readset;
    fd_set writeset;
    fd_set errset;

    int socketfd = duk_to_int(ctx, 0);

    int socketfds_len = 1;
    int socketfds[socketfds_len];
    socketfds[0] = socketfd;

    int ret = checkSockets(socketfds, socketfds_len, &readset, &writeset, &errset);
    if (ret >= 0)
    {
        int sockfd = socketfds[0];
        duk_idx_t obj_idx = duk_push_object(ctx);
        duk_push_boolean(ctx, FD_ISSET(sockfd, &readset));
        duk_put_prop_string(ctx, obj_idx, "readable");
        duk_push_boolean(ctx, FD_ISSET(sockfd, &writeset));
        duk_put_prop_string(ctx, obj_idx, "writable");
        duk_push_boolean(ctx, FD_ISSET(sockfd, &errset));
        duk_put_prop_string(ctx, obj_idx, "error");
    }
    else
    {
        duk_idx_t obj_idx = duk_push_object(ctx);
        duk_push_boolean(ctx, true);
        duk_put_prop_string(ctx, obj_idx, "error");
        duk_push_int(ctx, errno);
        duk_put_prop_string(ctx, obj_idx, "errno");
    }
    return 1;
}

static duk_ret_t el_writeSocket(duk_context *ctx)
{
    int sockfd = duk_to_int(ctx, 0);
    const char *msg = duk_to_string(ctx, 1);

    int ret = writeSocket(sockfd, msg);

    duk_push_int(ctx, ret);
    return 1;
}

static duk_ret_t el_readSocket(duk_context *ctx)
{
    int sockfd = duk_to_int(ctx, 0);

    int len = 256;
    char msg[len];

    int ret = readSocket(sockfd, msg, len - 1);
    if (ret >= 0)
    {
        msg[ret] = '\0';
        duk_push_string(ctx, msg);
        return 1;
    }
    else
    {
        //error
        return -1;
    }
}

static duk_ret_t el_socket_stats(duk_context *ctx)
{
    if (duk_is_array(ctx, 0))
    {
        int n = duk_get_length(ctx, 0);
        int sockfds[n];
        for (int i = 0; i < n; i++)
        {
            duk_get_prop_index(ctx, 0, i);
            sockfds[i] = duk_to_int(ctx, -1);
            duk_pop(ctx);
        }

        int *stats = socket_stats(sockfds, n);
        if (stats != NULL)
        {
            int arr_idx = duk_push_array(ctx);
            for (int i = 0; i < n; i++)
            {
                duk_push_int(ctx, stats[i]);
                duk_put_prop_index(ctx, arr_idx, i);
            }
            return 1;
        }
    }

    //error
    return -1;
}

static duk_ret_t connectWifi(duk_context *ctx)
{

    const char *ssid = duk_to_string(ctx, 0);
    const char *pass = duk_to_string(ctx, 1);

    wifi_init_config_t cfg = WIFI_INIT_CONFIG_DEFAULT();
    ESP_ERROR_CHECK(esp_wifi_init(&cfg));

    //stop current wifi connection
    ESP_ERROR_CHECK(esp_wifi_stop());

    ESP_ERROR_CHECK(esp_wifi_set_storage(WIFI_STORAGE_RAM));
    wifi_config_t wifi_config = {
        .sta = {},
    };
    strcpy((char *)wifi_config.sta.ssid, ssid);
    strcpy((char *)wifi_config.sta.password, pass);

    ESP_LOGD(tag, "Setting WiFi configuration SSID %s and PASS %s ...", wifi_config.sta.ssid, wifi_config.sta.password);
    ESP_ERROR_CHECK(esp_wifi_set_mode(WIFI_MODE_STA));
    ESP_ERROR_CHECK(esp_wifi_set_config(WIFI_IF_STA, &wifi_config));
    ESP_ERROR_CHECK(esp_wifi_start());
    return 0;
}

duk_double_t esp32_duktape_get_now()
{
    struct timeval tv;
    gettimeofday(&tv, NULL);
    duk_double_t ret = floor(tv.tv_sec * 1000 + tv.tv_usec / 1000);
    return ret;
}

static duk_ret_t native_print(duk_context *ctx)
{
    printf("%s\n", duk_to_string(ctx, 0));
    return 0; /* no return value (= undefined) */
}

static duk_ret_t native_delay(duk_context *ctx)
{
    int delay = duk_to_int32(ctx, 0);
    ESP_LOGD(tag, "Waiting %dms...\n", delay);
    if (delay < 0)
    {
        delay = 0;
    }
    vTaskDelay(delay / portTICK_PERIOD_MS);
    return 0;
}

static duk_ret_t el_install_timer(duk_context *ctx)
{
    int delay = duk_to_int32(ctx, 0);
    int handle = duk_to_int32(ctx, 1);
    if (delay < 0)
    {
        delay = 0;
    }
    ESP_LOGD(tag, "Install timer to notify in  %dms.\n", delay);
    init_timer(delay, handle);
    return 0;
}

static duk_ret_t el_suspend(duk_context *ctx)
{
    eventlist_t events;

    ESP_LOGD(tag, "Waiting for events...\n");

    xQueueReceive(el_event_queue, &events, portMAX_DELAY);

    ESP_LOGD(tag, "Receiving %d events.\n", events.events_len);

    int arr_idx = duk_push_array(ctx);
    for (int i = 0; i < events.events_len; i++)
    {
        duk_idx_t obj_idx = duk_push_object(ctx);

        duk_push_int(ctx, events.events[i].type);
        duk_put_prop_string(ctx, obj_idx, "type");
        duk_push_int(ctx, events.events[i].status);
        duk_put_prop_string(ctx, obj_idx, "status");
        duk_push_int(ctx, events.events[i].fd);
        duk_put_prop_string(ctx, obj_idx, "fd");

        duk_put_prop_index(ctx, arr_idx, i);
    }

    return 1;
}

static duk_ret_t pinMode(duk_context *ctx)
{
    int pin = duk_to_int(ctx, 0);
    int dir = duk_to_int(ctx, 1);

    ESP_LOGD(tag, "pin=%d dir=%d\n", pin, dir);

    gpio_set_direction(pin, dir);
    return 0;
}

static duk_ret_t digitalWrite(duk_context *ctx)
{
    int pin = duk_to_int(ctx, 0);
    int level = duk_to_int(ctx, 1);

    ESP_LOGD(tag, "pin=%d level=%d\n", pin, level);

    gpio_set_level(pin, level);
    return 0;
}

static void my_fatal(void *udata, const char *msg)
{
    (void)udata; /* ignored in this case, silence warning */

    /* Note that 'msg' may be NULL. */
    ESP_LOGE(tag, "*** FATAL ERROR: %s\n", (msg ? msg : "no message"));
    abort();
}

void duktape_task(void *ignore)
{
    esp_log_level_set(tag, ESP_LOG_DEBUG);
    duk_context *ctx = duk_create_heap(NULL, NULL, NULL, NULL, my_fatal);

    duk_push_c_function(ctx, native_print, 1 /*nargs*/);
    duk_put_global_string(ctx, "print");

    duk_push_int(ctx, GPIO_MODE_INPUT);
    duk_put_global_string(ctx, "INPUT");
    duk_push_int(ctx, GPIO_MODE_OUTPUT);
    duk_put_global_string(ctx, "OUTPUT");
    duk_push_c_function(ctx, pinMode, 2 /*nargs*/);
    duk_put_global_string(ctx, "pinMode");
    duk_push_c_function(ctx, digitalWrite, 2 /*nargs*/);
    duk_put_global_string(ctx, "digitalWrite");
    duk_push_int(ctx, 1);
    duk_put_global_string(ctx, "HIGH");
    duk_push_int(ctx, 0);
    duk_put_global_string(ctx, "LOW");

    duk_push_c_function(ctx, native_delay, 1 /*nargs*/);
    duk_put_global_string(ctx, "delay");

    duk_push_c_function(ctx, el_suspend, 1 /*nargs*/);
    duk_put_global_string(ctx, "el_suspend");

    duk_push_c_function(ctx, el_install_timer, 2 /*nargs*/);
    duk_put_global_string(ctx, "el_install_timer");

    duk_push_c_function(ctx, connectWifi, 2 /*nargs*/);
    duk_put_global_string(ctx, "connectWifiInternal");

    duk_push_c_function(ctx, el_createNonBlockingSocket, 0 /*nargs*/);
    duk_put_global_string(ctx, "el_createNonBlockingSocket");

    duk_push_c_function(ctx, el_connectNonBlocking, 3 /*nargs*/);
    duk_put_global_string(ctx, "el_connectNonBlocking");

    duk_push_c_function(ctx, el_bindAndListen, 2 /*nargs*/);
    duk_put_global_string(ctx, "el_bindAndListen");

    duk_push_c_function(ctx, el_acceptIncoming, 1 /*nargs*/);
    duk_put_global_string(ctx, "el_acceptIncoming");

    duk_push_c_function(ctx, el_getSocketStatus, 1 /*nargs*/);
    duk_put_global_string(ctx, "getSocketStatus");

    duk_push_c_function(ctx, el_writeSocket, 2 /*nargs*/);
    duk_put_global_string(ctx, "writeSocket");

    duk_push_c_function(ctx, el_readSocket, 1 /*nargs*/);
    duk_put_global_string(ctx, "readSocket");

    duk_push_c_function(ctx, el_closeSocket, 1 /*nargs*/);
    duk_put_global_string(ctx, "closeSocket");

    duk_push_c_function(ctx, el_socket_stats, 1 /*nargs*/);
    duk_put_global_string(ctx, "el_socket_stats");

    duk_push_c_function(ctx, el_registerSocketEvents, 2 /*nargs*/);
    duk_put_global_string(ctx, "el_registerSocketEvents");

    duk_push_c_function(ctx, el_load, 1 /*nargs*/);
    duk_put_global_string(ctx, "el_load");

    duk_push_c_function(ctx, el_store, 2 /*nargs*/);
    duk_put_global_string(ctx, "el_store");

    char main_js[] = {
#include "main.hex"
    };

    char eventloop_js[] = {
#include "eventloop.hex"
    };

    ESP_LOGI(tag, "Loading main function...\n");
    duk_eval_string_noresult(ctx, main_js);
    ESP_LOGI(tag, "Loading and starting event loop...\n");
    duk_eval_string_noresult(ctx, eventloop_js);

    ESP_LOGI(tag, "Reaching end of event loop.\n");

    //Return from task is not allowed
    vTaskDelete(NULL);
}

void app_main()
{
    nvs_flash_init();
    tcpip_adapter_init();
    wifi_event_group = xEventGroupCreate();
    ESP_ERROR_CHECK(esp_event_loop_init(event_handler, NULL));

    el_event_queue = xQueueCreate(10, sizeof(eventlist_t));
    el_select_queue = xQueueCreate(10, sizeof(int));
    startSelectTask();

    xTaskCreatePinnedToCore(&duktape_task, "duktape_task", 16 * 1024, NULL, 5, &task, 0);
}
