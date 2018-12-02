/*
MIT License

Copyright (c) 2018 Marcel Kottmann

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

#include "sdkconfig.h"
#include <stdio.h>
#include <string.h>
#include <stddef.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "esp_system.h"
#include <duktape.h>
#include "tcp.h"
#include "esp_event.h"
#include "esp_system.h"
#include "freertos/event_groups.h"
#include "esp_wifi.h"
#include "esp_event_loop.h"
#include "esp_log.h"
#include "nvs_flash.h"
#include "freertos/timers.h"
#include "lwip/err.h"
#include "lwip/arch.h"
#include "lwip/api.h"
#include <lwip/sockets.h>
#include "nvs.h"
#include <netdb.h>
#include "rom/uart.h"
#include "esp32-hal-gpio.h"
#include "esp32-hal-ledc.h"
#include "pins_arduino.h"
#include "esp32-javascript.h"
extern "C"
{
#include "libb64/cdecode.h"
#include "libb64/cencode.h"
}

static EventGroupHandle_t wifi_event_group;
static const int CONNECTED_BIT = BIT0;
static const int SCANNING_BIT = BIT1;

static const char *tag = "esp32-javascript";

// global task handle
TaskHandle_t task;
xQueueHandle el_event_queue;

TaskHandle_t stask;
int notConnectedSockets_len = 0;
int *notConnectedSockets = NULL;
int connectedSockets_len = 0;
int *connectedSockets = NULL;

int selectClientSocket = -1;
int selectServerSocket = -1;
struct sockaddr_in target;
SemaphoreHandle_t xSemaphore;
bool needsUnblock = false;

bool flag = false;

#define EL_TIMER_EVENT_TYPE 0
#define EL_WIFI_EVENT_TYPE 1
#define EL_SOCKET_EVENT_TYPE 2

#define EL_WIFI_STATUS_DISCONNECTED 0
#define EL_WIFI_STATUS_CONNECTED 1
#define EL_WIFI_STATUS_CONNECTING 2

#define EL_SOCKET_STATUS_WRITE 0
#define EL_SOCKET_STATUS_READ 1
#define EL_SOCKET_STATUS_ERROR 2

void IRAM_ATTR el_add_event(eventlist_t *events, timer_event_t *event)
{
    events->events[events->events_len] = *event;
    events->events_len = events->events_len + 1;
}

void IRAM_ATTR el_fire_events(eventlist_t *events)
{
    if (events->events_len > 0)
    {
        ESP_LOGD(tag, "Send %d events to queue...\n", events->events_len);
        xQueueSendFromISR(el_event_queue, events, NULL);
    }
}

void IRAM_ATTR el_create_event(timer_event_t *event, int type, int status, int fd)
{
    event->type = type;
    event->status = status;
    event->fd = fd;
}

void IRAM_ATTR vTimerCallback(TimerHandle_t xTimer)
{
    timer_event_t event;
    eventlist_t events;

    xTimerDelete(xTimer, portMAX_DELAY);

    el_create_event(&event, EL_TIMER_EVENT_TYPE, (int)xTimer, 0);
    events.events_len = 0;
    el_add_event(&events, &event);
    el_fire_events(&events);
}

void startScan()
{
    wifi_scan_config_t scanConf = {
        .ssid = NULL,
        .bssid = NULL,
        .channel = 0,
        .show_hidden = true};
    int ret = esp_wifi_scan_start(&scanConf, false);
    if (ret > 0)
    {
        ESP_LOGW(tag, "SCAN RETURNED %d\n", ret);
    }
    else
    {
        xEventGroupSetBits(wifi_event_group, SCANNING_BIT);
    }
}

static IRAM_ATTR esp_err_t event_handler(void *ctx, system_event_t *sysevent)
{
    eventlist_t events;
    events.events_len = 0;

    timer_event_t event;
    timer_event_t event2;
    wifi_mode_t mode;

    ESP_LOGI(tag, "WIFI EVENT %d\n", sysevent->event_id);
    switch (sysevent->event_id)
    {
    case SYSTEM_EVENT_SCAN_DONE:
    {
        wifi_config_t wifi_config;
        ESP_ERROR_CHECK(esp_wifi_get_config(WIFI_IF_STA, &wifi_config));

        uint16_t apCount = 0;
        esp_wifi_scan_get_ap_num(&apCount);
        ESP_LOGI(tag, "Number of access points found: %d\n", sysevent->event_info.scan_done.number);
        uint8_t *bssid = NULL;
        int8_t rssi = -127;
        wifi_ap_record_t *list = NULL;
        if (apCount > 0)
        {
            list = (wifi_ap_record_t *)malloc(sizeof(wifi_ap_record_t) * apCount);
            ESP_ERROR_CHECK(esp_wifi_scan_get_ap_records(&apCount, list));

            int i = 0;
            for (i = 0; i < apCount; i++)
            {
                if (strcmp((const char *)list[i].ssid, (const char *)wifi_config.sta.ssid) == 0)
                {
                    if (list[i].rssi > rssi)
                    {
                        bssid = list[i].bssid;
                        rssi = list[i].rssi;
                    }
                }
            }
        }
        esp_wifi_scan_stop();
        xEventGroupClearBits(wifi_event_group, SCANNING_BIT);
        if (bssid != NULL)
        {
            ESP_LOGI(tag, "SSID %s found, best rssi %d, bssid=%02x:%02x:%02x:%02x:%02x:%02x\n", wifi_config.sta.ssid, rssi,
                     bssid[0], bssid[1], bssid[2], bssid[3], bssid[4], bssid[5]);
            memcpy(wifi_config.sta.bssid, bssid, 6 * sizeof(uint8_t));
            ESP_ERROR_CHECK(esp_wifi_set_config(WIFI_IF_STA, &wifi_config));
            esp_wifi_connect();
        }
        else
        {
            ESP_LOGE(tag, "SSID not found %s\n", wifi_config.sta.ssid);

            xEventGroupClearBits(wifi_event_group, CONNECTED_BIT);
            el_create_event(&event, EL_WIFI_EVENT_TYPE, EL_WIFI_STATUS_DISCONNECTED, 0);
            el_add_event(&events, &event);

            startScan();
        }

        if (list != NULL)
        {
            free(list);
        }
        break;
    }
    case SYSTEM_EVENT_STA_START:
        el_create_event(&event, EL_WIFI_EVENT_TYPE, EL_WIFI_STATUS_CONNECTING, 0);
        el_add_event(&events, &event);
        break;
    case SYSTEM_EVENT_STA_GOT_IP:
        xEventGroupSetBits(wifi_event_group, CONNECTED_BIT);
        el_create_event(&event, EL_WIFI_EVENT_TYPE, EL_WIFI_STATUS_CONNECTED, 0);
        el_add_event(&events, &event);
        break;
    case SYSTEM_EVENT_STA_DISCONNECTED:
    {
        xEventGroupClearBits(wifi_event_group, CONNECTED_BIT);
        el_create_event(&event, EL_WIFI_EVENT_TYPE, EL_WIFI_STATUS_DISCONNECTED, 0);
        el_add_event(&events, &event);

        el_create_event(&event2, EL_WIFI_EVENT_TYPE, EL_WIFI_STATUS_CONNECTING, 0);
        el_add_event(&events, &event2);
        esp_wifi_disconnect();
        startScan();
    }
    break;
    case SYSTEM_EVENT_AP_START:
        xEventGroupSetBits(wifi_event_group, CONNECTED_BIT);
        el_create_event(&event, EL_WIFI_EVENT_TYPE, EL_WIFI_STATUS_CONNECTED, 0);
        el_add_event(&events, &event);
        break;
    case SYSTEM_EVENT_AP_STOP:
        xEventGroupClearBits(wifi_event_group, CONNECTED_BIT);
        el_create_event(&event, EL_WIFI_EVENT_TYPE, EL_WIFI_STATUS_DISCONNECTED, 0);
        el_add_event(&events, &event);
        break;
    default:
        ESP_LOGE(tag, "UNKNOWN WIFI EVENT %d\n", sysevent->event_id);
        break;
    }

    el_fire_events(&events);

    return ESP_OK;
}

int createTimer(int timer_period_us)
{
    int interval = timer_period_us / portTICK_PERIOD_MS;

    //interval must be at least 1
    if (interval <= 0)
    {
        interval = 1;
    }
    TimerHandle_t tmr = xTimerCreate("MyTimer", interval, pdFALSE, NULL, vTimerCallback);
    printf("Timer created: %d\n", (int)tmr);
    if (xTimerStart(tmr, portMAX_DELAY) != pdPASS)
    {
        ESP_LOGE(tag, "Timer start error");
    }
    return (int)tmr;
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
            memset((char *)&server, 0, sizeof(server));
            server.sin_family = AF_INET;
            server.sin_addr.s_addr = htonl(INADDR_ANY);
            server.sin_port = htons(port);
            server.sin_len = sizeof(server);

            ESP_LOGD(tag, "Trying to bind socket %d...\n", sd);

            if (bind(sd, (struct sockaddr *)&server, sizeof(server)) >= 0)
            {
                ESP_LOGD(tag, "Trying to create client socket...\n");

                int sc = createNonBlockingSocket(AF_INET, SOCK_DGRAM, 0, true);

                ESP_LOGD(tag, "Created socket pair: %d<-->%d\n", sd, sc);

                ESP_LOGD(tag, "Send test data...\n");

                memset((char *)&target, 0, sizeof(target));
                target.sin_family = AF_INET;
                target.sin_port = htons(port);
                target.sin_len = sizeof(target);
                inet_pton(AF_INET, "127.0.0.1", &(target.sin_addr));

                if (sendto(sc, "", 1, 0, (const sockaddr *)&target, sizeof(target)) < 0)
                {
                    ESP_LOGE(tag, "Error sending test data to self-socket: %d\n", errno);
                }
                else
                {
                    ESP_LOGD(tag, "Trying to receive test data...\n");
                    char msg[2] = "A";
                    struct sockaddr_in remaddr;
                    socklen_t addrlen = sizeof(remaddr);

                    int result = 0;
                    while ((result = recvfrom(sd, msg, 1, 0, (struct sockaddr *)&remaddr, &addrlen)) < 0 && errno == EAGAIN)
                    {
                    }

                    while (result < 0)
                    {
                        ESP_LOGE(tag, "Error receiving test data from self-socket: %d\n", errno);
                    }
                    ESP_LOGD(tag, "Finished reading.\n");

                    if (strcmp(msg, "") == 0)
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
        ESP_LOGD(tag, "Skip until wifi connected: %d\n", errno);
    }

    ESP_LOGD(tag, "Could not create socket pair... no wifi?\n");
    return -1;
}

void select_task_it()
{

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
        if (lwip_ioctl(selectServerSocket, FIONREAD, &dataAvailable) < 0)
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
        needsUnblock = true;
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
            ESP_LOGE(tag, "select returns ERROR: %d\n", errno);
        }
    }
    //wait for next loop
    needsUnblock = true;
    ESP_LOGD(tag, "Select loop finished and now waits for next iteration.\n");
    xSemaphoreTake(xSemaphore, portMAX_DELAY);
    needsUnblock = false;
}

void select_task(void *ignore)
{
    ESP_LOGD(tag, "Starting select task...\n");

    while (true)
    {
        ESP_LOGD(tag, "Starting next select loop.\n");
        select_task_it();
    }
}

static duk_ret_t el_load(duk_context *ctx)
{
    int ret = 0;
    esp_err_t err;

    const char *key = duk_to_string(ctx, 0);

    nvs_handle my_handle;
    err = nvs_open("storage", NVS_READONLY, &my_handle);
    if (err == ESP_ERR_NVS_NOT_FOUND)
    {
        duk_push_undefined(ctx);
        return 1;
    }
    else if (err != ESP_OK)
    {
        ESP_LOGE(tag, "Error (%d) opening NVS!\n", err);
        return -1;
    }

    size_t string_size;
    err = nvs_get_str(my_handle, key, NULL, &string_size);
    if (err == ESP_ERR_NVS_NOT_FOUND)
    {
        duk_push_undefined(ctx);
        ret = 1;
    }
    else if (err != ESP_OK)
    {
        ESP_LOGE(tag, "Cannot get key %s from storage, err=%d\n", key, err);
        ret = -1;
    }
    else
    {
        char *value = (char *)malloc(string_size);
        err = nvs_get_str(my_handle, key, value, &string_size);
        if (err != ESP_OK)
        {
            ESP_LOGE(tag, "Cannot get key %s from storage, err=%d\n", key, err);
            ret = -1;
        }
        else
        {
            duk_push_string(ctx, value);
            ret = 1;
        }
        free(value);
    }
    nvs_close(my_handle);
    return ret;
}

static duk_ret_t el_store(duk_context *ctx)
{
    int ret = 0;
    esp_err_t err;

    const char *key = duk_to_string(ctx, 0);
    if (strlen(key) > 15)
    {
        ESP_LOGE(tag, "Keys may not be longer than 15 chars. Key '%s' is longer.\n", key);
        return -1;
    }

    const char *value = duk_to_string(ctx, 1);
    int len = strlen(value);
    if (len > (1984 - 1))
    {
        ESP_LOGE(tag, "Values may not be longer than 1984 chars (including zero-termination). Current string length is %d\n", len);
        return -1;
    }

    ESP_LOGD(tag, "Opening Non-Volatile Storage (NVS) ... ");
    nvs_handle my_handle;
    err = nvs_open("storage", NVS_READWRITE, &my_handle);
    if (err != ESP_OK)
    {
        ESP_LOGE(tag, "Error (%d) opening NVS!\n", err);
        return -1;
    }

    err = nvs_set_str(my_handle, key, value);
    if (err != ESP_OK)
    {
        ESP_LOGE(tag, "Cannot set key %s and value %s from storage, err=%d\n", key, value, err);
        ret = -1;
    }

    err = nvs_commit(my_handle);
    if (err != ESP_OK)
    {
        ESP_LOGE(tag, "Cannot commit changes, err=%d\n", err);
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
        //swap
        free(notConnectedSockets);
        notConnectedSockets_len = nc_len;
        notConnectedSockets = nc_sockfds;

        free(connectedSockets);
        connectedSockets_len = c_len;
        connectedSockets = c_sockfds;
    }
    else
    {
        free(nc_sockfds);
        free(c_sockfds);
    }

    if (changes)
    {
        ESP_LOGD(tag, "Trying to trigger the next select iteration... ");
        if (selectClientSocket >= 0)
        {
            //interrupt select through self-socket
            ESP_LOGD(tag, "Sending . to self-socket.");
            needsUnblock = true;
            if (sendto(selectClientSocket, ".", 1, 0, (const sockaddr *)&target, sizeof(target)) < 0)
            {
                ESP_LOGE(tag, "Self-socket sending was NOT successful: %d\n", errno);
            }
            else
            {
                ESP_LOGD(tag, "Self-socket sending was successful.\n");
            }
        }
    }

    //trigger next select loop
    if (needsUnblock)
    {
        xSemaphoreGive(xSemaphore);
    }

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
    if (ret < 0 && errno == EAGAIN)
    {
        //return undefined
        return 0;
    }

    duk_push_int(ctx, ret);
    return 1;
}

static duk_ret_t el_closeSocket(duk_context *ctx)
{
    int socketfd = duk_to_int(ctx, 0);
    closeSocket(socketfd);
    return 0;
}

static duk_ret_t writeSocket_bind(duk_context *ctx)
{
    int sockfd = duk_to_int(ctx, 0);
    const char *msg = NULL;
    int len = 0;
    if (duk_is_string(ctx, 1))
    {
        msg = duk_to_string(ctx, 1);
        if (duk_is_undefined(ctx, 2))
        {
            len = strlen(msg);
        }
        else
        {
            len = duk_to_int(ctx, 2);
        }
    }
    else
    {
        duk_size_t buffer_len;
        msg = (char *)duk_get_buffer_data(ctx, 1, &buffer_len);
        if (duk_is_undefined(ctx, 2))
        {
            len = buffer_len;
        }
        else
        {
            len = duk_to_int(ctx, 2);

            if (len > buffer_len)
            {
                return -1;
            }
        }
    }

    int ret = writeSocket(sockfd, msg, len);

    duk_push_int(ctx, ret);
    return 1;
}

static duk_ret_t el_readSocket(duk_context *ctx)
{
    int sockfd = duk_to_int(ctx, 0);

    int len = 1024;
    char msg[len];

    int ret = readSocket(sockfd, (char *)msg, len - 1);
    if (ret >= 0)
    {
        msg[ret] = '\0';
        duk_push_string(ctx, msg);
    }
    else if (errno == EAGAIN)
    {
        printf("******************************\n");
        printf("* EAGAIN RETURNED!!!         *\n");
        printf("******************************\n");

        //eagain
        duk_push_undefined(ctx);
    }
    else
    {
        //error
        duk_push_null(ctx);
    }
    return 1;
}

static duk_ret_t el_stopWifi(duk_context *ctx)
{
    esp_wifi_stop();
    return 0;
}

static duk_ret_t el_startWifi(duk_context *ctx)
{
    esp_wifi_start();
    return 0;
}

static duk_ret_t setupWifi(duk_context *ctx, bool softap)
{
    const char *ssid = duk_to_string(ctx, 0);
    const char *pass = duk_to_string(ctx, 1);

    //try stopping
    esp_wifi_stop();
    wifi_init_config_t cfg = WIFI_INIT_CONFIG_DEFAULT();
    ESP_ERROR_CHECK(esp_wifi_init(&cfg));
    ESP_ERROR_CHECK(esp_wifi_set_ps(WIFI_PS_NONE));

    ESP_ERROR_CHECK(esp_wifi_set_storage(WIFI_STORAGE_RAM));
    if (softap)
    {
        ESP_ERROR_CHECK(esp_wifi_set_mode(WIFI_MODE_AP));
        wifi_config_t ap_config;
        ap_config.ap.ssid_len = 0;
        ap_config.ap.channel = 1;
        ap_config.ap.authmode = strlen(pass) > 0 ? WIFI_AUTH_WPA2_PSK : WIFI_AUTH_OPEN;
        ap_config.ap.ssid_hidden = false;
        ap_config.ap.max_connection = 10;
        ap_config.ap.beacon_interval = 100;

        strcpy((char *)ap_config.ap.ssid, ssid);
        strcpy((char *)ap_config.ap.password, "");
        ESP_ERROR_CHECK(esp_wifi_set_config(WIFI_IF_AP, &ap_config));
        ESP_ERROR_CHECK(esp_wifi_start());
    }
    else
    {
        wifi_config_t wifi_config = {
            .sta = {},
        };
        strcpy((char *)wifi_config.sta.ssid, ssid);
        strcpy((char *)wifi_config.sta.password, pass);
        wifi_config.sta.scan_method = WIFI_ALL_CHANNEL_SCAN;
        wifi_config.sta.bssid_set = true;

        ESP_LOGD(tag, "Setting WiFi configuration SSID %s and PASS %s ...", wifi_config.sta.ssid, wifi_config.sta.password);
        ESP_ERROR_CHECK(esp_wifi_set_mode(WIFI_MODE_STA));
        ESP_ERROR_CHECK(esp_wifi_set_config(WIFI_IF_STA, &wifi_config));
        ESP_ERROR_CHECK(esp_wifi_start());
        startScan();
    }

    return 0;
}

static duk_ret_t el_connectWifi(duk_context *ctx)
{
    return setupWifi(ctx, false);
}

static duk_ret_t el_createSoftAp(duk_context *ctx)
{
    return setupWifi(ctx, true);
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

static duk_ret_t el_createTimer(duk_context *ctx)
{
    int delay = duk_to_int32(ctx, 0);
    if (delay < 0)
    {
        delay = 0;
    }
    ESP_LOGD(tag, "Install timer to notify in  %dms.\n", delay);
    int handle = createTimer(delay);
    duk_push_int(ctx, handle);
    return 1;
}

static duk_ret_t el_removeTimer(duk_context *ctx)
{
    int handle = duk_to_int32(ctx, 0);
    xTimerDelete((TimerHandle_t)handle, portMAX_DELAY);
    return 0;
}

static duk_ret_t el_suspend(duk_context *ctx)
{
    // force garbage collection 2 times see duktape doc
    duk_gc(ctx, 0);
    duk_gc(ctx, 0);
    ESP_LOGI(tag, "Free memory: %d bytes", esp_get_free_heap_size());

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

static duk_ret_t el_pinMode(duk_context *ctx)
{
    int pin = duk_to_int(ctx, 0);
    int dir = duk_to_int(ctx, 1);

    ESP_LOGD(tag, "el_pinMode pin=%d dir=%d\n", pin, dir);

    pinMode(pin, dir);
    return 0;
}

static duk_ret_t el_digitalWrite(duk_context *ctx)
{
    int pin = duk_to_int(ctx, 0);
    int level = duk_to_int(ctx, 1);

    ESP_LOGD(tag, "el_digitalWrite pin=%d level=%d\n", pin, level);

    digitalWrite(pin, level);
    return 0;
}

static duk_ret_t el_digitalRead(duk_context *ctx)
{
    int pin = duk_to_int(ctx, 0);

    ESP_LOGD(tag, "el_digitalRead pin=%d\n", pin);

    int val = digitalRead(pin);
    duk_push_int(ctx, val);
    return 1;
}

static duk_ret_t el_ledcSetup(duk_context *ctx)
{
    int channel = duk_to_int(ctx, 0);
    int freq = duk_to_int(ctx, 1);
    int resolution = duk_to_int(ctx, 2);

    ESP_LOGD(tag, "el_ledcSetup channel=%d freq=%d resolution=%d \n", channel, freq, resolution);

    ledcSetup(channel, freq, resolution);
    return 0;
}

static duk_ret_t el_ledcAttachPin(duk_context *ctx)
{
    int pin = duk_to_int(ctx, 0);
    int channel = duk_to_int(ctx, 1);

    ESP_LOGD(tag, "el_ledcAttachPin pin=%d channel=%d\n", pin, channel);

    ledcAttachPin(pin, channel);
    return 0;
}

static duk_ret_t el_ledcWrite(duk_context *ctx)
{
    int channel = duk_to_int(ctx, 0);
    int dutyCycle = duk_to_int(ctx, 1);

    ESP_LOGD(tag, "el_ledcWrite channel=%d dutyCycle=%d \n", channel, dutyCycle);

    ledcWrite(channel, dutyCycle);
    return 0;
}

static duk_ret_t info(duk_context *ctx)
{
    printf("ESP32 RAM left %d\n", esp_get_free_heap_size());
    return 0;
}

static duk_ret_t el_restart(duk_context *ctx)
{
    esp_restart();
    return 0;
}

static void my_fatal(void *udata, const char *msg)
{
    (void)udata; /* ignored in this case, silence warning */

    /* Note that 'msg' may be NULL. */
    ESP_LOGE(tag, "*** FATAL ERROR: %s\n", (msg ? msg : "no message"));
    abort();
}

