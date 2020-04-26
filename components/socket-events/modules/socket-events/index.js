Object.defineProperty(exports, "__esModule", { value: true });
exports.sockListen = exports.sockConnect = exports.closeSocket = exports.sockets = void 0;
var esp32_js_eventloop_1 = require("esp32-js-eventloop");
var sslClientCtx;
exports.sockets = [];
exports.sockets.pushNative = exports.sockets.push;
exports.sockets.push = function (item) {
    exports.sockets.pushNative(item);
};
exports.sockets.find = function (predicate) {
    for (var i = 0; i < exports.sockets.length; i++) {
        if (predicate(exports.sockets[i])) {
            return exports.sockets[i];
        }
    }
};
/**
 * @class
 */
var Socket = /** @class */ (function () {
    function Socket() {
        this.defaultBufferSize = 3 * 1024;
        this.dataBuffer = new Uint8Array(this.defaultBufferSize);
        this.dataBufferSize = 0;
        this.textEncoder = new TextEncoder();
        this.writebuffer = [];
        this.readTimeout = -1; // infinite
        this.readTimeoutHandle = -1;
        /**
         * The socket file descriptor.
         * @type {number}
         */
        this.sockfd = -1;
        /**
         * The onData callback.
         * @type {module:socket-events~onDataCB}
         */
        this.onAccept = null;
        this.onData = null;
        this.onConnect = null;
        this.onError = null;
        this.onClose = null;
        this.onWritable = null;
        this.isConnected = false;
        this.isError = false;
        this.isListening = false;
        this.ssl = null;
        this.flushAlways = true;
    }
    Socket.prototype.setReadTimeout = function (readTimeout) {
        this.readTimeout = readTimeout;
        this.extendReadTimeout();
    };
    Socket.prototype.clearReadTimeoutTimer = function () {
        if (this.readTimeoutHandle >= 0) {
            clearTimeout(this.readTimeoutHandle);
        }
    };
    Socket.prototype.extendReadTimeout = function () {
        var _this = this;
        this.clearReadTimeoutTimer();
        if (this.readTimeout > 0) {
            this.readTimeoutHandle = setTimeout(function () {
                console.log("Close socket because of read timeout.");
                closeSocket(_this);
            }, this.readTimeout);
        }
    };
    Socket.prototype.write = function (data) {
        if (this.dataBuffer) {
            if (typeof data === "undefined" || data === null) {
                return;
            }
            else if (Array.isArray(data)) {
                throw Error("arrays not allowed anymore");
            }
            else if (typeof data === "string") {
                // prevents size transmission problems for non-asci-data
                data = this.textEncoder.encode(data);
            }
            else if (Object.prototype.toString.call(data) !== "[object Uint8Array]") {
                throw Error("only strings and Uint8Array are supported");
            }
            // data is now always Uint8Array
            if (data.length + this.dataBufferSize > this.dataBuffer.length) {
                this.flush();
            }
            if (data.length > this.dataBuffer.length) {
                // enlarge default buffer
                this.dataBuffer = data;
            }
            else {
                this.dataBuffer.set(data, this.dataBufferSize);
            }
            this.dataBufferSize += data.length;
        }
    };
    Socket.prototype.flush = function (cb) {
        var onWritable = function (socket) {
            socket.onWritable = null;
            while (socket.writebuffer.length > 0) {
                var entry = socket.writebuffer[0];
                var written = entry.written;
                var data = entry.data;
                var len = entry.len;
                if (written < len) {
                    if (socket.sockfd === null) {
                        console.error("error writing to socket. not initialized.");
                        break;
                    }
                    else {
                        console.debug("before write to socket");
                        var ret = writeSocket(socket.sockfd, data, len - written, written, socket.ssl);
                        console.debug("after write to socket");
                        if (ret == 0) {
                            // eagain, return immediately and wait for futher onWritable calls
                            console.debug("eagain in onWritable, socket " + socket.sockfd);
                            // wait for next select when socket is writable
                            break;
                        }
                        if (ret >= 0) {
                            written += ret;
                            entry.written = written;
                        }
                        else {
                            console.error("error writing to socket:" + ret);
                            break;
                        }
                    }
                }
                if (written >= len) {
                    // remove entry because it has been written completely.
                    console.debug("// remove entry because it has been written completely.");
                    socket.writebuffer.shift();
                    if (entry.cb) {
                        entry.cb();
                    }
                }
            }
            var bufferEmpty = socket.writebuffer.length === 0;
            if (!bufferEmpty) {
                socket.onWritable = onWritable;
            }
            return bufferEmpty;
        };
        if (this.dataBufferSize > 0 && this.dataBuffer) {
            this.writebuffer.push({
                data: this.dataBuffer,
                written: 0,
                len: this.dataBufferSize,
                cb: cb,
            });
            var writtenCompletely = onWritable(this);
            if (!writtenCompletely) {
                // if not written completely the buffer was stored in write queue
                // and a new buffer must be created to prevent race conditions
                this.dataBuffer = new Uint8Array(this.defaultBufferSize);
            }
            this.dataBufferSize = 0;
        }
    };
    return Socket;
}());
function getOrCreateNewSocket() {
    return new Socket();
}
function performOnClose(socket) {
    if (socket && socket.onClose) {
        socket.onClose(socket.sockfd);
    }
}
/**
 * Flushes buffered writes, shutdowns SSL (if it is a secure socket),
 * close the socket, performs the close callback function, removes
 * socket from {@link module:socket-events.sockets}.
 *
 * @param {(module:socket-events~Socket|number)}
 */
