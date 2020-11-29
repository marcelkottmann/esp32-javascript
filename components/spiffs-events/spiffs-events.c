/*
MIT License

Copyright (c) 2020 Marcel Kottmann

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

#include <stdio.h>
#include <string.h>
#include <sys/unistd.h>
#include <sys/stat.h>
#include "esp_err.h"
#include "esp_log.h"
#include "esp_spiffs.h"
#include <duktape.h>
#include "esp32-js-log.h"
#include "esp32-javascript.h"

void initFilesystem(const char *label, const char *basePath)
{
	jslog(INFO, "Initializing SPIFFS");

	esp_vfs_spiffs_conf_t conf = {
		.base_path = basePath,
		.partition_label = label,
		.max_files = 5,
		.format_if_mount_failed = true};

	// Use settings defined above to initialize and mount SPIFFS filesystem.
	// Note: esp_vfs_spiffs_register is an all-in-one convenience function.
	esp_err_t ret = esp_vfs_spiffs_register(&conf);

	if (ret != ESP_OK)
	{
		if (ret == ESP_FAIL)
		{
			jslog(ERROR, "Failed to mount or format filesystem");
		}
		else if (ret == ESP_ERR_NOT_FOUND)
		{
			jslog(ERROR, "Failed to find SPIFFS partition");
		}
		else
		{
			jslog(ERROR, "Failed to initialize SPIFFS (%s)", esp_err_to_name(ret));
		}
		return;
	}

	size_t total = 0, used = 0;
	ret = esp_spiffs_info(label, &total, &used);
	if (ret != ESP_OK)
	{
		jslog(ERROR, "Failed to get SPIFFS partition information (%s)", esp_err_to_name(ret));
	}
	else
	{
		jslog(INFO, "Partition size: total: %x, used: %x", total, used);
	}
}

char *readFile(const char *path)
{
	jslog(INFO, "Reading file %s", path);
	FILE *f = fopen(path, "r");
	if (f == NULL)
	{
		jslog(ERROR, "Failed to open file for reading");
		return NULL;
	}

	fseek(f, 0, SEEK_END);
	long fsize = ftell(f);
	fseek(f, 0, SEEK_SET);

	char *string = (char *)spiram_malloc(fsize + 1);
	fread(string, 1, fsize, f);
	fclose(f);

	string[fsize] = 0;

	return string;
}

int writeFile(const char *path, const char *content)
{
	jslog(INFO, "Writing file %s", path);
	FILE *f = fopen(path, "w");
	if (f == NULL)
	{
		jslog(ERROR, "Failed to open file for writing");
		return -1;
	}
	int result = fputs(content, f);
	fclose(f);
	return result;
}

bool fileExists(const char *path)
{
	struct stat buffer;
	return (stat(path, &buffer) == 0);
}

duk_ret_t el_readFile(duk_context *ctx)
{
	const char *path = duk_to_string(ctx, 0);
	char *content = readFile(path);
	if (content)
	{
		duk_push_string(ctx, content);
		spiram_free(content);
		return 1;
	}
	else
	{
		return 0; // undefined
	}
}

duk_ret_t el_writeFile(duk_context *ctx)
{
	const char *path = duk_to_string(ctx, 0);
	const char *content = duk_to_string(ctx, 1);
	duk_push_int(ctx, writeFile(path, content));
	return 1;
}

duk_ret_t el_fileExists(duk_context *ctx)
{
	const char *path = duk_to_string(ctx, 0);
	duk_push_boolean(ctx, fileExists(path));
	return 1;
}

void registerBindings(duk_context *ctx)
{
	duk_push_c_function(ctx, el_readFile, 1);
	duk_put_global_string(ctx, "readFile");
	duk_push_c_function(ctx, el_fileExists, 1);
	duk_put_global_string(ctx, "fileExists");
	duk_push_c_function(ctx, el_writeFile, 2);
	duk_put_global_string(ctx, "writeFile");
}

void initSpiffs(duk_context *ctx)
{
	initFilesystem("modules", "/modules");
	initFilesystem("data", "/data");
	registerBindings(ctx);
}
