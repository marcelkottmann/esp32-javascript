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

    // throws multiple errors on esp32 - todo
    // duk_destroy_heap(ctx);
}

void app_main()
{
    xTaskCreatePinnedToCore(&duktape_task, "duktape_task", 16 * 1024, NULL, 5, NULL, tskNO_AFFINITY);
}
