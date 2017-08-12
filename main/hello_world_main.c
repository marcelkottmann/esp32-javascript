/* Hello World Example

   This example code is in the Public Domain (or CC0 licensed, at your option.)

   Unless required by applicable law or agreed to in writing, this
   software is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
   CONDITIONS OF ANY KIND, either express or implied.
*/
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

static EventGroupHandle_t wifi_event_group;
static const int CONNECTED_BIT = BIT0;

static const char *tag = "esp32-javascript";

// global task handle
TaskHandle_t task;
xQueueHandle el_event_queue;

TaskHandle_t stask;
int notConnectedSockets_len = 0;
int *notConnectedSockets = NULL;
int connectedSockets_len = 0;
int *connectedSockets = NULL;
bool select_task_can_be_killed = false;

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
    timer_event_t events[64];
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
        printf("Send %d events to queue...\n", events->events_len);
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
        printf("Timer start error");
    }
}

void select_task(void *ignore)
{
    select_task_can_be_killed = true;
    printf("Starting select task...\n");

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

    if (sockfd_max >= 0)
    {
        int ret = select(sockfd_max + 1, &readset, &writeset, &errset, NULL);
        select_task_can_be_killed = false;
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

                printf("Fire all %d socket events!\n", events.events_len);
                el_fire_events(&events);
            }
        }
        else
        {
            printf("select returns ERROR\n");
        }
    }
    select_task_can_be_killed = false;
    printf("select task kills himself now.\n");
    vTaskDelete(NULL);
}

void startSelectTask()
{
    xTaskCreatePinnedToCore(&select_task, "select_task", 16 * 1024, NULL, 5, &stask, 1);
}

static duk_ret_t el_registerSocketEvents(duk_context *ctx)
{
    int n;
    int *sockfds;

    //not connected sockets
    if (duk_is_array(ctx, 0))
    {
        n = duk_get_length(ctx, 0);
        sockfds = (int *)calloc(n, sizeof(int));
        for (int i = 0; i < n; i++)
        {
            duk_get_prop_index(ctx, 0, i);
            sockfds[i] = duk_to_int(ctx, -1);
            duk_pop(ctx);
        }
        free(notConnectedSockets);
        notConnectedSockets_len = n;
        notConnectedSockets = sockfds;
    }
    else
    {
        //error
        return -1;
    }

    //connected sockets
    if (duk_is_array(ctx, 1))
    {
        n = duk_get_length(ctx, 1);
        sockfds = (int *)calloc(n, sizeof(int));
        for (int i = 0; i < n; i++)
        {
            duk_get_prop_index(ctx, 1, i);
            sockfds[i] = duk_to_int(ctx, -1);
            duk_pop(ctx);
        }
        free(connectedSockets);
        connectedSockets_len = n;
        connectedSockets = sockfds;
    }
    else
    {
        //error
        return -1;
    }

    return 0;
}

static duk_ret_t el_createNonBlockingSocket(duk_context *ctx)
{
    int sockfd = createNonBlockingSocket();

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
    msg[ret] = '\0';

    duk_push_string(ctx, msg);
    return 1;
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

    tcpip_adapter_init();
    wifi_event_group = xEventGroupCreate();
    ESP_ERROR_CHECK(esp_event_loop_init(event_handler, NULL));
    wifi_init_config_t cfg = WIFI_INIT_CONFIG_DEFAULT();
    ESP_ERROR_CHECK(esp_wifi_init(&cfg));
    ESP_ERROR_CHECK(esp_wifi_set_storage(WIFI_STORAGE_RAM));
    wifi_config_t wifi_config = {
        .sta = {},
    };
    strcpy((char *)wifi_config.sta.ssid, ssid);
    strcpy((char *)wifi_config.sta.password, pass);

    ESP_LOGI(tag, "Setting WiFi configuration SSID %s and PASS %s ...", wifi_config.sta.ssid, wifi_config.sta.password);
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
    printf("Waiting %dms...\n", delay);
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
    printf("Install timer to notify in  %dms.\n", delay);
    init_timer(delay, handle);
    return 0;
}

static duk_ret_t el_suspend(duk_context *ctx)
{
    eventlist_t events;

    startSelectTask();
    xQueueReceive(el_event_queue, &events, portMAX_DELAY);
    //delete select task
    if (select_task_can_be_killed)
    {
        vTaskDelete(stask);
    }

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

    printf("pin=%d dir=%d\n", pin, dir);

    gpio_set_direction(pin, dir);
    return 0;
}

static duk_ret_t digitalWrite(duk_context *ctx)
{
    int pin = duk_to_int(ctx, 0);
    int level = duk_to_int(ctx, 1);

    printf("pin=%d level=%d\n", pin, level);

    gpio_set_level(pin, level);
    return 0;
}

static void my_fatal(void *udata, const char *msg)
{
    (void)udata; /* ignored in this case, silence warning */

    /* Note that 'msg' may be NULL. */
    printf("*** FATAL ERROR: %s\n", (msg ? msg : "no message"));
    abort();
}

void duktape_task(void *ignore)
{
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
    duk_put_global_string(ctx, "bindAndListen");

    duk_push_c_function(ctx, el_acceptIncoming, 1 /*nargs*/);
    duk_put_global_string(ctx, "acceptIncoming");

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

    char main_js[] = {
#include "main.hex"
    };

    char eventloop_js[] = {
#include "eventloop.hex"
    };

    printf("Loading main function...\n");
    duk_eval_string_noresult(ctx, main_js);
    printf("Loading and starting event loop...\n");
    duk_eval_string_noresult(ctx, eventloop_js);

    printf("Reaching end of event loop.\n");

    //Return from task is not allowed
    vTaskDelete(NULL);
}

void app_main()
{
    nvs_flash_init();
    el_event_queue = xQueueCreate(10, sizeof(eventlist_t));
    xTaskCreatePinnedToCore(&duktape_task, "duktape_task", 16 * 1024, NULL, 5, &task, 0);
}