function closeSocket(socketOrSockfd) {
    var socket = null;
    if (typeof socketOrSockfd === "number") {
        socket = exports.sockets.find(function (s) {
            return s.sockfd === socketOrSockfd;
        });
    }
    else if (typeof socketOrSockfd === "object") {
        socket = exports.sockets.find(function (s) {
            return s.sockfd === socketOrSockfd.sockfd;
        });
    }
    if (!socket) {
        console.debug("Socket not found for closing! Maybe already closed, doing nothing.");
        return;
    }
    //User should flush socket theirself
    //socket.flush();
    if (socket.ssl) {
        shutdownSSL(socket.ssl);
    }
    socket.clearReadTimeoutTimer();
    el_closeSocket(socket.sockfd);
    if (socket.ssl) {
        freeSSL(socket.ssl);
    }
    performOnClose(socket);
    resetSocket(socket);
}
exports.closeSocket = closeSocket;
/**
 * Connects to specified host and port.
 *
 * @param {boolean} ssl If we want to connect via SSL.
 * @param {string} host The remote hostname.
 * @param {number} port The remote port.
 * @param {module:socket-events~onConnectCB} onConnect A callback which gets called on connect event.
 * @param {module:socket-events~onDataCB} onData A callback which gets called on a data event.
 * @param {module:socket-events~onErrorCB} onError A callback which gets called on an error event.
 * @param {module:socket-events~onCloseCB} onClose A callback which gets called on a close event.
 *
 * @returns {module:socket-events~Socket} The socket.
 */
