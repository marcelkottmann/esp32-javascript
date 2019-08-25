#!/bin/bash

npx jsdoc-to-markdown $(find components -iname '*.js') > api.md
