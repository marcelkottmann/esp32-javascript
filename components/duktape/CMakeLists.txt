idf_component_register(SRC_DIRS "."
                    INCLUDE_DIRS "include")

set_source_files_properties(duktape.c
    PROPERTIES COMPILE_FLAGS
    -Wno-error=maybe-uninitialized
)