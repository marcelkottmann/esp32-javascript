#!/bin/bash

set -e

# standard build
idf.py build
tar cvzf build.tar.gz build/*.bin build/*/*.bin

#self-test build
cp ./components/esp32-javascript/modules/esp32-javascript/self-test-firmware-config.ts ./components/esp32-javascript/modules/esp32-javascript/firmware-config.ts
idf.py build
tar cvzf self-test-build.tar.gz build/*.bin build/*/*.bin
