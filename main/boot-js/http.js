function page(headline, text) {
    return 'HTTP/1.1 200 OK\r\n' +//
        'Connection: close\r\n' +//
        'Content-type: text/html\r\n\r\n' +//
        '<!doctype html>' +//
        '<html>' +//
        '<head><title>esp32-javascript</title>' +//
        '<meta name="viewport" content="width=device-width, initial-scale=1.0"></head>' +//
        '<body>' +//
        '<h1>' + headline + '</h1>' + text +//
        '</body>' +//
        '</html>\r\n\r\n';
}

function httpServer(port, cb) {
    var sockres = sockListen(9999,
        function (socket) {
            var complete = '';
            var contentLength = 0;
            socket.onData = function (data) {
                complete = complete + data;
                var endOfHeaders = complete.indexOf('\r\n\r\n');
                if (complete.length >= 4 && endOfHeaders >= 0) {
                    var postedData = null;
                    var contentLengthHeader = 'content-length:';
                    var contentLengthHeaderStart = complete.toLocaleLowerCase().indexOf(contentLengthHeader);
                    if (contentLengthHeaderStart >= 0) {
                        var contentLengthHeaderStop = complete.indexOf('\r\n', contentLengthHeaderStart);
                        var contentLengthStr = complete.substring(contentLengthHeaderStart + contentLengthHeader.length, contentLengthHeaderStop);
                        contentLength = parseInt(contentLengthStr);
                    }

                    if (contentLength > 0) {
                        if (endOfHeaders === (complete.length - 4 - contentLength)) {
                            postedData = complete.substring(endOfHeaders + 4, complete.length);
                            print('POSTED DATA: |' + postedData + '|');
                        }
                        else {
                            //wait for more data to come (body of  a POST request)
                            return;
                        }
                    }

                    var startOfPath = complete.indexOf(' ');
                    var path = complete.substring(startOfPath + 1, complete.indexOf(' ', startOfPath + 1))

                    var req = {
                        method: complete.substring(0, startOfPath),
                        raw: complete,
                        path: path,
                        body: postedData
                    };

                    var res = { isEnded: false };
                    res.end = function (data) {
                        res.isEnded = true;
                        writeSocket(socket.sockfd, data);
                        closeSocket(socket.sockfd);
                        removeSocketFromSockets(socket.sockfd);
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
        var match = url.match(/([^\:]+):\/\/([^\/]+):?(\d*)(.*)/);
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
