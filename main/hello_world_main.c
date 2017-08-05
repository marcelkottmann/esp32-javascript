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

static EventGroupHandle_t wifi_event_group;
static const int CONNECTED_BIT = BIT0;

static const char *TAG = "esp32-javascript";

// global task handle
TaskHandle_t task;
xQueueHandle el_event_queue;

#define EL_TIMER_EVENT_TYPE 0;
#define EL_WIFI_EVENT_TYPE 1;

#define EL_WIFI_STATUS_CONNECTED 1;
#define EL_WIFI_STATUS_DISCONNECTED 0;

typedef struct
{
    int type;
    int status;
} timer_event_t;

void vTimerCallback(TimerHandle_t xTimer)
{
    timer_event_t evt;
    evt.type = EL_TIMER_EVENT_TYPE;
    evt.status = (int)pvTimerGetTimerID(xTimer);

    xQueueSendFromISR(el_event_queue, &evt, NULL);
}

static esp_err_t event_handler(void *ctx, system_event_t *event)
{
    switch (event->event_id)
    {
    case SYSTEM_EVENT_STA_START:
        esp_wifi_connect();
        break;
    case SYSTEM_EVENT_STA_GOT_IP:
        xEventGroupSetBits(wifi_event_group, CONNECTED_BIT);

        timer_event_t evt;
        evt.type = EL_WIFI_EVENT_TYPE;
        evt.status = EL_WIFI_STATUS_CONNECTED;
        xQueueSendFromISR(el_event_queue, &evt, NULL);
        break;
    case SYSTEM_EVENT_STA_DISCONNECTED:
        /* This is a workaround as ESP32 WiFi libs don't currently
       auto-reassociate. */
        esp_wifi_connect();
        xEventGroupClearBits(wifi_event_group, CONNECTED_BIT);
        break;
    default:
        break;
    }
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

    ESP_LOGI(TAG, "Setting WiFi configuration SSID %s and PASS %s ...", wifi_config.sta.ssid, wifi_config.sta.password);
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
    timer_event_t evt;
    xQueueReceive(el_event_queue, &evt, portMAX_DELAY);

    duk_idx_t obj_idx = duk_push_object(ctx);
    duk_push_int(ctx, evt.type);
    duk_put_prop_string(ctx, obj_idx, "type");
    duk_push_int(ctx, evt.status);
    duk_put_prop_string(ctx, obj_idx, "status");

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

    duk_push_c_function(ctx, el_suspend, 0 /*nargs*/);
    duk_put_global_string(ctx, "el_suspend");

    duk_push_c_function(ctx, el_install_timer, 2 /*nargs*/);
    duk_put_global_string(ctx, "el_install_timer");

    duk_push_c_function(ctx, connectWifi, 2 /*nargs*/);
    duk_put_global_string(ctx, "connectWifiInternal");

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

    printf("Reaching end of event loop. Going into endless loop.\n");
    while (true)
    {
        vTaskDelay(100 / portTICK_PERIOD_MS);
    }
}

void app_main()
{
    nvs_flash_init();
    el_event_queue = xQueueCreate(10, sizeof(timer_event_t));
    xTaskCreatePinnedToCore(&duktape_task, "duktape_task", 16 * 1024, NULL, 5, &task, tskNO_AFFINITY);
}