static duk_ret_t setDateTimeOffsetInMillis(duk_context *ctx)
{
    double offset = duk_to_number(ctx, 0);
    printf("offset setted to %f\n", offset);
    duk_dateTimeOffsetInMillis = offset;
    return 0;
}

void loadConfig(duk_context *ctx)
{
    const char config_js[] = {
#include "boot-js/config.hex"
    };
    ESP_LOGI(tag, "Loading config...\n");
    duk_eval_string_noresult(ctx, config_js);
}

void loadHttp(duk_context *ctx)
{
    const char http_js[] = {
#include "boot-js/http.hex"
    };
    ESP_LOGI(tag, "Loading http function...\n");
    duk_eval_string_noresult(ctx, http_js);
}

void loadConfigserver(duk_context *ctx)
{
    const char boot_js[] = {
#include "boot-js/configserver.hex"
    };
    ESP_LOGI(tag, "Loading config server function...\n");
    duk_eval_string_noresult(ctx, boot_js);
}

void loadMain(duk_context *ctx)
{
    const char boot_js[] = {
#include "boot-js/boot.hex"
    };
    ESP_LOGI(tag, "Loading boot function...\n");
    duk_eval_string_noresult(ctx, boot_js);
}

void loadEventloop(duk_context *ctx)
{
    const char eventloop_js[] = {
#include "boot-js/eventloop.hex"
    };
    ESP_LOGI(tag, "Loading and starting event loop...\n");
    duk_eval_string_noresult(ctx, eventloop_js);
}

