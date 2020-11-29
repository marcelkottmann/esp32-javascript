#!/bin/bash
set -e

npm install
npx tsc
rm -rf build/modules build/raw/modules
npx cp2 --verbose 'components/**/modules/**/*.js' 'f=>f.replace(/components\/([^\/]+)/,"build/raw")'
npx babel build/raw/modules -d build/modules