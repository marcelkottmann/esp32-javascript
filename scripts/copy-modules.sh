#!/bin/bash
set -e

npm install
npx tsc
rm -rf build/modules
npx cp2 --verbose 'components/**/modules/**/*.js' 'f=>f.replace(/components\/([^\/]+)/,"build")'
