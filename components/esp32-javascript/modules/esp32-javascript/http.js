Object.defineProperty(exports, "__esModule", { value: true });
exports.XMLHttpRequest = exports.httpClient = exports.parseQueryStr = exports.decodeQueryParam = exports.httpServer = void 0;
var socketEvents = require("socket-events");
var stringbuffer_1 = require("./stringbuffer");
var sockListen = socketEvents.sockListen;
var sockConnect = socketEvents.sockConnect;
var closeSocket = socketEvents.closeSocket;
function parseHeaders(complete, endOfHeaders) {
    var headersRaw = complete.substring(0, endOfHeaders).toString();
    var headerTokens = headersRaw.split("\r\n");
    var statusLine = headerTokens.shift();
    var headers = new Headers();
    headerTokens.forEach(function (headerLine) {
        var delim = headerLine.indexOf(":");
        if (delim >= 0) {
            headers.append(headerLine.substring(0, delim).trim(), headerLine.substring(delim + 1).trim());
        }
    });
    return {
        statusLine: statusLine,
        headers: headers,
    };
}
var EventEmitter = /** @class */ (function () {
    function EventEmitter() {
        this.listener = {};
    }
    EventEmitter.prototype.on = function (event, cb) {
        (this.listener[event] = this.listener[event] || []).push(cb);
    };
    EventEmitter.prototype.emit = function (event) {
        console.debug("Event " + event + " emitted: ");
        var eventListener = this.listener[event];
        if (Array.isArray(eventListener)) {
            console.debug(eventListener.length + " listeners active.");
            eventListener.forEach(function (cb) { return setTimeout(cb, 0); });
        }
    };
    return EventEmitter;
}());
function httpServer(port, isSSL, cb) {
    var textEncoder = new TextEncoder();
    var textDecoder = new TextDecoder();
    sockListen(port, function (socket) {
        var requestCounter = 0;
        var complete = null;
        var contentLength = 0;
        var headers;
        var statusLine;
        var gotten = 0;
        var active = [];
        socket.onData = function (data, _, length) {
            complete = complete ? complete.append(data) : new stringbuffer_1.StringBuffer(data);
            gotten += length;
            var endOfHeaders = complete.indexOf("\r\n\r\n");
            if (gotten >= 4 && endOfHeaders >= 0) {
                if (!headers) {
                    var parsed = parseHeaders(complete, endOfHeaders);
                    statusLine = parsed.statusLine;
                    headers = parsed.headers;
                    requestCounter++;
                    console.debug("Request on socket " + socket.sockfd + ": " + statusLine + ", requestCounter:" + requestCounter);
                }
                var postedData = null;
                var contentLengthHeader = headers.get("content-length");
                if (typeof contentLengthHeader === "string") {
                    contentLength = parseInt(contentLengthHeader);
                }
                if (contentLength > 0) {
                    console.debug("A request body is expected.");
                    if (gotten >= endOfHeaders + 4 + contentLength) {
                        var potentialRequestBody = textEncoder.encode(complete.substring(endOfHeaders + 4).toString());
                        postedData = textDecoder.decode(potentialRequestBody.subarray(0, contentLength));
                        console.debug("Request body is complete:");
                        console.debug(postedData);
                    }
                    else {
                        //wait for more data to come (body of  a POST request)
                        console.debug("Waiting for more data to come:");
                        console.debug(contentLength);
                        console.debug(complete.length);
                        console.debug(gotten);
                        console.debug(endOfHeaders);
                        return;
                    }
                }
                if (statusLine) {
                    var startOfPath = statusLine.indexOf(" ");
                    var path = statusLine.substring(startOfPath + 1, statusLine.indexOf(" ", startOfPath + 1));
                    var method = complete.substring(0, startOfPath).toString();
                    var req_1 = {
                        method: method,
                        path: path,
                        body: postedData,
                        headers: headers,
                    };
                    var eventEmitter_1 = new EventEmitter();
                    var responseHeaders_1 = new Headers();
                    var chunkedEncoding_1 = false;
                    var isConnectionClose_1 = function () {
                        var close = false;
                        if (!close && headers && headers.get("connection") === "close") {
                            close = true;
                        }
                        if (!close &&
                            responseHeaders_1 &&
                            responseHeaders_1.get("transfer-encoding") !== "chunked" &&
                            !responseHeaders_1.has("content-length")) {
                            close = true;
                        }
                        if (!close &&
                            responseHeaders_1 &&
                            responseHeaders_1.get("connection") === "close") {
                            close = true;
                        }
                        return close;
                    };
                    var chunked_1 = function () {
                        var chunked = true;
                        if (chunked && headers && headers.get("connection") === "close") {
                            chunked = false;
                        }
                        if (chunked &&
                            responseHeaders_1 &&
                            ((responseHeaders_1.has("transfer-encoding") &&
                                responseHeaders_1.get("transfer-encoding") !== "chunked") ||
                                responseHeaders_1.has("content-length"))) {
                            chunked = false;
                        }
                        if (chunked &&
                            responseHeaders_1 &&
                            responseHeaders_1.get("connection") === "close") {
                            chunked = false;
                        }
                        return chunked;
                    };
                    // initialize response
                    var res_1 = {
                        headers: responseHeaders_1,
                        isEnded: false,
                        statusWritten: false,
                        headersWritten: false,
                        status: { status: 200, statusText: "OK" },
                        on: function (event, cb) {
                            eventEmitter_1.on(event, cb);
                        },
                        flush: function () {
                            socket.flush();
                        },
                        setStatus: function (status, statusText) {
                            res_1.status.status = status;
                            if (statusText) {
                                res_1.status.statusText = statusText;
                            }
                        },
                        write: function (data) {
                            if (res_1.isEnded) {
                                throw Error("request has already ended");
                            }
                            if (!res_1.statusWritten) {
                                res_1.statusWritten = true;
                                socket.write("HTTP/1.1 " + res_1.status.status + " " + res_1.status.statusText + "\r\n");
                            }
                            if (!res_1.headersWritten) {
                                if (chunked_1()) {
                                    responseHeaders_1.set("transfer-encoding", "chunked");
                                    chunkedEncoding_1 = true;
                                }
                                if (isConnectionClose_1()) {
                                    responseHeaders_1.set("connection", "close");
                                }
                                if (!responseHeaders_1.has("connection")) {
                                    responseHeaders_1.set("connection", "keep-alive");
                                    socket.setReadTimeout(20000);
                                }
                                var contentType = responseHeaders_1.get("content-type");
                                if (typeof contentType !== "string") {
                                    responseHeaders_1.set("content-type", "text/plain; charset=utf-8");
                                }
                                else if (contentType.indexOf("charset") < 0) {
                                    responseHeaders_1.set("content-type", contentType + "; charset=utf-8");
                                }
                                res_1.headersWritten = true;
                                responseHeaders_1.forEach(function (value, key) {
                                    socket.write(key + ": " + value + "\r\n");
                                });
                                socket.write("\r\n");
                            }
                            if (typeof data !== "undefined" && data.length > 0) {
                                if (chunkedEncoding_1) {
                                    var encoded = typeof data === "string"
                                        ? textEncoder.encode(data)
                                        : data;
                                    socket.write(encoded.length.toString(16) + "\r\n");
                                }
                                if (data) {
                                    socket.write(data);
                                }
                                if (chunkedEncoding_1) {
                                    socket.write("\r\n");
                                    //socket.flush();
                                }
                            }
                        },
                        end: function (data) {
                            res_1.write(data);
                            if (chunkedEncoding_1) {
                                socket.write("0\r\n");
                                socket.write("\r\n");
                            }
                            socket.flush(function () {
                                if (isConnectionClose_1()) {
                                    console.debug("Socket " + socket.sockfd + " closed.");
                                    closeSocket(socket.sockfd);
                                }
                                res_1.isEnded = true;
                                eventEmitter_1.emit("end");
                            });
                        },
                    };
                    // reset state for keep alive connections getting more requests
                    // on the same socket
                    complete = complete.substring(endOfHeaders + 4 + contentLength);
                    gotten = gotten - endOfHeaders - 4 - contentLength;
                    contentLength = 0;
                    headers = undefined;
                    statusLine = undefined;
                    console.debug("gotten: " + gotten);
                    console.debug("complete.length: " + complete.length);
                    var item_1 = { req: req_1, res: res_1 };
                    var num = active.push(item_1);
                    console.debug("Currently active requests: " + num);
                    res_1.on("end", function () {
                        console.debug("splicing req/res form active list");
                        active.splice(active.indexOf(item_1), 1);
                    });
                    var previous = num - 2;
                    if (previous < 0 || active[previous].res.isEnded) {
                        // active request/response is empty, perform immediately
                        console.debug("// active request/response is empty or entries are ended, perform immediately");
                        setTimeout(function () {
                            console.debug("perform immediate");
                            cb(req_1, res_1);
                        }, 0);
                    }
                    else {
                        // queue request/response callback after previous request/response
                        console.debug("// queue request/response callback after previous request/response");
                        active[previous].res.on("end", function () {
                            console.debug("end of previous req/res: triggering new req/res callback");
                            cb(req_1, res_1);
                        });
                    }
                    if (gotten > 0 && socket.onData) {
                        socket.onData("", _, 0);
                    }
                }
            }
        };
        socket.onError = function (sockfd) {
            console.error("NEW SOCK: ON ERROR: " + sockfd);
        };
    }, function (sockfd) {
        console.error("ON ERROR: Socket " + sockfd);
    }, function () {
        console.info("SOCKET WAS CLOSED!");
    }, isSSL);
}
exports.httpServer = httpServer;
function decodeQueryParam(value) {
    return decodeURIComponent(value.replace(/\+/g, "%20"));
}
exports.decodeQueryParam = decodeQueryParam;
function parseQueryStr(query) {
    var parsed = {};
    if (query) {
        var keyValues = query.split("&");
        keyValues.forEach(function (val) {
            var splitted = val.split("=");
            parsed[splitted[0]] =
                splitted.length > 1 ? decodeQueryParam(splitted[1]) : "";
        });
    }
    return parsed;
}
exports.parseQueryStr = parseQueryStr;
function httpClient(ssl, host, port, path, method, requestHeaders, body, successCB, errorCB, finishCB) {
    var complete = new stringbuffer_1.StringBuffer();
    var completeLength = 0;
    var chunked = false;
    var headerRead = false;
    var headerEnd = -1;
    var contentLength = -1;
    requestHeaders = requestHeaders || "";
    if (!errorCB) {
        errorCB = print;
    }
    sockConnect(ssl, host, port, function (socket) {
        var bodyStr = body ? body.toString() : null;
        var requestLines = method + " " + path + " HTTP/1.1\r\nHost: " + host + "\r\n" + (bodyStr ? "Content-length: " + bodyStr.length + "\r\n" : "") + requestHeaders + "\r\n" + (bodyStr ? bodyStr + "\r\n" : "");
        socket.write(requestLines);
        socket.flush();
    }, function (data, sockfd, length) {
        complete.append(data);
        completeLength = completeLength + length;
        if (!headerRead && (headerEnd = complete.indexOf("\r\n\r\n")) >= 0) {
            headerRead = true;
            chunked =
                complete.toLowerCase().indexOf("transfer-encoding: chunked") >= 0;
            var clIndex = complete.toLowerCase().indexOf("content-length: ");
            if (clIndex >= 0) {
                var endOfContentLength = complete.indexOf("\r\n", clIndex);
                contentLength = parseInt(complete.substring(clIndex + 15, endOfContentLength).toString());
            }
            headerEnd += 4;
        }
        if (chunked) {
            if (complete.substring(complete.length - 5).toString() == "0\r\n\r\n") {
                closeSocket(sockfd);
            }
        }
        if (contentLength >= 0) {
            if (completeLength - headerEnd == contentLength) {
                closeSocket(sockfd);
            }
        }
    }, function () {
        if (errorCB) {
            errorCB("Could not load " + (ssl ? "https" : "http") + "://" + host + ":" + port + path);
        }
    }, function () {
        var startFrom = headerEnd;
        var content = null;
        if (chunked) {
            content = new stringbuffer_1.StringBuffer();
            var chunkLength = void 0;
            do {
                var chunkLengthEnd = complete.indexOf("\r\n", startFrom);
                var lengthStr = complete
                    .substring(startFrom, chunkLengthEnd)
                    .toString();
                chunkLength = parseInt(lengthStr, 16);
                var chunkEnd = chunkLengthEnd + chunkLength + 2;
                content.append(complete.substring(chunkLengthEnd + 2, chunkEnd));
                startFrom = chunkEnd + 2;
            } while (chunkLength > 0);
        }
        else {
            content = complete.substring(startFrom);
        }
        var headers = complete.substring(0, headerEnd);
        if (successCB) {
            successCB(content.toString(), headers.toString());
        }
        //free complete for GC
        content = null;
        if (finishCB) {
            finishCB();
        }
    });
}
exports.httpClient = httpClient;
var XMLHttpRequest = /** @class */ (function () {
    function XMLHttpRequest() {
        this.method = "GET";
    }
    XMLHttpRequest.prototype.send = function (body) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        var self = this;
        if (this.url) {
            httpClient(this.url.protocol === "https:", this.url.hostname, this.url.port, this.url.pathname + this.url.search, this.method, this.requestHeaders ? this.requestHeaders.toString() : undefined, body, function (data, responseHeaders) {
                var r = responseHeaders.match(/^HTTP\/[0-9.]+ ([0-9]+) (.*)/);
                if (r) {
                    self.status = parseInt(r[1], 10);
                    self.statusText = r[2];
                    self.responseURL = "";
                    self.responseText = data;
                    self.reponseHeaders = responseHeaders.substring(r[0].length + 2);
                    if (self.onload) {
                        self.onload();
                    }
                }
                else {
                    if (self.onerror) {
                        self.onerror("Bad http status line.");
                    }
                }
            }, function (error) {
                console.error(error);
                if (self.onerror) {
                    self.onerror(error);
                }
            });
        }
        else {
            if (self.onerror) {
                self.onerror("Url unset.");
            }
        }
    };
    XMLHttpRequest.prototype.getAllResponseHeaders = function () {
        return this.reponseHeaders;
    };
    XMLHttpRequest.prototype.open = function (method, url) {
        this.method = method;
        this.url = urlparse(url);
        // check protocol
        if (this.url.protocol !== "http:" && this.url.protocol !== "https:") {
            throw Error("Unsupported protocol for esp32 fetch implementation: " + this.url.protocol);
        }
        // get default port
        var port = parseInt(this.url.port, 10);
        if (isNaN(port)) {
            if (this.url.protocol === "https:") {
                port = 443;
            }
            else if (this.url.protocol === "http:") {
                port = 80;
            }
            else {
                throw Error("Cannot determine default port for protocol " + this.url.protocol);
            }
        }
        this.url.port = "" + port;
    };
    XMLHttpRequest.prototype.setRequestHeader = function (name, value) {
        this.requestHeaders = this.requestHeaders || new stringbuffer_1.StringBuffer();
        this.requestHeaders.append(name).append(": ").append(value).append("\r\n");
    };
    return XMLHttpRequest;
}());
exports.XMLHttpRequest = XMLHttpRequest;
