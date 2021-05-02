idf_component_register(SRC_DIRS "."
                    INCLUDE_DIRS "../../components/arduino-esp32/include/" "include" "$ENV{BOARD_VARIANT}"
                    REQUIRES "arduino-esp32")