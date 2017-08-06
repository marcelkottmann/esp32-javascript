function main() {
    connectWifi('HAL9000-2.4', 'HalloDuArsch!!!', function (evt) {
        if (evt.status === 0) {
            print("WIFI: DISCONNECTED");
        } else if (evt.status === 1) {
            print("WIFI: SUCCESSFULLY CONNECTED!!!!");
            socketClient();
        } else if (evt.status === 2) {
            print("WIFI: CONNECTING...");
        }
    });
    pinMode(2, OUTPUT);
    blinkON();
}

function blinkON() {
    digitalWrite(2, HIGH);
    setTimeout(blinkOFF, 1000);
}

function blinkOFF() {
    digitalWrite(2, LOW);
    setTimeout(blinkON, 1000);
}