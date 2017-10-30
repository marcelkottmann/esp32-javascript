errorhandler = function (error) {
    print('CUSTOM ERROR HANDLER: ' + error + '\"' + error.message + '\" (' + error.lineNumber + ')');
    startSoftApMode();
};

pinMode(KEY_BUILTIN, INPUT);
pinMode(LED_BUILTIN, OUTPUT);

var requestHandler = [];
var successfulWifiConnected = false;

function startConfigServer() {
    httpServer(9999, function (req, res) {
        if (req.path === '/restart') {
            if (req.method === 'GET') {
                res.end(page('Request restart', '<form action="/restart" method="post"><input type="submit" value="Restart" /></form>'));
            } else {
                res.end(page('Restarting...', ''));
                restart();
            }
        } else if (req.path === '/setup') {
            if (req.method === 'GET') {
                res.end(page('Setup', '<form action="/setup" method="post">' +
                    'SSID: <input type="text" name="ssid" value="' + el_load('config.ssid') + '" /><br />' +
                    'Password: <input type="text" name="password" value="' + el_load('config.password') + '" /><br />' +
                    'JS File URL: <input type="text" name="url" value="' + el_load('config.url') + '" />' +
                    '<input type="submit" value="Save" /></form>'));
            } else {
                var config = parseQueryStr(req.body);
                el_store('config.ssid', config.ssid);
                el_store('config.password', config.password);
                el_store('config.url', config.url);

                res.end(page('Saved', JSON.stringify(config)));
            }
        } else {
            for (var i = 0; i < requestHandler.length; i++) {
                if (!res.isEnded) {
                    requestHandler[i](req, res);
                }
            }
            if (!res.isEnded) {
                res.end(page('404', 'Not found'));
            }
        }
    });
}

function blink() {
    var blinkState = 0;
    return setInterval(function () {
        digitalWrite(LED_BUILTIN, blinkState);
        blinkState = blinkState === 0 ? 1 : 0;
    }, 333);
}

function startSoftApMode() {
    print("Starting soft ap mode:");
    var blinkId = blink();
    createSoftAp('esp32', '', function (evt) {
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

function connectToWifi() {
    var retries = 0;
    connectWifi(config.wlan.ssid, config.wlan.password, function (evt) {
        if (evt.status === 0) {
            print("WIFI: DISCONNECTED");
            retries++;
            if (!successfulWifiConnected && retries >= 5) {
                startSoftApMode();
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
                if (config.ota.url) {
                    print('Loading program from: ' + JSON.stringify(config.ota.url));
                    var ret = sockConnect(config.ota.url.host, config.ota.url.port,
                        function (socket) {
                            writeSocket(socket.sockfd, 'GET ' + config.ota.url.path + ' HTTP/1.1\r\nHost: ' + config.ota.url.host + '\r\nConnection: close\r\n\r\n');
                        },
                        function (data) {
                            complete = complete + data;

                            if (!headerRead && (headerEnd = complete.indexOf('\r\n\r\n')) >= 0) {
                                headerRead = true;
                                chunked = complete.toLowerCase().indexOf('transfer-encoding: chunked') != -1;
                                headerEnd += 4;
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

                            print('==> Start evaluation:');
                            print(content);
                            print('<==');

                            eval(content);
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
    if (digitalRead(KEY_BUILTIN) == 0) {
        print('Setup key pressed: Start soft ap...');
        startSoftApMode();
    } else {
        print('Trying to connect to Wifi from JS:');
        connectToWifi();
    }
}