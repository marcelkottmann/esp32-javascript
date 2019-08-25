##
# MIT License
#
# Copyright (c) 2019 Marcel Kottmann
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
# Specify your board here. Identifier can be any of the directory names in 
# ./components/arduino-esp32/include/variants/
# or you can create your own variant in ./components/esp32-javascript/include/variants
export BOARD_VARIANT := "my"

include $(IDF_PATH)/make/project.mk

clean:
	rm -rf build/modules

cp_modules: 
	./scripts/copy-modules.sh

SPIFFS_IMAGE_FLASH_IN_PROJECT := 1
SPIFFS_IMAGE_DEPENDS += cp_modules
$(eval $(call spiffs_create_partition_image,storage,build/modules))

