#!/bin/bash

set -e

wget https://nodejs.org/dist/${VERSION}/node-${VERSION}-${DISTRO}.tar.xz
mkdir -p /usr/local/lib/nodejs
tar -xJvf node-$VERSION-$DISTRO.tar.xz -C /usr/local/lib/nodejs 
