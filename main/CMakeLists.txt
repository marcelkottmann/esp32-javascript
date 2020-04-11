idf_component_register(SRC_DIRS "."
                    INCLUDE_DIRS "include"
                    REQUIRES 
                    "duk-module-node"
                    "spiffs-events"
                    "socket-events"
                    "wifi-events"
                    "esp32-javascript"
                    $ENV{ESP32_JS_PROJECT_NAME})