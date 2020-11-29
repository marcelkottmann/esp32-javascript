FROM espressif/idf:release-v4.2

ADD . /opt/esp32-javascript
WORKDIR /opt/esp32-javascript

ENV VERSION=v12.17.0
ENV DISTRO=linux-x64
RUN ./tools/install-node.sh
ENV PATH="/usr/local/lib/nodejs/node-$VERSION-$DISTRO/bin:${PATH}"
