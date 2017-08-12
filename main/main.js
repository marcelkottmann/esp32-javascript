function printSocketStatus(sockfd, sockfd2, sockfd3) {
    setTimeout(function () {
        print("socket status=" + el_socket_stats([sockfd, sockfd2, sockfd3]));
        printSocketStatus(sockfd, sockfd2, sockfd3);
    }, 1000);
}

function main() {
    connectWifi('HAL9000-2.4', 'HalloDuArsch!!!', function (evt) {
        if (evt.status === 0) {
            print("WIFI: DISCONNECTED");
        } else if (evt.status === 1) {
            var sockfd = createNonBlockingSocket();
            var sockfd2 = createNonBlockingSocket();
            var sockfd3 = createNonBlockingSocket();

            connectNonBlocking(sockfd, '192.168.188.40', 9998);
            connectNonBlocking(sockfd2, '192.168.188.40', 9999);
            connectNonBlocking(sockfd3, '192.168.188.40', 9997);

            printSocketStatus(sockfd, sockfd2, sockfd3);
        } else if (evt.status === 2) {
            print("WIFI: CONNECTING...");
        }
    });
}