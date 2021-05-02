idf_component_register(SRC_DIRS "."
                    INCLUDE_DIRS "../components/arduino-esp32/include/" "include"
                    REQUIRES 
                    "arduino-esp32"
                    "duk-module-node"
                    "spiffs-events"
                    "socket-events"
                    "wifi-events"
                    "esp32-javascript"
                    $ENV{ESP32_JS_PROJECT_NAME})