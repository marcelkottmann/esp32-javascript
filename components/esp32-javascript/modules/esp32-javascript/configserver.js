Object.defineProperty(exports, "__esModule", { value: true });
var configManager = require("./config");
var http_1 = require("./http");
exports.requestHandler = [];
exports.baExceptionPathes = [];
function getHeader(statusCode, additionalHeaders) {
    return [
        "HTTP/1.1 ",
        statusCode,
        " OK\r\n",
        "Connection: close\r\n",
        additionalHeaders ? additionalHeaders : "",
        "\r\n",
    ].join("");
}
exports.getHeader = getHeader;
function redirect(res, location) {
    res.end(getHeader(302, "Location: " + location + "\r\n"));
}
exports.redirect = redirect;
function page(res, headline, text, cb) {
    res.write(getHeader(200, "Content-type: text/html\r\n"));
    res.write("<!doctype html><html><head><title>esp32-javascript</title>");
    res.write('<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">');
    res.write('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/pure/1.0.1/pure-min.css"></head>');
    res.write('<body><div class="pure-g"><div class="pure-u-1"><div class="l-box"><h1>');
    res.write(headline);
    res.write("</h1>");
    if (Array.isArray(text)) {
        text.forEach(function (t) {
            res.write(t);
        });
    }
    else {
        res.write(text);
    }
    res.end("</div></div></div></body></html>\r\n\r\n", cb);
}
function startConfigServer() {
    console.info("Starting config server.");
    var defaultConfig = getDefaultConfig();
    var authString = "Basic " +
        btoa(defaultConfig.basicAuthUsername + ":" + defaultConfig.basicAuthPassword);
    http_1.httpServer(80, false, function (req, res) {
        if (req.headers["authorization"] !== authString &&
            exports.baExceptionPathes.indexOf(req.path) < 0) {
            console.debug("401 response");
            res.write(getHeader(401, 'WWW-Authenticate: Basic realm="Enter credentials"\r\n'));
            res.end("401 Unauthorized");
        }
        else if (req.path === "/restart" && req.method === "POST") {
            page(res, 'Restarting...<br /><a href="/">Home</a>', "", function () {
                setTimeout(restart, 1000);
            });
        }
        else if (req.path === "/setup" || req.path === "/restart") {
            if (req.method === "GET") {
                page(res, "Setup", [
                    '<form  class="pure-form pure-form-stacked" action="/setup" method="post"><fieldset>',
                    '<label for="ssid">SSID</label><input type="text" name="ssid" value="',
                    el_load("config.ssid"),
                    '" />',
                    '<label for="password">Password</label><input type="text" name="password" value="',
                    el_load("config.password"),
                    '" />',
                    '<label for="url">JS file url</label><input type="text" name="url" value="',
                    el_load("config.url"),
                    '" />',
                    '<label for="offline" class="pure-checkbox"><input type="checkbox" name="offline" value="true" ',
                    el_load("config.offline") === "true" ? "checked" : "",
                    "/> Offline Mode</label>",
                    '<textarea name="script">',
                    el_load("config.script"),
                    "</textarea>",
                    '<input type="submit" class="pure-button pure-button-primary" value="Save" /></fieldset></form>',
                    "<h1>Request restart</h1>",
                    '<form action="/restart" method="post"><input type="submit" class="pure-button pure-button-primary" value="Restart" /></form>',
                ]);
            }
            else {
                var config = http_1.parseQueryStr(req.body);
                el_store("config.ssid", config.ssid);
                el_store("config.password", config.password);
                el_store("config.url", config.url);
                el_store("config.offline", config.offline === "true" ? "true" : "false");
                el_store("config.script", config.script);
                page(res, "Saved", JSON.stringify(config));
                configManager.reloadConfig();
            }
        }
        else {
            for (var i = 0; i < exports.requestHandler.length; i++) {
                if (!res.isEnded) {
                    try {
                        exports.requestHandler[i](req, res);
                    }
                    catch (error) {
                        var errorMessage = "Internal server error: " + error;
                        console.error(errorMessage);
                        if (!res.isEnded) {
                            res.write(getHeader(500, "Content-type: text/plain\r\n"));
                            res.end(errorMessage);
                        }
                    }
                }
            }
            if (!res.isEnded) {
                if (req.path === "/") {
                    redirect(res, "/setup");
                }
                else {
                    res.write(getHeader(404, "Content-type: text/plain\r\n"));
                    res.end("Not found");
                }
            }
        }
    });
}
exports.startConfigServer = startConfigServer;
