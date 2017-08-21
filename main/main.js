function main() {
    print("Trying to connect to Wifi from JS:");
    connectWifi(config.wlan.ssid, config.wlan.password, function (evt) {
        if (evt.status === 0) {
            print("WIFI: DISCONNECTED");
        } else if (evt.status === 1) {
            var complete = '';
            sockConnect(config.ota.host, config.ota.port,
                function (socket) {
                    writeSocket(socket.sockfd, 'GET ' + config.ota.path + ' HTTP/1.0\r\nHost: localhost\r\nConnection: close\r\n\r\n');
                },
                function (data) {
                    complete = complete + data;
                },
                function () {
                    print('Could not load http://' + config.ota.host + ':' + config.ota.port + config.ota.path);
                },
                function () {
                    var i = complete.indexOf('\r\n\r\n') + 4;
                    var content = complete.substring(i);
                    print('==> Start evaluation:');
                    print(content);
                    print('<==');
                    eval(content);
                });
        } else if (evt.status === 2) {
            print("WIFI: CONNECTING...");
        }
    });
}