duk_ret_t getCss(duk_context *ctx)
{
    const char css[] = {
#include "boot-js/style.css.hex"
    };
    int size = sizeof(css);
    printf("SIZE: %d\n", size);
    void *buf = duk_push_fixed_buffer(ctx, size);
    memcpy(buf, css, size);
    return 1;
}

duk_ret_t getDefaultConfig(duk_context *ctx)
{
    duk_idx_t obj_idx = duk_push_object(ctx);

    duk_push_string(ctx, CONFIG_ESP32_JS_BASIC_AUTH_USERNAME);
    duk_put_prop_string(ctx, obj_idx, "basicAuthUsername");
    duk_push_string(ctx, CONFIG_ESP32_JS_BASIC_AUTH_PASSWORD);
    duk_put_prop_string(ctx, obj_idx, "basicAuthPassword");
    return 1;
}

duk_ret_t btoa(duk_context *ctx)
{
    ESP_LOGI(tag, "btoa called...\n");
    const char *str = duk_to_string(ctx, 0);
    int length = strlen(str);
    ESP_LOGI(tag, "str length %d\n", length);
    size_t size = base64_encode_expected_len(length) + 1;
    ESP_LOGI(tag, "expected base64 length %d\n", size);
    char *buffer = (char *)malloc(size * sizeof(char));
    if (buffer)
    {
        base64_encodestate _state;
        base64_init_encodestate(&_state);
        int len = base64_encode_block((const char *)&str[0], length, &buffer[0], &_state);
        base64_encode_blockend((buffer + len), &_state);

        duk_push_lstring(ctx, buffer, size - 1);
        free(buffer);
        ESP_LOGI(tag, "return from btoa\n");
        return 1;
    }
    ESP_LOGE(tag, "malloc returned NULL\n");
    return -1;
}

