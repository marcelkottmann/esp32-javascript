errorhandler = function (error) {
    print('CUSTOM ERROR HANDLER: ' + error + '\"' + error.message + '\" (' + error.lineNumber + ')');
    startSoftApMode();
};

pinMode(KEY_BUILTIN, INPUT);
pinMode(LED_BUILTIN, OUTPUT);

var successfulWifiConnected = false;

function blink() {
    var blinkState = 0;
    return setInterval(function () {
        digitalWrite(LED_BUILTIN, blinkState);
        blinkState = blinkState === 0 ? 1 : 0;
    }, 333);
}

function startSoftApMode() {
    print("Starting soft ap mode.");
    var blinkId = blink();
    print("Blinking initialized.");
    createSoftAp('esp32', '', function (evt) {
        print("Event received:" + evt);
        if (evt.status === 1) {
            print("SoftAP: Connected");
            startConfigServer();

            //stop soft ap wifi after 5 minutes
            setTimeout(function () {
                print('Stopping soft ap now after 5 minutes.');
                stopWifi();
                clearInterval(blinkId);
            }, 5 * 60 * 1000);
        }
        else if (evt.status === 0) {
            print("SoftAP: Disconnected");
        } else {
            print("SoftAP: Status " + evt.status);
        }
    });
}

function evalScript(content, headers) {
    print('==> Headers:');
    print(headers);
    print('==> Start evaluation:');
    print(content);
    print('<==');

    digitalWrite(LED_BUILTIN, 0);

    eval(content);
}

function connectToWifi() {
    digitalWrite(LED_BUILTIN, 1);

    var retries = 0;
    connectWifi(config.wlan.ssid, config.wlan.password, function (evt) {
        if (evt.status === 0) {
            print("WIFI: DISCONNECTED");
            retries++;
            if (!successfulWifiConnected && retries === 5) {
                if (config.ota.offline) {
                    stopWifi();
                    evalScript(el_load('config.script'));
                } else {
                    startSoftApMode();
                }
            }
        } else if (evt.status === 1) {
            if (!successfulWifiConnected) {
                print("WIFI: CONNECTED");
                successfulWifiConnected = true;
                startConfigServer();

                retries = 0;
                var complete = '';
                var chunked = false;
                var headerRead = false;
                var headerEnd = -1;
                var contentLength = -1;
                if (config.ota.url) {
                    print('Loading program from: ' + JSON.stringify(config.ota.url));
                    var ret = sockConnect(config.ota.url.host, config.ota.url.port,
                        function (socket) {
                            writeSocket(socket.sockfd, 'GET ' + config.ota.url.path + ' HTTP/1.1\r\nHost: ' + config.ota.url.host + '\r\n\r\n');
                        },
                        function (data, sockfd) {
                            complete = complete + data;

                            if (!headerRead && (headerEnd = complete.indexOf('\r\n\r\n')) >= 0) {
                                headerRead = true;
                                chunked = complete.toLowerCase().indexOf('transfer-encoding: chunked') >= 0;
                                var clIndex = complete.toLowerCase().indexOf('content-length: ');
                                if (clIndex >= 0) {
                                    var endOfContentLength = complete.indexOf('\r\n', clIndex);
                                    contentLength = parseInt(complete.substring(clIndex + 15, endOfContentLength));
                                }
                                headerEnd += 4;
                            }
                            if (chunked) {
                                if (complete.substring(complete.length - 5) == '0\r\n\r\n') {
                                    print('Closing...');
                                    closeSocket(sockfd);
                                }
                            }
                            if (contentLength >= 0) {
                                if ((complete.length - headerEnd) == contentLength) {
                                    print('Closing...');
                                    closeSocket(sockfd);
                                }
                            }
                        },
                        function () {
                            print('Could not load http://' + config.ota.url.host + ':' + config.ota.url.port + config.ota.url.path);
                            startSoftApMode();
                        },
                        function () {
                            var startFrom = headerEnd;
                            var content = null;

                            if (chunked) {
                                content = "";

                                do {
                                    var chunkLengthEnd = complete.indexOf('\r\n', startFrom);
                                    var lengthStr = complete.substring(startFrom, chunkLengthEnd);
                                    chunkLength = parseInt(lengthStr, 16);
                                    var chunkEnd = chunkLengthEnd + chunkLength + 2;

                                    content += complete.substring(chunkLengthEnd + 2, chunkEnd);
                                    startFrom = chunkEnd + 2;
                                } while (chunkLength > 0);
                            } else {
                                content = complete.substring(startFrom);
                            }

                            var headers = complete.substring(0, headerEnd);
                            //free complete for GC
                            complete = null;

                            if (config.ota.offline) {
                                el_store('config.script', content);
                                print('==> Saved offline script length=' + content.length);
                            } else {
                                print('==> NOT saving offline script');
                            }
                            evalScript(content, headers);
                        });
                } else {
                    print('No OTA (Over-the-air) url specified.');
                    startSoftApMode();
                }
            }
        } else if (evt.status === 2) {
            print("WIFI: CONNECTING...");
        }
    });
}

function main() {
    print('result: ' + btoa('esp32:esp32'));
    if (digitalRead(KEY_BUILTIN) == 0) {
        print('Setup key pressed: Start soft ap...');
        startSoftApMode();
    } else {
        print('Trying to connect to Wifi from JS:');
        connectToWifi();
    }
}