function sockConnect(ssl, host, port, onConnect, onData, onError, onClose) {
    var sockfd = el_createNonBlockingSocket();
    el_connectNonBlocking(sockfd, host, parseInt(port, 10));
    var socket = getOrCreateNewSocket();
    socket.sockfd = sockfd;
    socket.onData = onData;
    socket.onConnect = onConnect;
    socket.onError = onError;
    socket.onClose = onClose;
    socket.isConnected = false;
    socket.isError = false;
    socket.isListening = false;
    socket.ssl = null;
    if (ssl) {
        sslClientCtx =
            typeof sslClientCtx === "undefined"
                ? createSSLClientContext()
                : sslClientCtx;
        socket.ssl = createSSL(sslClientCtx, host);
        socket.onConnect = function (skt) {
            var result = connectSSL(skt.ssl, skt.sockfd);
            if (result == 0) {
                // retry
                return true;
            }
            else if (result < 0) {
                console.error("error connecting ssl: " + result);
                closeSocket(socket);
                return false;
            }
            else {
                return onConnect(skt);
            }
        };
    }
    if (exports.sockets.indexOf(socket) < 0) {
        exports.sockets.push(socket);
    }
    return socket;
}
exports.sockConnect = sockConnect;
function sockListen(port, onAccept, onError, onClose, isSSL) {
    var sslCtx = null;
    if (isSSL) {
        sslCtx = createSSLServerContext();
    }
    var sockfd = el_createNonBlockingSocket();
    var ret = el_bindAndListen(sockfd, parseInt("" + port, 10));
    if (ret < 0) {
        if (onError) {
            onError(sockfd);
        }
        return null;
    }
    else {
        var socket = getOrCreateNewSocket();
        socket.sockfd = sockfd;
        socket.onAccept = function () {
            var ssl = null;
            if (isSSL) {
                ssl = createSSL(sslCtx);
            }
            var newsockfd = el_acceptIncoming(sockfd);
            if (newsockfd < 0) {
                console.error("accept returned: " + newsockfd);
                onError(sockfd);
            }
            else if (typeof newsockfd !== "undefined") {
                //EAGAIN
                var newSocket = getOrCreateNewSocket();
                newSocket.sockfd = newsockfd;
                newSocket.isConnected = false;
                newSocket.isError = false;
                newSocket.isListening = false;
                newSocket.ssl = ssl;
                if (exports.sockets.indexOf(newSocket) < 0) {
                    exports.sockets.push(newSocket);
                }
                if (onAccept) {
                    onAccept(newSocket);
                }
                if (isSSL) {
                    var sslConnected = acceptSSL(ssl, newsockfd);
                    if (sslConnected <= 0) {
                        closeSocket(newsockfd);
                    }
                }
            }
            else {
                console.debug("EAGAIN received after accept...");
            }
        };
        socket.onError = function (sockfd) {
            console.error("Default error handler: " + sockfd);
        };
        socket.onClose = function (sockfd) {
            console.info("Default close handler: " + sockfd);
        };
        socket.isConnected = true;
        socket.isError = false;
        socket.isListening = true;
        if (exports.sockets.indexOf(socket) < 0) {
            exports.sockets.push(socket);
        }
        return socket;
    }
}
exports.sockListen = sockListen;
function resetSocket(socket) {
    if (socket) {
        exports.sockets.splice(exports.sockets.indexOf(socket), 1);
        return;
    }
    throw Error("invalid sockfd");
}
function beforeSuspend() {
    //collect sockets
    function notConnectedFilter(s) {
        return !s.isConnected && !s.isListening;
    }
    function connectedFilter(s) {
        return s.isConnected;
    }
    function connectedWritableFilter(s) {
        return s.isConnected && s.onWritable;
    }
    function mapToSockfd(s) {
        return s.sockfd;
    }
    function validSocketsFilter(s) {
        return s.sockfd && !s.isError;
    }
    var validSockets = exports.sockets.filter(validSocketsFilter);
    var notConnectedSockets = validSockets
        .filter(notConnectedFilter)
        .map(mapToSockfd);
    var connectedSockets = validSockets
        .filter(connectedFilter)
        .map(mapToSockfd);
    var connectedWritableSockets = validSockets
        .filter(connectedWritableFilter)
        .map(mapToSockfd);
    el_registerSocketEvents(notConnectedSockets, connectedSockets, connectedWritableSockets);
}
// eslint-disable-next-line @typescript-eslint/ban-types
function afterSuspend(evt, collected) {
    if (evt.type === EL_SOCKET_EVENT_TYPE) {
        var findSocket = exports.sockets.filter(function (s) {
            return s.sockfd === evt.fd;
        });
        var socket_1 = findSocket[0];
        if (socket_1) {
            if (evt.status === 0) {
                //writable
                if (!socket_1.isConnected && socket_1.onConnect) {
                    collected.push((function (socket) {
                        return function () {
                            var retry = socket.onConnect(socket);
                            socket.isConnected = !retry;
                        };
                    })(socket_1));
                }
                else if (!socket_1.isConnected) {
                    socket_1.isConnected = true;
                }
                if (socket_1.isConnected && socket_1.onWritable) {
                    collected.push((function (socket) {
                        return function () {
                            socket.onWritable(socket);
                        };
                    })(socket_1));
                }
            }
            else if (evt.status === 1) {
                //readable
                if (socket_1.isListening && socket_1.onAccept) {
                    collected.push(socket_1.onAccept);
                }
                else {
                    console.debug("before eventloop read socket");
                    var result = readSocket(socket_1.sockfd, socket_1.ssl);
                    console.debug("after eventloop read socket");
                    if (result === null ||
                        (result && typeof result.data === "string" && result.length == 0)) {
                        closeSocket(socket_1.sockfd);
                    }
                    else if (!result) {
                        console.debug("******** EAGAIN!!");
                    }
                    else {
                        if (socket_1.onData) {
                            socket_1.extendReadTimeout();
                            collected.push((function (data, fd, length) {
                                return function () {
                                    socket_1.onData(data, fd, length);
                                };
                            })(result.data, socket_1.sockfd, result.length));
                        }
                    }
                }
            }
            else if (evt.status === 2) {
                //error
                socket_1.isError = true;
                if (socket_1.onError) {
                    collected.push((function (sockfd) {
                        return function () {
                            socket_1.onError(sockfd);
                        };
                    })(socket_1.sockfd));
                }
            }
            else {
                throw Error("UNKNOWN socket event status " + evt.status);
            }
        }
        return true;
    }
    return false;
}
esp32_js_eventloop_1.beforeSuspendHandlers.push(beforeSuspend);
esp32_js_eventloop_1.afterSuspendHandlers.push(afterSuspend);
