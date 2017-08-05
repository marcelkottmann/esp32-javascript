/* Hello World Example

   This example code is in the Public Domain (or CC0 licensed, at your option.)

   Unless required by applicable law or agreed to in writing, this
   software is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
   CONDITIONS OF ANY KIND, either express or implied.
*/
#include <stdio.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "esp_system.h"
#include "esp_spi_flash.h"
#include "duktape.h"
#include "esp_event.h"
#include "esp_system.h"
#include <stddef.h>
#include "esp_intr_alloc.h"
#include "esp_attr.h"
#include "driver/timer.h"

// global task handle
TaskHandle_t task;
xQueueHandle timer_queue;
int count = 0;

typedef struct
{
    int type;
} timer_event_t;

#define TIMER_DIVIDER 4 /*!< Hardware timer clock divider */

#define TRK_TIMER_GROUP TIMER_GROUP_0
#define TRK_TIMER_IDX TIMER_1

void IRAM_ATTR timerIsr(void *para)
{
    TIMERG0.int_clr_timers.t1 = 1;
    count++;

    timer_event_t evt;
    evt.type = 1;
    xQueueSendFromISR(timer_queue, &evt, NULL);

    TIMERG0.hw_timer[1].config.alarm_en = 0;
}

void init_timer(int timer_period_us)
{
    printf("set timer to %d\n", timer_period_us);
    uint16_t interval = timer_period_us / 250; // seconds
    timer_config_t config;
    config.alarm_en = 1;
    config.auto_reload = 1;
    config.counter_dir = TIMER_COUNT_UP;
    config.divider = TIMER_DIVIDER;
    config.intr_type = TIMER_INTR_LEVEL;
    config.counter_en = TIMER_PAUSE;

    timer_init(TRK_TIMER_GROUP, TRK_TIMER_IDX, &config);
    timer_set_counter_value(TRK_TIMER_GROUP, TRK_TIMER_IDX, 0x00000000ULL);
    timer_enable_intr(TRK_TIMER_GROUP, TRK_TIMER_IDX);
    timer_isr_register(TRK_TIMER_GROUP, TRK_TIMER_IDX, timerIsr, NULL, ESP_INTR_FLAG_IRAM, NULL);

    timer_pause(TRK_TIMER_GROUP, TRK_TIMER_IDX);
    timer_set_counter_value(TRK_TIMER_GROUP, TRK_TIMER_IDX, 0x00000000ULL);
    timer_set_alarm_value(TRK_TIMER_GROUP, TRK_TIMER_IDX, interval * (TIMER_BASE_CLK / TIMER_DIVIDER));
    timer_start(TRK_TIMER_GROUP, TRK_TIMER_IDX);
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

static duk_ret_t el_suspend(duk_context *ctx)
{
    int delay = duk_to_int32(ctx, 0);
    printf("Suspending for %ds...\n", delay);
    if (delay < 0)
    {
        delay = 0;
    }
    init_timer(delay);

    timer_event_t evt;
    xQueueReceive(timer_queue, &evt, portMAX_DELAY);

    return 0;
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
        printf("%d\n", count);
        vTaskDelay(100 / portTICK_PERIOD_MS);
    }

    // throws multiple errors on esp32 - todo
    // duk_destroy_heap(ctx);
}

void app_main()
{
    timer_queue = xQueueCreate(10, sizeof(timer_event_t));
    xTaskCreatePinnedToCore(&duktape_task, "duktape_task", 16 * 1024, NULL, 5, &task, tskNO_AFFINITY);
}
