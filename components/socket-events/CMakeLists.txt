idf_component_register(SRC_DIRS "."
                    INCLUDE_DIRS "../../components/arduino-esp32/include/$ENV{IDF_TARGET}/" "include"
                    REQUIRES "esp32-javascript" "openssl"
                    EMBED_TXTFILES "cacert.pem" "prvtkey.pem")