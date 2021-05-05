idf_component_register(SRC_DIRS "." "./libb64"
                    INCLUDE_DIRS "include" "include/$ENV{IDF_TARGET}" "$ENV{BOARD_VARIANT}"
                    REQUIRES "nvs_flash" "app_update" "esp_adc_cal")