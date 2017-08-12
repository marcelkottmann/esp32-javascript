try {
    timers = [];
    handles = 0;
    wifi = undefined;
    sockets = [];

    function setTimeout(fn, timeout) {
        var handle = handles++;
        timers.push({
            timeout: Date.now() + timeout,
            fn: fn,
            handle: handle,
            installed: false
        });
        return handle;
    }

    function sockConnect(host, port, onConnect, onData, onError, onClose) {
        var sockfd = el_createNonBlockingSocket();
        el_connectNonBlocking(sockfd, host, port);
        sockets.push({
            sockfd: sockfd,
            onData: onData,
            onConnect: onConnect,
            onError: onError,
            onClose: onClose,
            isConnected: false,
            isError: false,
            isListening: false
        });
    }

    function sockListen(port, onAccept, onError, onClose) {
        var sockfd = el_createNonBlockingSocket();
        var ret = el_bindAndListen(sockfd, port);
        if (ret < 0) {
            if (onError) {
                onError();
            }
        } else {
            sockets.push({
                sockfd: sockfd,
                onAccept: function () {
                    var newsockfd = el_acceptIncoming(sockfd);
                    var newSocket = {
                        sockfd: newsockfd,
                        isConnected: false,
                        isError: false,
                        isListening: false
                    };
                    sockets.push(newSocket);
                    if (onAccept) {
                        onAccept(newSocket);
                    }
                },
                onError: onError,
                onClose: onClose,
                isConnected: true,
                isError: false,
                isListening: true
            });
        }
    }

    function connectWifi(ssid, password, status) {
        wifi = {
            status: status,
        };
        connectWifiInternal(ssid, password);
    }

    function removeSocketFromSockets(sockfd) {
        for (var i = 0; i < sockets.length; i++) {
            if (sockets[i].sockfd === sockfd) {
                sockets.splice(i, 1);
                break;
            }
        }
    }

    function el_select_next() {
        //install all new timers
        for (var t = 0; t < timers.length; t++) {
            var timer = timers[t];
            if (!timer.installed) {
                el_install_timer(timer.timeout - Date.now(), timer.handle);
                timer.installed = true;
            }
        }

        //collect sockets
        var validSockets = sockets.filter(function (s) { return !s.isError; });
        var mapToSockfd = function (s) { return s.sockfd; };
        var notConnectedSockets = validSockets.filter(function (s) { return !s.isConnected && !s.isListening; }).map(mapToSockfd);
        var connectedSockets = validSockets.filter(function (s) { return s.isConnected }).map(mapToSockfd);
        el_registerSocketEvents(notConnectedSockets, connectedSockets);

        var events = el_suspend();

        // print('EVENTLOOP RECEIVES EVENTS:');
        // print(JSON.stringify(events));

        for (var evid = 0; evid < events.length; evid++) {
            var evt = events[evid];
            if (evt.type === 0) { //TIMER EVENT
                for (var timerIdx = 0; timerIdx < timers.length; timerIdx++) {
                    if (timers[timerIdx].handle === evt.status) {
                        var nextTimer = timers.splice(timerIdx, 1)[0];
                        return nextTimer.fn;
                    }
                }
                throw "UNKNOWN TIMER HANDLE!!!";
            } else if (evt.type === 1) { //WIFI EVENT
                return wifi.status.bind(this, evt);
            } else if (evt.type === 2) { //SOCKET EVENT
                var findSocket = sockets.filter(function (s) { return s.sockfd === evt.fd; });
                var socket = findSocket[0];
                if (evt.status === 0) //writable
                {
                    socket.isConnected = true;
                    return socket.onConnect.bind(this, socket);
                } else if (evt.status === 1) //readable
                {
                    if (socket.isListening) {
                        return socket.onAccept;
                    } else {
                        var data = readSocket(socket.sockfd);
                        if (data.length == 0) {
                            closeSocket(socket.sockfd);
                            removeSocketFromSockets(socket.sockfd);
                            return socket.onClose;
                        } else {
                            return socket.onData ? socket.onData.bind(this, data) : undefined;
                        }
                    }
                } else if (evt.status === 2) //error
                {
                    socket.isError = true;
                    return socket.onError;
                } else {
                    throw "UNKNOWN socket event status " + evt.status;
                }
            } else {
                throw "UNKNOWN eventType " + eventType;
            }
        }
    }

    nextfunc = main;
    while (true) {
        if (nextfunc) {
            nextfunc();
        }
        nextfunc = el_select_next();
    }
} catch (error) {
    print('JS ERROR: ' + error);
}