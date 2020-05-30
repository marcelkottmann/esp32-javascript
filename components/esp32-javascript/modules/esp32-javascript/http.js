var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.XMLHttpRequest = exports.httpClient = exports.parseQueryStr = exports.decodeQueryParam = exports.httpServer = void 0;
var socketEvents = require("socket-events");
var stringbuffer_1 = __importDefault(require("./stringbuffer"));
var sockListen = socketEvents.sockListen;
var sockConnect = socketEvents.sockConnect;
var closeSocket = socketEvents.closeSocket;
function parseHeaders(complete, endOfHeaders) {
    var headers = complete.substring(0, endOfHeaders);
    var headerTokens = headers.split("\r\n");
    var firstLine = headerTokens.shift();
    var parsedHeaders = {};
    headerTokens.forEach(function (headerLine) {
        var delim = headerLine.indexOf(":");
        if (delim >= 0) {
            parsedHeaders[headerLine.substring(0, delim).trim().toLowerCase()] = headerLine.substring(delim + 1).trim();
        }
    });
    return {
        firstLine: firstLine,
        parsedHeaders: parsedHeaders,
    };
}
function httpServer(port, isSSL, cb) {
    var sockres = sockListen(port, function (socket) {
        var complete;
        var contentLength = 0;
        var parsedHeaders;
        var firstLine;
        socket.onData = function (data) {
            complete = complete ? complete + data : data;
            var endOfHeaders = complete.indexOf("\r\n\r\n");
            if (complete.length >= 4 && endOfHeaders >= 0) {
                if (!parsedHeaders) {
                    var parsed = parseHeaders(complete, endOfHeaders);
                    firstLine = parsed.firstLine;
                    parsedHeaders = parsed.parsedHeaders;
                }
                var postedData = null;
                if (typeof parsedHeaders["content-length"] !== "undefined") {
                    contentLength = parseInt(parsedHeaders["content-length"]);
                }
                if (contentLength > 0) {
                    if (endOfHeaders === complete.length - 4 - contentLength) {
                        postedData = complete.substring(endOfHeaders + 4, complete.length);
                    }
                    else {
                        //wait for more data to come (body of  a POST request)
                        return;
                    }
                }
                // initialize response
                var res = {
                    isEnded: false,
                    flush: function (cb, close) {
                        socket.flush(cb);
                        if (close) {
                            console.debug("Socket " + socket.sockfd + " closed.");
                            closeSocket(socket.sockfd);
                        }
                    },
                    write: function (data) {
                        if (res.isEnded) {
                            throw Error("request has already ended");
                        }
                        socket.write(data);
                    },
                    end: function (data, cb) {
                        res.write(data);
                        res.flush(cb, true);
                        res.isEnded = true;
                    },
                };
                if (firstLine) {
                    var startOfPath = firstLine.indexOf(" ");
                    var path = firstLine.substring(startOfPath + 1, firstLine.indexOf(" ", startOfPath + 1));
                    var method = complete.substring(0, startOfPath);
                    // allow gc to free complete string
                    complete = null;
                    var req = {
                        method: method,
                        path: path,
                        body: postedData,
                        headers: parsedHeaders,
                    };
                    console.debug("Requesting " + req.path + " on socket " + socket.sockfd);
                    cb(req, res);
                }
                else {
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
    var complete = new stringbuffer_1.default();
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
        var requestLines = method +
            " " +
            path +
            " HTTP/1.1\r\nHost: " +
            host +
            "\r\n" +
            (bodyStr ? "Content-length: " + bodyStr.length + "\r\n" : "") +
            requestHeaders +
            "\r\n" +
            (bodyStr ? bodyStr + "\r\n" : "");
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
            errorCB("Could not load http://" + host + ":" + port + path);
        }
    }, function () {
        var startFrom = headerEnd;
        var content = null;
        if (chunked) {
            content = new stringbuffer_1.default();
            do {
                var chunkLengthEnd = complete.indexOf("\r\n", startFrom);
                var lengthStr = complete
                    .substring(startFrom, chunkLengthEnd)
                    .toString();
                var chunkLength = parseInt(lengthStr, 16);
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
        var self = this;
        if (this.url) {
            httpClient(this.url.protocol === "https:", this.url.hostname, this.url.port, this.url.pathname + this.url.search, this.method, this.requestHeaders ? this.requestHeaders.toString() : undefined, body, function (data, responseHeaders) {
                var r = responseHeaders.match(/^HTTP\/[0-9\.]+ ([0-9]+) (.*)/);
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
            throw Error("Unsupported protocol for esp32 fetch implementation: " +
                this.url.protocol);
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
        this.requestHeaders = this.requestHeaders || new stringbuffer_1.default();
        this.requestHeaders.append(name).append(": ").append(value).append("\r\n");
    };
    return XMLHttpRequest;
}());
exports.XMLHttpRequest = XMLHttpRequest;
