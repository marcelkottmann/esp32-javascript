#!/bin/bash

set -e

VERSION=v12.17.0
DISTRO=linux-x64

wget https://nodejs.org/dist/${VERSION}/node-${VERSION}-${DISTRO}.tar.xz

mkdir -p /usr/local/lib/nodejs
tar -xJvf node-$VERSION-$DISTRO.tar.xz -C /usr/local/lib/nodejs 
export PATH=/usr/local/lib/nodejs/node-$VERSION-$DISTRO/bin:$PATH

node -v
