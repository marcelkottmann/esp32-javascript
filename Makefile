#
# This is a project Makefile. It is assumed the directory this Makefile resides in is a
# project subdirectory.
#

PROJECT_NAME := hello-world

CFLAGS += -Wno-error=unused-value

## LWIP settings
CFLAGS += -DLWIP_NETIF_LOOPBACK=1
CFLAGS += -DLWIP_NETIF_LOOPBACK_MULTITHREADING=1
CFLAGS += -DLWIP_LOOPBACK_MAX_PBUFS=10

##
CFLAGS += -DLOG_LOCAL_LEVEL=ESP_LOG_INFO

all_binaries: main/config.hex main/main.hex main/eventloop.hex 

%.hex: %.js
	bash -c "(cat $< && echo -n -e '\0') | xxd -i > $@"

clean:
	rm -f main/*.hex

include $(IDF_PATH)/make/project.mk
