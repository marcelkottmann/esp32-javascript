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

    function sockConnect(host, port, onConnect, onData, onError) {
        var sockfd = el_createNonBlockingSocket();
        el_connectNonBlocking(sockfd, host, port);
        sockets.push({
            sockfd: sockfd,
            onData: onData,
            onConnect: onConnect,
            onError: onError,
            isConnected: false,
            isError: false
        });
    }

    function connectWifi(ssid, password, status) {
        wifi = {
            status: status,
        };
        connectWifiInternal(ssid, password);
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
        var notConnectedSockets = validSockets.filter(function (s) { return !s.isConnected; }).map(mapToSockfd);
        var connectedSockets = validSockets.filter(function (s) { return s.isConnected; }).map(mapToSockfd);
        el_registerSocketEvents(notConnectedSockets, connectedSockets);

        var events = el_suspend();

        print('EVENTS RECEIVED:');
        print(JSON.stringify(events));

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
                    print("SOCKET " + socket.sockfd + " HAS CONNECTED.");
                    return socket.onConnect;
                } else if (evt.status === 1) //readable
                {
                    print("SOCKET " + socket.sockfd + " IS READY TO READ DATA.");
                    return socket.onData;
                } else if (evt.status === 2) //error
                {
                    print('UPDATE STATE');
                    socket.isError = true;
                    print("SOCKET " + socket.sockfd + " IS IN ERROR STATE.");
                    return socket.onError;
                } else {
                    throw "UNKNOWN socket event status " + evt.status;
                }
                return function () { print('SOCKET FUNCTION'); };
            } else {
                throw "UNKNOWN eventType " + eventType;
            }
        }
    }

    nextfunc = main;
    do {
        nextfunc();
        nextfunc = el_select_next(timers);
    } while (nextfunc);
} catch (error) {
    print('JS ERROR: ' + error);
}