#include "duktape.h"
#include "duk_module_node.h"
#include "esp32-javascript.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

duk_ret_t cb_resolve_module(duk_context *ctx)
{
	duk_push_string(ctx, "resolveModule");
	duk_eval(ctx); /* -> [ ... func ] */
	duk_dup(ctx, 0);
	duk_dup(ctx, 1);
	duk_call(ctx, 2);
	return 1;
}

duk_ret_t cb_load_module(duk_context *ctx)
{
	// feed watchdog
	vTaskDelay(1);

	duk_push_string(ctx, "loadModule");
	duk_eval(ctx); /* -> [ ... func ] */
	duk_dup(ctx, 0);
	duk_dup(ctx, 1);
	duk_dup(ctx, 2);
	duk_call(ctx, 3);
	return 1;
}

void registerDukModuleBindings(duk_context *ctx)
{
	/* After initializing the Duktape heap or when creating a new
 * thread with a new global environment:
 */

	extern char _start[] asm("_binary_loader_js_start");
	extern char _end[] asm("_binary_loader_js_end");
	loadJS(ctx, "loader.js", _start, _end);

	duk_push_object(ctx);
	duk_push_c_function(ctx, cb_resolve_module, DUK_VARARGS);
	duk_put_prop_string(ctx, -2, "resolve");
	duk_push_c_function(ctx, cb_load_module, DUK_VARARGS);
	duk_put_prop_string(ctx, -2, "load");
	duk_module_node_init(ctx);
}