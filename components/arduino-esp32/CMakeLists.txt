idf_component_register(SRC_DIRS "." "./libb64"
                    INCLUDE_DIRS "include" "$ENV{BOARD_VARIANT}"
                    REQUIRES "nvs_flash" "app_update" "esp_adc_cal")