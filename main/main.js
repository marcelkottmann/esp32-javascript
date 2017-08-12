function main() {
    connectWifi('HAL9000-2.4', 'HalloDuArsch!!!', function (evt) {
        if (evt.status === 0) {
            print("WIFI: DISCONNECTED");
        } else if (evt.status === 1) {
            sockConnect("192.168.188.40", 9999,
                function () { print('ON CONNECT') },
                function () { print('DATA AVAILABLE') },
                function () { print('ON ERROR') });
        } else if (evt.status === 2) {
            print("WIFI: CONNECTING...");
        }
    });
}