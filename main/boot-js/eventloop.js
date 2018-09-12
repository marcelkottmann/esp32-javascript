try {
    errorHandler = typeof errorHandler === 'undefined' ?
        function (error) { print('DEFAULT ERROR HANDLER: ' + error + '\"' + error.message + '\" (' + error.lineNumber + ')') } :
        errorHandler;

    timers = [];
    handles = 0;
    wifi = undefined;
    sockets = [];
    socketspool = [];
    intervals = [];

    sockets.pushNative = sockets.push;
    sockets.push = function (items) {
        sockets.pushNative(items);
    }

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

    function clearInterval(handle) {
        var idx = intervals.indexOf(handle);
        if (idx >= 0) {
            intervals.splice(idx, 1);
        }
    }

    function installIntervalTimeout(handle, fn, timeout) {
        setTimeout(function () {
            if (intervals.indexOf(handle) >= 0) {
                fn();
                installIntervalTimeout(handle, fn, timeout);
            }
        }, timeout);
    }

    function setInterval(fn, timeout) {
        var handle = handles++;
        intervals.push(handle);
        installIntervalTimeout(handle, fn, timeout);
        return handle;
    }

    function initSocket(socket) {
        socket.sockfd = null;
        socket.onData = null;
        socket.onConnect = null;
        socket.onError = null;
        socket.onClose = null;
        socket.isConnected = false;
        socket.isError = false;
        socket.isListening = false;
        return socket;
    }

    function getOrCreateNewSocket() {
        var socket = null;

        if (socketspool.length > 0) {
            socket = socketspool.pop();
        } else {
            socket = initSocket({});
        }

        return socket;
    }

    function performOnClose(sockfd) {
        for (var i = 0; i < sockets.length; i++) {
            if (sockets[i].sockfd === sockfd) {
                if (sockets[i].onClose) {
                    sockets[i].onClose();
                    break;
                }
            }
        }
    }

    function closeSocket(sockfd) {
        el_closeSocket(sockfd);
        performOnClose(sockfd);
        removeSocketFromSockets(sockfd);
    }

    function sockConnect(host, port, onConnect, onData, onError, onClose) {
        var sockfd = el_createNonBlockingSocket();
        el_connectNonBlocking(sockfd, host, port);

        var socket = getOrCreateNewSocket();
        socket.sockfd = sockfd;
        socket.onData = onData;
        socket.onConnect = onConnect;
        socket.onError = onError;
        socket.onClose = onClose;
        socket.isConnected = false;
        socket.isError = false;
        socket.isListening = false;

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
            var socket = getOrCreateNewSocket();
            socket.sockfd = sockfd;

            socket.onAccept = function () {
                var newsockfd = el_acceptIncoming(sockfd);
                if (newsockfd < 0) {
                    onError();
                } else if (typeof newsockfd !== 'undefined') { //EAGAIN
                    var newSocket = getOrCreateNewSocket();
                    newSocket.sockfd = newsockfd;
                    newSocket.isConnected = false;
                    newSocket.isError = false;
                    newSocket.isListening = false;

                    sockets.push(newSocket);
                    if (onAccept) {
                        onAccept(newSocket);
                    }
                } else {
                    print('EAGAIN received after accept...');
                }
            };
            socket.onError = onError;
            socket.onClose = onClose;
            socket.isConnected = true;
            socket.isError = false;
            socket.isListening = true;

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

    function createSoftAp(ssid, password, status) {
        wifi = {
            status: status,
        };
        el_createSoftAp(ssid, password);
    }

    function removeSocketFromSockets(sockfd) {
        for (var i = 0; i < sockets.length; i++) {
            if (sockets[i].sockfd === sockfd) {
                var obsoleteSocket = sockets.splice(i, 1);
                if (obsoleteSocket.length === 1) {
                    socketspool.push(initSocket(obsoleteSocket[0]));
                }
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
                            if (data === null || (typeof data === 'string' && data.length == 0)) {
                                closeSocket(socket.sockfd);
                            } else if (!data) {
                                print('******** EAGAIN!!');
                            } else {
                                if (socket.onData) {
                                    collected.push(socket.onData.bind(this, data, socket.sockfd));
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
            } else if (evt.type === 3) { //LORA EVENT
                print('Lora event:' + JSON.stringify(evt));
                var data = getLoraData();
                if (data) {
                    print('Data received (len=' + data.length + '):');
                    var hex = '';
                    for (var i = 0; i < data.length; i++) {
                        hex += data[i].toString(16);
                    }
                    print('-->' + hex);
                }
            } else {
                throw "UNKNOWN eventType " + eventType;
            }
        }
        return collected;
    }

    nextfuncs = [main];
    while (true) {
        try {
            if (nextfuncs) {
                for (var nf = 0; nf < nextfuncs.length; nf++) {
                    if (nextfuncs[nf]) {
                        nextfuncs[nf]();
                    }
                }
                nextfuncs = null;
            }
            nextfuncs = el_select_next();
        } catch (error) {
            errorhandler(error);
        }
    }

} catch (error) {
    print('Unrecoverable JS error in event loop: ' + error + '\"' + error.message + '\" (' + error.lineNumber + ')')
}