duk_ret_t atob(duk_context *ctx)
{
    const char *str = duk_to_string(ctx, 0);
    int length = strlen(str);
    size_t size = base64_decode_expected_len(length);
    char *buffer = (char *)malloc(size);
    if (buffer)
    {
        base64_decodestate _state;
        base64_init_decodestate(&_state);
        base64_decode_block((const char *)&str[0], length, &buffer[0], &_state);

        duk_push_lstring(ctx, buffer, size);
        return 1;
    }
    ESP_LOGE(tag, "malloc returned NULL\n");
    return -1;
}

void duktape_task(void *ignore)
{
    esp_log_level_set(tag, ESP_LOG_DEBUG);
    duk_context *ctx = duk_create_heap(NULL, NULL, NULL, NULL, my_fatal);

    duk_push_c_function(ctx, native_print, 1 /*nargs*/);
    duk_put_global_string(ctx, "print");

    duk_push_int(ctx, INPUT);
    duk_put_global_string(ctx, "INPUT");

    duk_push_int(ctx, OUTPUT);
    duk_put_global_string(ctx, "OUTPUT");

    duk_push_int(ctx, KEY_BUILTIN);
    duk_put_global_string(ctx, "KEY_BUILTIN");

    duk_push_int(ctx, LED_BUILTIN);
    duk_put_global_string(ctx, "LED_BUILTIN");

    duk_push_c_function(ctx, el_pinMode, 2 /*nargs*/);
    duk_put_global_string(ctx, "pinMode");

    duk_push_c_function(ctx, el_digitalRead, 1 /*nargs*/);
    duk_put_global_string(ctx, "digitalRead");

    duk_push_c_function(ctx, el_digitalWrite, 2 /*nargs*/);
    duk_put_global_string(ctx, "digitalWrite");

    duk_push_int(ctx, 1);
    duk_put_global_string(ctx, "HIGH");

    duk_push_int(ctx, 0);
    duk_put_global_string(ctx, "LOW");

    duk_push_c_function(ctx, info, 0 /*nargs*/);
    duk_put_global_string(ctx, "info");

    duk_push_c_function(ctx, native_delay, 1 /*nargs*/);
    duk_put_global_string(ctx, "delay");

    duk_push_c_function(ctx, writeSocket_bind, 3 /*nargs*/);
    duk_put_global_string(ctx, "writeSocket");

    duk_push_c_function(ctx, el_readSocket, 1 /*nargs*/);
    duk_put_global_string(ctx, "readSocket");

    duk_push_c_function(ctx, el_closeSocket, 1 /*nargs*/);
    duk_put_global_string(ctx, "el_closeSocket");

    // internal functions. use on your own risk:

    duk_push_c_function(ctx, el_suspend, 1 /*nargs*/);
    duk_put_global_string(ctx, "el_suspend");

    duk_push_c_function(ctx, el_createTimer, 1 /*nargs*/);
    duk_put_global_string(ctx, "el_createTimer");

    duk_push_c_function(ctx, el_removeTimer, 1 /*nargs*/);
    duk_put_global_string(ctx, "el_removeTimer");

    duk_push_c_function(ctx, el_connectWifi, 2 /*nargs*/);
    duk_put_global_string(ctx, "el_connectWifi");

    duk_push_c_function(ctx, el_createSoftAp, 2 /*nargs*/);
    duk_put_global_string(ctx, "el_createSoftAp");

    duk_push_c_function(ctx, el_createNonBlockingSocket, 0 /*nargs*/);
    duk_put_global_string(ctx, "el_createNonBlockingSocket");

    duk_push_c_function(ctx, el_connectNonBlocking, 3 /*nargs*/);
    duk_put_global_string(ctx, "el_connectNonBlocking");

    duk_push_c_function(ctx, el_bindAndListen, 2 /*nargs*/);
    duk_put_global_string(ctx, "el_bindAndListen");

    duk_push_c_function(ctx, el_acceptIncoming, 1 /*nargs*/);
    duk_put_global_string(ctx, "el_acceptIncoming");

    duk_push_c_function(ctx, el_registerSocketEvents, 2 /*nargs*/);
    duk_put_global_string(ctx, "el_registerSocketEvents");

    duk_push_c_function(ctx, el_load, 1 /*nargs*/);
    duk_put_global_string(ctx, "el_load");

    duk_push_c_function(ctx, el_store, 2 /*nargs*/);
    duk_put_global_string(ctx, "el_store");

    duk_push_c_function(ctx, el_restart, 0 /*nargs*/);
    duk_put_global_string(ctx, "restart");

    duk_push_c_function(ctx, el_stopWifi, 0 /*nargs*/);
    duk_put_global_string(ctx, "stopWifi");

    duk_push_c_function(ctx, el_startWifi, 0 /*nargs*/);
    duk_put_global_string(ctx, "startWifi");

    duk_push_c_function(ctx, el_ledcSetup, 3 /*nargs*/);
    duk_put_global_string(ctx, "ledcSetup");

    duk_push_c_function(ctx, el_ledcAttachPin, 2 /*nargs*/);
    duk_put_global_string(ctx, "ledcAttachPin");

    duk_push_c_function(ctx, el_ledcWrite, 2 /*nargs*/);
    duk_put_global_string(ctx, "ledcWrite");

    duk_push_c_function(ctx, getCss, 0 /*nargs*/);
    duk_put_global_string(ctx, "getCss");

    duk_push_c_function(ctx, setDateTimeOffsetInMillis, 1 /*nargs*/);
    duk_put_global_string(ctx, "setDateTimeOffsetInMillis");

    duk_push_c_function(ctx, getDefaultConfig, 0 /*nargs*/);
    duk_put_global_string(ctx, "getDefaultConfig");

    duk_push_c_function(ctx, btoa, 1 /*nargs*/);
    duk_put_global_string(ctx, "btoa");

    duk_push_c_function(ctx, atob, 1 /*nargs*/);
    duk_put_global_string(ctx, "atob");

#ifdef ESP32_JAVASCRIPT_EXTERN_INIT
    ESP32_JAVASCRIPT_EXTERN_INIT(ctx);
#endif

    loadHttp(ctx);

    loadConfig(ctx);

    loadConfigserver(ctx);

    loadMain(ctx);

    loadEventloop(ctx);

    ESP_LOGI(tag, "Reaching end of event loop.\n");

    //Return from task is not allowed
    vTaskDelete(NULL);
}

int esp32_javascript_init()
{
    nvs_flash_init();
    tcpip_adapter_init();
    wifi_event_group = xEventGroupCreate();
    ESP_ERROR_CHECK(esp_event_loop_init(event_handler, NULL));

    el_event_queue = xQueueCreate(10, sizeof(eventlist_t));
    xSemaphore = xSemaphoreCreateBinary();

    xTaskCreatePinnedToCore(&select_task, "select_task", 12 * 1024, NULL, 5, &stask, 1);
    xTaskCreatePinnedToCore(&duktape_task, "duktape_task", 20 * 1024, NULL, 5, &task, 0);
    return 0;
}
