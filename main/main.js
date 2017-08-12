function printSocketStatus(sockfd) {
    setTimeout(function () {
        var status = getSocketStatus(sockfd);
        print("socket status=" + JSON.stringify(status));

        if (status.error) {
            closeSocket(sockfd);
        } else if (status.readable) {
            var cfd = acceptIncoming(sockfd);
            writeSocket(cfd, "Helo Socket!");
            closeSocket(cfd);
        } else {
            printSocketStatus(sockfd);
        }
    }, 1000);
}

function main() {
    connectWifi('HAL9000-2.4', 'HalloDuArsch!!!', function (evt) {
        if (evt.status === 0) {
            print("WIFI: DISCONNECTED");
        } else if (evt.status === 1) {
            print("WIFI: SUCCESSFULLY CONNECTED!!!!");
            var sockfd = createNonBlockingSocket();
            print("SOCKET CREATED: " + sockfd);
            var ret = bindAndListen(sockfd, 9999);
            print("connect ret=" + ret);

            pinMode(2, OUTPUT);
            digitalWrite(2, HIGH);

            printSocketStatus(sockfd);
        } else if (evt.status === 2) {
            print("WIFI: CONNECTING...");
        }
    });
    // pinMode(2, OUTPUT);
    // blinkON();
}

function blinkON() {
    digitalWrite(2, HIGH);
    setTimeout(blinkOFF, 1000);
}

function blinkOFF() {
    digitalWrite(2, LOW);
    setTimeout(blinkON, 1000);
}