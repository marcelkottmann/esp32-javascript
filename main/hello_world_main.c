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

duk_double_t esp32_duktape_get_now()
{
    struct timeval tv;
    gettimeofday(&tv, NULL);
    duk_double_t ret = floor(tv.tv_sec * 1000 + tv.tv_usec / 1000);
    return ret;
} // esp32_duktape_get_now

/* Being an embeddable engine, Duktape doesn't provide I/O
 * bindings by default.  Here's a simple one argument print()
 * function.
 */
static duk_ret_t native_print(duk_context *ctx)
{
    printf("%s\n", duk_to_string(ctx, 0));
    return 0; /* no return value (= undefined) */
}

/* Adder: add argument values. */
static duk_ret_t native_adder(duk_context *ctx)
{
    int i;
    int n = duk_get_top(ctx); /* #args */
    double res = 0.0;

    for (i = 0; i < n; i++)
    {
        res += duk_to_number(ctx, i);
    }

    duk_push_number(ctx, res);
    return 1; /* one return value */
}

void duktape_task(void *ignore)
{
    duk_context *ctx = duk_create_heap_default();

    duk_push_c_function(ctx, native_print, 1 /*nargs*/);
    duk_put_global_string(ctx, "print");
    duk_push_c_function(ctx, native_adder, DUK_VARARGS);
    duk_put_global_string(ctx, "adder");

    duk_eval_string_noresult(ctx, "var i=0;var a=[]; while(true){print(i++);a.push(i)}");

    duk_destroy_heap(ctx);
}

void app_main()
{
    printf("%s\n", "los");
    xTaskCreatePinnedToCore(&duktape_task, "duktape_task", 16 * 1024, NULL, 5, NULL, tskNO_AFFINITY);
    printf("%s\n", "done");
}
