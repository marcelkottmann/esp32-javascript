/**
 * @module socket-events
 */

/**
* Callback for connect event.
*
* @callback onConnectCB
* @param {module:socket-events~Socket} socket The socket.
* @returns {boolean} If the connection attempt should be retried.
*/
/**
 * Callback for data event.
 *
 * @callback onDataCB
 * @param {string} data Data that was received on the socket.
 * @param {number} sockfd The socket file descriptor.
 * @param {number} length The length of the data.
 */
/**
 * Callback for error event.
 *
 * @callback onErrorCB
 * @param {number} sockfd The socket file descriptor.
 */
/**
 * Callback for close event.
 *
 * @callback onCloseCB
 * @param {number} sockfd The socket file descriptor.
 */

var eventloop = require('esp32-js-eventloop');
var beforeSuspendHandlers = eventloop.beforeSuspendHandlers;
var afterSuspendHandlers = eventloop.afterSuspendHandlers;

/**
 * An array which holds all active sockets.
 * 
 * @type module:socket-events~Socket[]
 */
exports.sockets = [];
var sockets = exports.sockets;

sockets.pushNative = sockets.push;
sockets.push = function (items) {
	sockets.pushNative(items);
}
sockets.find = function (predicate) {
	for (var i = 0; i < sockets.length; i++) {
		if (predicate(sockets[i])) {
			return sockets[i];
		}
	}
}
/**
 * @class
 */
