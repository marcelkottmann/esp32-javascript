idf_component_register(SRC_DIRS "."
                    INCLUDE_DIRS "include"
                    REQUIRES "duktape" "esp32-javascript"
                    EMBED_TXTFILES "loader.js")