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
        var socket = {
            sockfd: sockfd,
            onData: onData,
            onConnect: onConnect,
            onError: onError,
            onClose: onClose,
            isConnected: false,
            isError: false,
            isListening: false
        };
        sockets.push(socket);
        return socket;
    }

    function sockListen(port, onAccept, onError, onClose) {
        var sockfd = el_createNonBlockingSocket();
        var ret = el_bindAndListen(sockfd, port);
        if (ret < 0) {
            if (onError) {
                onError();
            }
            return null;
        } else {
            var socket = {
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
            };
            sockets.push(socket);
            return socket;
        }
    }

    function connectWifi(ssid, password, status) {
        wifi = {
            status: status,
        };
        el_connectWifi(ssid, password);
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
        var collected = [];
        for (var evid = 0; evid < events.length; evid++) {
            var evt = events[evid];
            if (evt.type === 0) { //TIMER EVENT
                var nextTimer = null;
                for (var timerIdx = 0; timerIdx < timers.length; timerIdx++) {
                    if (timers[timerIdx].handle === evt.status) {
                        nextTimer = timers.splice(timerIdx, 1)[0];
                        collected.push(nextTimer.fn);
                    }
                }
                if (!nextTimer) {
                    throw "UNKNOWN TIMER HANDLE!!!";
                }
            } else if (evt.type === 1) { //WIFI EVENT
                collected.push(wifi.status.bind(this, evt));
            } else if (evt.type === 2) { //SOCKET EVENT
                var findSocket = sockets.filter(function (s) { return s.sockfd === evt.fd; });
                var socket = findSocket[0];
                if (socket) {
                    if (evt.status === 0) //writable
                    {
                        socket.isConnected = true;
                        if (socket.onConnect) {
                            collected.push(socket.onConnect.bind(this, socket));
                        }
                    } else if (evt.status === 1) //readable
                    {
                        if (socket.isListening && socket.onAccept) {
                            collected.push(socket.onAccept);
                        } else {
                            var data = readSocket(socket.sockfd);
                            if (data.length == 0) {
                                closeSocket(socket.sockfd);
                                removeSocketFromSockets(socket.sockfd);
                                if (socket.onClose) {
                                    collected.push(socket.onClose);
                                }
                            } else {
                                if (socket.onData) {
                                    collected.push(socket.onData.bind(this, data));
                                }
                            }
                        }
                    } else if (evt.status === 2) //error
                    {
                        socket.isError = true;
                        collected.push(socket.onError);
                    } else {
                        throw "UNKNOWN socket event status " + evt.status;
                    }
                }
            } else {
                throw "UNKNOWN eventType " + eventType;
            }
        }
        return collected;
    }


    nextfuncs = [main];
    while (true) {
        for (var i = 0; i < nextfuncs.length; i++) {
            if (nextfuncs[i]) {
                nextfuncs[i]();
            }
        }
        nextfuncs = el_select_next();
    }
} catch (error) {
    print('JS ERROR: ' + error + '\"' + error.message + '\" (' + error.lineNumber + ')');
}