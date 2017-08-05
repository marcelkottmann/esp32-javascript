function main() {
    connectWifi('HAL9000-2.4', 'HalloDuArsch!!!', function () {
        print("SUCCESSFULLY CONNECTED!!!!");
        setTimeout(function(){}, 1);
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