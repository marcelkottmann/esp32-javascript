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

include $(IDF_PATH)/make/project.mk

