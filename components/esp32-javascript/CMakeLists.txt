idf_component_register(SRC_DIRS "."
                    INCLUDE_DIRS "../../components/arduino-esp32/include/$ENV{IDF_TARGET}/" "include"
                    REQUIRES "duk-module-node" "nvs_flash" "arduino-esp32" "esp32-js-log" "main"
                    EMBED_TXTFILES "urlparse.js")
