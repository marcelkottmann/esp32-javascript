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
#include <stdio.h>
#include <lmic.h>
#include <hal/hal.h>
#include <SPI.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include <duktape.h>
#include "esp_log.h"
#include "main.h"

static const char *tag = "esp32-javascript-lora";

static u1_t nwkskey[] = {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0};
static u1_t appskey[] = {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0};
static u4_t devaddr = 0;

// These callbacks are only used in over-the-air activation, so they are
// left empty here (we cannot leave them out completely unless
// DISABLE_JOIN is set in config.h, otherwise the linker will complain).
void os_getArtEui(u1_t *buf) {}
void os_getDevEui(u1_t *buf) {}
void os_getDevKey(u1_t *buf) {}

static const unsigned EL_LORA_EVENT_TYPE = 3;

// Pin mapping for haltec lora 32 board
const lmic_pinmap lmic_pins = {
    .nss = 18,
    .rxtx = LMIC_UNUSED_PIN,
    .rst = 14,
    .dio = {26, 33, 32}};

TaskHandle_t lmictask;

bool lora_send(const char *str, int len)
{
    // Check if there is not a current TX/RX job running
    if (LMIC.opmode & OP_TXRXPEND)
    {
        printf("OP_TXRXPEND, not sending\n");
        return false;
    }

    // Prepare upstream data transmission at the next possible time.
    LMIC_setTxData2(1, (unsigned char *)str, len, 0);
    printf("Packet queued\n");
    return true;
}

void onEvent(ev_t ev)
{
    switch (ev)
    {
    case EV_SCAN_TIMEOUT:
        printf("EV_SCAN_TIMEOUT\n");
        break;
    case EV_BEACON_FOUND:
        printf("EV_BEACON_FOUND\n");
        break;
    case EV_BEACON_MISSED:
        printf("EV_BEACON_MISSED\n");
        break;
    case EV_BEACON_TRACKED:
        printf("EV_BEACON_TRACKED\n");
        break;
    case EV_JOINING:
        printf("EV_JOINING\n");
        break;
    case EV_JOINED:
        printf("EV_JOINED\n");
        break;
    case EV_RFU1:
        printf("EV_RFU1\n");
        break;
    case EV_JOIN_FAILED:
        printf("EV_JOIN_FAILED\n");
        break;
    case EV_REJOIN_FAILED:
        printf("EV_REJOIN_FAILED\n");
        break;
    case EV_TXCOMPLETE:
        timer_event_t event;
        eventlist_t events;
        events.events_len = 0;

        el_create_event(&event, EL_LORA_EVENT_TYPE, EV_TXCOMPLETE, 0);
        el_add_event(&events, &event);
        el_fire_events(&events);

        /*
        printf("EV_TXCOMPLETE (includes waiting for RX windows)\n");
        if (LMIC.txrxFlags & TXRX_ACK)
            printf("Received ack\n");
        if (LMIC.dataLen)
        {
            printf("Received ");
            printf("%d", LMIC.dataLen);
            printf(" bytes of payload\n");
        }
        */

        break;
    case EV_LOST_TSYNC:
        printf("EV_LOST_TSYNC\n");
        break;
    case EV_RESET:
        printf("EV_RESET\n");
        break;
    case EV_RXCOMPLETE:
        // data received in ping slot
        printf("EV_RXCOMPLETE\n");
        break;
    case EV_LINK_DEAD:
        printf("EV_LINK_DEAD\n");
        break;
    case EV_LINK_ALIVE:
        printf("EV_LINK_ALIVE\n");
        break;
    default:
        printf("Unknown event\n");
        break;
    }
}

duk_ret_t el_lorasend(duk_context *ctx)
{
    if (duk_is_array(ctx, 0))
    {
        int data_len = duk_get_length(ctx, 0);
        char *data = (char *)calloc(data_len, sizeof(char));
        for (int i = 0; i < data_len; i++)
        {
            duk_get_prop_index(ctx, 0, i);
            data[i] = (char)duk_to_int(ctx, -1);
            duk_pop(ctx);
        }
        bool ret = lora_send(data, data_len);
        free(data);
        duk_push_boolean(ctx, ret);
    }
    else
    {
        const char *data = duk_to_string(ctx, 0);
        bool ret = lora_send(data, strlen(data));
        duk_push_boolean(ctx, ret);
    }
    return 1;
}

duk_ret_t el_loraprint(duk_context *ctx)
{
    if (LMIC.dataLen)
    {
        // data received in rx slot after tx
        printf("Received %d bytes of payload: ", LMIC.dataLen);
        int arr_idx = duk_push_array(ctx);
        for (int i = 0; i < LMIC.dataLen; i++)
        {
            duk_push_int(ctx, LMIC.frame[LMIC.dataBeg + i]);
            duk_put_prop_index(ctx, arr_idx, i);
        }
        return 1;
    }

    return 0;
}

void lmic_task(void *ignore)
{

    // SPI settings for heltec esp32 module
    SPI.begin(5, 19, 27, 18);

    // LMIC init
    os_init();
    // Reset the MAC state. Session and pending data transfers will be discarded.
    LMIC_reset();

    LMIC_setClockError(MAX_CLOCK_ERROR * 10 / 100);

    LMIC_setSession(0x1, devaddr, nwkskey, appskey);

#if defined(CFG_eu868)
    LMIC_setupChannel(0, 868100000, DR_RANGE_MAP(DR_SF12, DR_SF7), BAND_CENTI); // g-band
    for (int i = 1; i < 9; i++)
    {
        LMIC_disableChannel(i);
    }
#elif defined(CFG_us915)
    // NA-US channels 0-71 are configured automatically
    // but only one group of 8 should (a subband) should be active
    // TTN recommends the second sub band, 1 in a zero based count.
    // https://github.com/TheThingsNetwork/gateway-conf/blob/master/US-global_conf.json
    LMIC_selectSubBand(1);
#endif

    // Disable link check validation
    LMIC_setLinkCheckMode(0);

    // TTN uses SF9 for its RX2 window.
    LMIC.dn2Dr = DR_SF9;

    // Set data rate and transmit power for uplink (note: txpow seems to be ignored by the library)
    LMIC_setDrTxpow(DR_SF7, 14);

    while (1)
    {
        os_runloop_once();
        vTaskDelay(100 / portTICK_PERIOD_MS);
    }
}

bool loadKey(duk_context *ctx, int idx, u1_t *key, char *logname)
{
    if (duk_is_array(ctx, idx))
    {
        int len = duk_get_length(ctx, 0);
        if (len != 16)
        {
            ESP_LOGE(tag, "%s has not 16 entries, only %d.\n", logname, len);
        }
        else
        {
            for (int i = 0; i < len; i++)
            {
                duk_get_prop_index(ctx, idx, i);
                key[i] = duk_to_int(ctx, -1);
                duk_pop(ctx);
            }
            return true;
        }
    }
    return false;
}

duk_ret_t el_lorasetup(duk_context *ctx)
{
    if (!loadKey(ctx, 0, nwkskey, "Network session key"))
    {
        return -1;
    }

    if (!loadKey(ctx, 1, appskey, "App key"))
    {
        return -1;
    }

    devaddr = duk_to_uint(ctx, 2);

    xTaskCreatePinnedToCore(&lmic_task, "lmic_task", 2 * 1024, NULL, 5, &lmictask, 1);
    return 0;
}
