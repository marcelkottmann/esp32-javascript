##
# MIT License
#
# Copyright (c) 2017 Marcel Kottmann
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:

# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.

# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.
##

PROJECT_NAME := "esp32-javascript"

### CONFIGURATION SECTION ###
ESP32_JS_FLAGS :=

##### Board config #####
# Specify your board here. Identifier can be any of the directory names in ./components/arduino-esp32/include/variants/
export BOARD_VARIANT := "heltec_wifi_lora_32"

# LORA specific configuration

##### LORA: chip #####
# This is the SX1272/SX1273 radio, which is also used on the HopeRF RFM92 boards.
#ESP32_JS_FLAGS += -DCFG_sx1272_radio

# This is the SX1276/SX1277/SX1278/SX1279 radio, which is also used on the HopeRF RFM95 boards.
ESP32_JS_FLAGS += -DCFG_sx1276_radio

##### LORA: regulatory open frequency for your area/country #####
# Europe
ESP32_JS_FLAGS += -DCFG_eu868

# US
#ESP32_JS_FLAGS += -DCFG_us915

### END OF CONFIGURATION SECTION ###

CFLAGS += $(ESP32_JS_FLAGS) -DESP32 -Wno-error=unused-value -Wno-error=format= -Wno-error=maybe-uninitialized
CPPFLAGS += $(ESP32_JS_FLAGS) -DESP32

all_binaries: main/boot-js/config.hex main/boot-js/boot.hex main/boot-js/eventloop.hex main/boot-js/http.hex main/boot-js/configserver.hex main/boot-js/style.css.hex

%.hex: %.js
	bash -c "(cat $< && echo -n -e '\0') | xxd -i > $@"

%.hex: %.gz
	bash -c "(cat $< && echo -n -e '\0') | xxd -i > $@"

clean:
	rm -f main/boot-js/client.js
	rm -f main/boot-js/*.hex

include $(IDF_PATH)/make/project.mk
