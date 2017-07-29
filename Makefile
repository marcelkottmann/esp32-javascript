#
# This is a project Makefile. It is assumed the directory this Makefile resides in is a
# project subdirectory.
#

PROJECT_NAME := hello-world

CFLAGS := -Wno-error=unused-value

include $(IDF_PATH)/make/project.mk

