function getHeader(statusCode, additionalHeaders) {
    return 'HTTP/1.1 ' + statusCode + ' OK\r\n' +//
        'Connection: close\r\n' +//
        (additionalHeaders ? additionalHeaders : '') +
        '\r\n';
}

function page(res, headline, text) {
    res.write(getHeader(200, 'Content-type: text/html\r\n'));
    res.end('<!doctype html>' +//
        '<html>' +//
        '<head><title>esp32-javascript</title>' +//
        '<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">' +
        '<link rel="stylesheet" href="/style.css.gz">' +
        '</head>' +//
        '<body>' +//
        '<div class="pure-g"><div class="pure-u-1"><div class="l-box">' +//
        '<h1>' + headline + '</h1>' + text +//
        '</div></div></div>' +//
        '</body>' +//
        '</html>\r\n\r\n');
}

function redirect(res, location) {
    res.end(getHeader(302, 'Location: ' + location + '\r\n'));
}

function httpServer(port, cb) {
    var sockres = sockListen(port,
        function (socket) {
            var complete = '';
            var contentLength = 0;
            var parsedHeaders = null;
            var firstLine = null;
            socket.onData = function (data) {
                complete = complete + data;
                var endOfHeaders = complete.indexOf('\r\n\r\n');
                if (complete.length >= 4 && endOfHeaders >= 0) {

                    if (!parsedHeaders) {
                        var headers = complete.substring(0, endOfHeaders);
                        var headerTokens = headers.split('\r\n');
                        firstLine = headerTokens.shift();
                        print('FIRST LINE:' + firstLine);
                        parsedHeaders = {};
                        headerTokens.forEach(function (headerLine) {
                            var delim = headerLine.indexOf(':');
                            if (delim >= 0) {
                                parsedHeaders[headerLine.substring(0, delim).trim().toLowerCase()] = headerLine.substring(delim + 1).trim();
                            }
                        });
                        print('PARSED HEADER:' + JSON.stringify(parsedHeaders));
                    }

                    var postedData = null;

                    if (typeof parsedHeaders['content-length'] !== 'undefined') {
                        contentLength = parseInt(parsedHeaders['content-length']);
                    }

                    if (contentLength > 0) {
                        if (endOfHeaders === (complete.length - 4 - contentLength)) {
                            postedData = complete.substring(endOfHeaders + 4, complete.length);
                        }
                        else {
                            //wait for more data to come (body of  a POST request)
                            return;
                        }
                    }

                    var startOfPath = firstLine.indexOf(' ');
                    var path = firstLine.substring(startOfPath + 1, firstLine.indexOf(' ', startOfPath + 1))

                    var req = {
                        method: complete.substring(0, startOfPath),
                        raw: complete,
                        path: path,
                        body: postedData,
                        headers: parsedHeaders
                    };

                    var res = { isEnded: false };
                    res.write = function (data) {
                        if (typeof data === 'string') {
                            data = new TextEncoder().encode(data);
                        }
                        // data is always Uint8Array

                        res.isEnded = true;
                        var written = 0;
                        var len = data.length;
                        while (written < len) {
                            var ret = writeSocket(socket.sockfd, new Uint8Array(data, written), len - written);
                            if (ret >= 0) {
                                written += ret;
                            } else {
                                print('error writing to socket:' + ret);
                                break;
                            }
                        }
                    }
                    res.end = function (data) {
                        res.write(data);
                        closeSocket(socket.sockfd);
                    }

                    print('Requesting ' + req.path + ' on socket ' + socket.sockfd);
                    cb(req, res);
                }
            };
            socket.onError = function () {
                print('NEW SOCK: ON ERROR');
            };
        },
        function () {
            print('ON ERROR');
        },
        function () {
            print('SOCKET WAS CLOSED!');
        });
}

function decodeUrlComponent(value) {
    value = value.replace(/\+/g, " ");
    value = value.replace(/%21/g, "!");
    value = value.replace(/%22/g, "\"");
    value = value.replace(/%23/g, "#");
    value = value.replace(/%24/g, "$");
    value = value.replace(/%26/g, "&");
    value = value.replace(/%27/g, "'");
    value = value.replace(/%28/g, "(");
    value = value.replace(/%29/g, ")");
    value = value.replace(/%2A/g, "*");
    value = value.replace(/%2B/g, "+");
    value = value.replace(/%2C/g, ",");
    value = value.replace(/%2D/g, "-");
    value = value.replace(/%2E/g, ".");
    value = value.replace(/%2F/g, "/");
    value = value.replace(/%3A/g, ":");
    value = value.replace(/%3B/g, ";");
    value = value.replace(/%3C/g, "<");
    value = value.replace(/%3D/g, "=");
    value = value.replace(/%3E/g, ">");
    value = value.replace(/%3F/g, "?");
    value = value.replace(/%40/g, "@");
    value = value.replace(/%25/g, "%");
    return value;
}

function parseQueryStr(query) {
    var keyValues = query.split('&');
    var parsed = {};
    keyValues.forEach(function (val) {
        var splitted = val.split('=');
        parsed[splitted[0]] = decodeUrlComponent(splitted[1]);
    });
    return parsed;
}

function parseUrl(url) {
    if (url) {
        var match = url.match(/([^\:]+):\/\/([^\:]+):?(\d*)(.*)/);
        if (match) {
            return {
                host: match[2],
                port: match[3] || (match[1] == 'http' ? 80 : null),
                path: match[4]
            }
        }
    }
    return null;
}