var Socket = function () {
	this.defaultBufferSize = 3 * 1024;
	this.dataBuffer = new Uint8Array(this.defaultBufferSize);
	this.dataBufferSize = 0;
	this.textEncoder = new TextEncoder();
	this.writebuffer = [];

	/**
	 * The socket file descriptor.
	 * @type {number}
	 */
	this.sockfd = null;

	/**
	 * The onData callback.
	 * @type {module:socket-events~onDataCB}
	 */
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

function getOrCreateNewSocket() {
	return new Socket();
}

Socket.prototype.write = function (data) {
	if (this.dataBuffer) {
		if (typeof data === 'undefined' || data === null) {
			return;
		} else if (Array.isArray(data)) {
			throw Error('arrays not allowed anymore');
		} else if (typeof data === 'string' || typeof data === 'number') {
			// prevents size transmission problems for non-asci-data
			data = this.textEncoder.encode(data);
		} else if (Object.prototype.toString.call(data) !== '[object Uint8Array]') {
			throw Error('only strings and Uint8Array are supported');
		}
		// data is now always Uint8Array

		if (data.length + this.dataBufferSize > this.dataBuffer.length) {
			this.flush();
		}
		if (data.length > this.dataBuffer.length) { // enlarge default buffer
			this.dataBuffer = data;
		} else {
			this.dataBuffer.set(data, this.dataBufferSize);
		}
		this.dataBufferSize += data.length;
	}
}

Socket.prototype.flush = function (cb) {
	var onWritable = function (socket) {
		socket.onWritable = null;

		while (socket.writebuffer.length > 0) {
			var entry = socket.writebuffer[0];
			var written = entry.written;
			var data = entry.data;
			var len = entry.len;

			if (written < len) {
				var ret = writeSocket(socket.sockfd, data, len - written, written, socket.ssl);
				if (ret == 0) {
					// eagain, return immediately and wait for futher onWritable calls
					console.debug('eagain in onWritable, socket ' + socket.sockfd);
					// wait for next select when socket is writable
					break;
				}
				if (ret >= 0) {
					written += ret;
					entry.written = written;
				} else {
					console.error('error writing to socket:' + ret);
					break;
				}
			}
			if (written >= len) {
				// remove entry because it has been written completely.
				// pussy null
				socket.writebuffer[0] = null;
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
		this.writebuffer.push({ data: this.dataBuffer, written: 0, len: this.dataBufferSize, cb: cb });
		var writtenCompletely = onWritable(this);
		if (!writtenCompletely) {
			// if not written completely the buffer was stored in write queue
			// and a new buffer must be created to prevent race conditions
			this.dataBuffer = new Uint8Array(this.defaultBufferSize);
		}
		this.dataBufferSize = 0;
	}
}

function performOnClose(socket) {
	if (socket && socket.onClose) {
		socket.onClose();
	}
}

/**
 * Flushes buffered writes, shutdowns SSL (if it is a secure socket), 
 * close the socket, performs the close callback function, removes
 * socket from {@link module:socket-events.sockets}.
 * 
 * @param {(module:socket-events~Socket|number)}
 */
exports.closeSocket = function (socketOrSockfd) {
	var socket = null;
	if (typeof socketOrSockfd === 'number') {
		socket = sockets.find(function (s) { return s.sockfd === socketOrSockfd });
	} else if (typeof socketOrSockfd === 'object') {
		socket = socketOrSockfd;
	}

	if (!socket) {
		throw Error('socket not found for closing!');
	}

	socket.flush();

	if (socket.ssl) {
		shutdownSSL(socket.ssl);
	}
	el_closeSocket(socket.sockfd);
	if (socket.ssl) {
		freeSSL(socket.ssl);
	}
	performOnClose(socket);
	resetSocket(socket);
}
var closeSocket = exports.closeSocket;

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
exports.sockConnect = function (ssl, host, port, onConnect, onData, onError, onClose) {
	port = Number.parseInt(port, 10);
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
	socket.ssl = null;

	if (ssl) {
		sslClientCtx = typeof sslClientCtx === 'undefined' ? createSSLClientContext() : sslClientCtx;
		socket.ssl = createSSL(sslClientCtx, host);
		socket.onConnect = function (skt) {
			var result = connectSSL(skt.ssl, skt.sockfd);
			if (result == 0) // retry
			{
				return true;
			} else if (result < 0) {
				console.error('error connecting ssl: ' + result);
				closeSocket(socket);
			} else {
				return onConnect(skt);
			}
		}
	}

	if (sockets.indexOf(socket) < 0) {
		sockets.push(socket);
	}
	return socket;
}

exports.sockListen = function (port, onAccept, onError, onClose, isSSL) {
	port = Number.parseInt(port, 10);
	var sslCtx = null;
	if (isSSL) {
		sslCtx = createSSLServerContext();
	}

	var sockfd = el_createNonBlockingSocket();
	var ret = el_bindAndListen(sockfd, port);


	if (ret < 0) {
		if (onError) {
			onError(sockfd);
		}
		return null;
	} else {
		var socket = getOrCreateNewSocket();
		socket.sockfd = sockfd;

		socket.onAccept = function () {
			var ssl = null;
			if (isSSL) {
				ssl = createSSL(sslCtx);
			}
			var newsockfd = el_acceptIncoming(sockfd);
			if (newsockfd < 0) {
				console.error('accept returned: ' + newsockfd)
				onError(sockfd);
			} else if (typeof newsockfd !== 'undefined') { //EAGAIN
				var newSocket = getOrCreateNewSocket();
				newSocket.sockfd = newsockfd;
				newSocket.isConnected = false;
				newSocket.isError = false;
				newSocket.isListening = false;
				newSocket.ssl = ssl;

				if (sockets.indexOf(newSocket) < 0) {
					sockets.push(newSocket);
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
			} else {
				console.debug('EAGAIN received after accept...');
			}
		};
		socket.onError = function (sockfd) { console.error('Default error handler: ' + sockfd) };
		socket.onClose = function (sockfd) { console.info('Default close handler: ' + sockfd) };
		socket.isConnected = true;
		socket.isError = false;
		socket.isListening = true;

		if (sockets.indexOf(socket) < 0) {
			sockets.push(socket);
		}
		return socket;
	}
}

function resetSocket(socket) {
	if (socket) {
		sockets.splice(sockets.indexOf(socket), 1);
		return;
	}
	throw Error('invalid sockfd');
}

function beforeSuspend() {
	//collect sockets
	function notConnectedFilter(s) { return !s.isConnected && !s.isListening }
	function connectedFilter(s) { return s.isConnected }
	function connectedWritableFilter(s) { return s.isConnected && s.onWritable }
	function mapToSockfd(s) { return s.sockfd; };
	function validSocketsFilter(s) { return s.sockfd && !s.isError; }

	var validSockets = sockets.filter(validSocketsFilter);
	var notConnectedSockets = validSockets.filter(notConnectedFilter).map(mapToSockfd);
	var connectedSockets = validSockets.filter(connectedFilter).map(mapToSockfd);
	var connectedWritableSockets = validSockets.filter(connectedWritableFilter).map(mapToSockfd);

	el_registerSocketEvents(notConnectedSockets, connectedSockets, connectedWritableSockets);
}

function afterSuspend(evt, collected) {
	if (evt.type === EL_SOCKET_EVENT_TYPE) {
		var findSocket = sockets.filter(function (s) { return s.sockfd === evt.fd; });
		var socket = findSocket[0];
		if (socket) {
			if (evt.status === 0) //writable
			{
				if (!socket.isConnected && socket.onConnect) {
					collected.push(function (socket) {
						return function () {
							var retry = socket.onConnect(socket);
							socket.isConnected = !retry;
						}
					}(socket));
				} else if (!socket.isConnected) {
					socket.isConnected = true;
				}
				if (socket.isConnected && socket.onWritable) {
					collected.push(function (socket) { return function () { socket.onWritable(socket) } }(socket));
				}
			} else if (evt.status === 1) //readable
			{
				if (socket.isListening && socket.onAccept) {
					collected.push(socket.onAccept);
				} else {
					var result = readSocket(socket.sockfd, socket.ssl);
					if (result === null || (result && typeof result.data === 'string' && result.length == 0)) {
						closeSocket(socket.sockfd);
					} else if (!result) {
						console.debug('******** EAGAIN!!');
					} else {
						if (socket.onData) {
							collected.push(function (data, fd, length) { return function () { socket.onData(data, fd, length) } }(result.data, socket.sockfd, result.length));
						}
					}
				}
			} else if (evt.status === 2) //error
			{
				socket.isError = true;
				collected.push(function (sockfd) { return function () { socket.onError(sockfd) } }(socket.sockfd));
			} else {
				throw Error('UNKNOWN socket event status ' + evt.status);
			}
		}
		return true;
	}
	return false;
}

beforeSuspendHandlers.push(beforeSuspend);
afterSuspendHandlers.push(afterSuspend);
