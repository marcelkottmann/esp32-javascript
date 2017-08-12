function main() {
    print("Trying to connect to Wifi from JS:");
    connectWifi('HAL9000-2.4', 'HalloDuArsch!!!', function (evt) {
        if (evt.status === 0) {
            print("WIFI: DISCONNECTED");
        } else if (evt.status === 1) {
            var complete = '';
            sockConnect("192.168.188.40", 80,
                function (socket) {
                    writeSocket(socket.sockfd, 'GET /esp32.js HTTP/1.0\r\nHost: localhost\r\nConnection: close\r\n\r\n');
                },
                function (data) {
                    complete = complete + data;
                },
                function () {
                    print('ON ERROR');
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