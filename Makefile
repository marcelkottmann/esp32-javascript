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

#
# This is a project Makefile. It is assumed the directory this Makefile resides in is a
# project subdirectory.
#

PROJECT_NAME := esp32-javascript

CFLAGS += -Wno-error=unused-value

## LWIP settings
#CFLAGS += -DLWIP_NETIF_LOOPBACK=1
#CFLAGS += -DLWIP_NETIF_LOOPBACK_MULTITHREADING=1
#CFLAGS += -DLWIP_LOOPBACK_MAX_PBUFS=10

##
CFLAGS += -DLOG_LOCAL_LEVEL=ESP_LOG_INFO

all_binaries: main/boot-js/config.hex main/boot-js/boot.hex main/boot-js/eventloop.hex main/boot-js/http.hex main/boot-js/configserver.hex 

%.hex: %.js
	bash -c "(cat $< && echo -n -e '\0') | xxd -i > $@"

clean:
	rm -f main/boot-js/*.hex

include $(IDF_PATH)/make/project.mk
