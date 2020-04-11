idf_component_register(SRC_DIRS "."
                    INCLUDE_DIRS "include"
                    REQUIRES "esp32-javascript" "openssl"
                    EMBED_TXTFILES "cacert.pem" "prvtkey.pem")