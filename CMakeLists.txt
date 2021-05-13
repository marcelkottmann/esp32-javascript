cmake_minimum_required(VERSION 3.5)

### CONFIGURATION OF ESP32 JAVASCRIPT PROJECT ###

# set BOARD_VARIANT to define your ESP32 board. Valid values
# are the directory names below ./components/arduino-esp32/include/variants/
# or esp32-javascript/include/variants/
set(ENV{BOARD_VARIANT} "../esp32-javascript/include/variants/my")

# set ESP32_JS_PROJECT_NAME to define your project component name. 
# Place your component below ./components directory. Set to ""
# if you don't have a project component yet.
set(ENV{ESP32_JS_PROJECT_NAME} "")
#################################################

include($ENV{IDF_PATH}/tools/cmake/project.cmake)
add_compile_options(-Wp,-w)
project(esp32-javascript)

add_custom_target(cp_modules ALL
    COMMAND scripts/copy-modules.sh
    WORKING_DIRECTORY ${CMAKE_SOURCE_DIR})

spiffs_create_partition_image(modules build/modules FLASH_IN_PROJECT
    DEPENDS cp_modules)
