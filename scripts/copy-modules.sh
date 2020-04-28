#!/bin/bash
set -e

npx typescript@3.8.2
mkdir -p build/modules
rsync -r  --include="*.js" --exclude="*.ts" --delete components/*/modules/* build/modules
