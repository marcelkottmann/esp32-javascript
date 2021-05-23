var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startConfigServer = exports.redirect = exports.baExceptionPathes = exports.requestHandler = exports.addSchema = void 0;
/*
MIT License

Copyright (c) 2021 Marcel Kottmann

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
var configManager = require("./config");
var boot_1 = require("./boot");
var http_1 = require("./http");
var schema = {
    access: {
        type: "object",
        options: {
            disable_collapse: true,
            disable_properties: true,
        },
        title: "Access",
        additionalProperties: false,
        required: ["username", "password"],
        properties: {
            username: {
                type: "string",
                title: "Username",
            },
            password: {
                type: "string",
                title: "Password",
            },
        },
    },
    wifi: {
        type: "object",
        options: {
            disable_collapse: true,
            disable_properties: true,
        },
        title: "WiFi",
        additionalProperties: false,
        required: ["ssid", "password"],
        properties: {
            ssid: {
                type: "string",
                title: "SSID",
            },
            password: {
                type: "string",
                title: "Password",
            },
        },
    },
    ota: {
        type: "object",
        options: {
            disable_collapse: true,
            disable_properties: true,
        },
        title: "Ota",
        additionalProperties: false,
        required: ["url", "offline", "script"],
        properties: {
            url: {
                type: "string",
                title: "Firmware url",
            },
            offline: {
                type: "boolean",
                title: "Offline",
            },
            script: {
                type: "string",
                format: "textarea",
                title: "Offline",
            },
        },
    },
};
function addSchema(additional) {
    schema = __assign(__assign({}, schema), additional);
}
exports.addSchema = addSchema;
exports.requestHandler = [];
exports.baExceptionPathes = [];
function redirect(res, location) {
    res.setStatus(302);
    res.headers.set("location", location);
    res.headers.set("content-length", "0");
    res.end();
}
exports.redirect = redirect;
function page(res, headline, text, cb) {
    if (cb) {
        // register callback
        res.on("end", cb);
    }
    res.setStatus(200);
    res.headers.set("content-type", "text/html");
    res.write("<!doctype html><html><head><title>esp32-javascript</title>\n      <meta name=\"viewport\" content=\"width=device-width, initial-scale=1, shrink-to-fit=no\">\n      <style>\n      body {\n        font-family: monospace;\n        font-size: 13pt;\n      }\n      .input {\n        font-family: monospace;\n        font-size: 13pt;\n      }\n      .fill {\n        width: calc(100% - 146px);\n      }\n      .full {\n        width: calc(100% - 16px);\n      }\n      .txt {\n        height: 100px;\n      }\n      .formlabel {\n        display: inline-block;\n        width: 130px;\n      }\n      .formpad {\n        padding: 8px;\n      }\n      .green {\n        color: green;\n      }\n      .red {\n        color: red;\n      }\n      </style>\n      \n      </head>\n      <body><div><div><div><h1>" + headline + "</h1>");
    if (Array.isArray(text)) {
        res.write(text.join(""));
    }
    else {
        res.write(text);
    }
    res.end("</div></div></div></body></html>\r\n\r\n");
}
var successMessage = "";
var errorMessage = "";
function startConfigServer() {
    console.info("Starting config server.");
    var authString = "Basic " +
        btoa(configManager.config.access.username +
            ":" +
            configManager.config.access.password);
    http_1.httpServer(80, false, function (req, res) {
        var _a, _b, _c, _d, _e;
        if (req.headers.get("authorization") !== authString &&
            exports.baExceptionPathes.indexOf(req.path) < 0) {
            console.debug("401 response");
            res.setStatus(401);
            res.headers.set("WWW-Authenticate", 'Basic realm="Enter credentials"');
            res.end("401 Unauthorized");
        }
        else if (req.path === "/restart" && req.method === "POST") {
            page(res, "Restart", '<div class="formpad green">Restarting... please wait. <a href="/">Home</a></div>', function () {
                setTimeout(restart, 1000);
            });
        }
        else if (req.path === "/setup" || req.path === "/restart") {
            if (req.path === "/setup" && req.method === "POST") {
                try {
                    var storedConfig = configManager.config;
                    if (!storedConfig.wifi) {
                        storedConfig.wifi = {};
                    }
                    if (!storedConfig.ota) {
                        storedConfig.ota = {};
                    }
                    var config_1 = http_1.parseQueryStr(req.body);
                    storedConfig.wifi.ssid = config_1.ssid;
                    storedConfig.wifi.password = config_1.password;
                    storedConfig.ota.url = config_1.url;
                    storedConfig.ota.offline = config_1.offline === "true";
                    storedConfig.ota.script = config_1.script;
                    configManager.saveConfig(storedConfig);
                    successMessage = "Saved. Some settings require a restart.";
                }
                catch (err) {
                    errorMessage = err;
                }
            }
            var config = configManager.config;
            var logFileSize = void 0;
            try {
                logFileSize = fileSize("/data/logs.txt");
            }
            catch (_) {
                // ignore
            }
            page(res, "Setup", "" + (successMessage
                ? "<div class=\"formpad green\">" + successMessage + "</div>"
                : "") + (errorMessage
                ? "<div class=\"formpad red\">Saving failed. Error message: " + errorMessage + "</div>"
                : "") + "<form action=\"/setup\" method=\"post\">\n        <div class=\"formpad\"><label for=\"ssid\" class=\"formlabel\">SSID</label><input type=\"text\" name=\"ssid\" class=\"fill input\" value=\"" + (((_a = config.wifi) === null || _a === void 0 ? void 0 : _a.ssid) || "") + "\" /></div>\n        <div class=\"formpad\"><label for=\"password\" class=\"formlabel\">Password</label><input type=\"text\" name=\"password\" class=\"fill input\" value=\"" + (((_b = config.wifi) === null || _b === void 0 ? void 0 : _b.password) || "") + "\" /></div>\n        <div class=\"formpad\"><label for=\"url\" class=\"formlabel\">JS file url</label><input type=\"text\" name=\"url\" class=\"fill input\" value=\"" + (((_c = config.ota) === null || _c === void 0 ? void 0 : _c.url) || "") + "\" /></div>\n        <div class=\"formpad\"><label for=\"offline\"><input type=\"checkbox\" name=\"offline\" value=\"true\" " + (((_d = config.ota) === null || _d === void 0 ? void 0 : _d.offline) ? "checked" : "") + "/> Offline Mode</label></div>\n        <label for=\"script\" class=\"formpad\">Offline Script</label><div class=\"formpad\"><textarea name=\"script\" class=\"full input txt\">" + (((_e = config.ota) === null || _e === void 0 ? void 0 : _e.script) || "") + "</textarea></div>\n        <div class=\"formpad\"><input type=\"submit\" value=\"Save\" class=\"formpad input\"/></div></form>\n        <h1>Logs</h1>\n        <div class=\"formpad\">\n          Log size: " + (logFileSize ? Math.floor(logFileSize / 1024) : "?") + " kB\n        </div>\n        <form action=\"/logs\" method=\"get\"><div class=\"formpad\"><input type=\"submit\" value=\"Show Logs\" class=\"formpad input\"/></div></form>\n        <form action=\"/deletelogs\" method=\"get\"><div class=\"formpad\"><input type=\"submit\" value=\"Delete Logs\" class=\"formpad input\"/></div></form>\n        <h1>Request restart</h1>\n        <form action=\"/restart\" method=\"post\"><div class=\"formpad\"><input type=\"submit\" value=\"Restart\" class=\"formpad input\"/></div></form>\n        <h1>Uptime</h1>\n        <div class=\"formpad\">\n          Boot time: " + boot_1.getBootTime() + "\n        </div>\n        <div class=\"formpad\">\n          Uptime (hours): " + Math.floor((Date.now() - boot_1.getBootTime().getTime()) / 10 / 60 / 60) /
                100 + "<br />\n        </div>\n        <div class=\"formpad\">\n          Boot time is only available if a valid 'JS file url' is configured, otherwise it starts at unix epoch (1970).\n        </div>");
            successMessage = "";
            errorMessage = "";
        }
        else {
            var handled = false;
            for (var i = 0; i < exports.requestHandler.length; i++) {
                if (!res.isEnded) {
                    try {
                        var reqHandled = exports.requestHandler[i](req, res);
                        handled = Boolean(handled || reqHandled);
                    }
                    catch (error) {
                        var errorMessage_1 = "Internal server error: " + error;
                        console.error(errorMessage_1);
                        if (!res.isEnded) {
                            res.setStatus(500);
                            res.headers.set("Content-type", "text/plain");
                            res.end(errorMessage_1);
                        }
                    }
                }
            }
            if (!handled && !res.isEnded) {
                if (req.path === "/") {
                    redirect(res, "/setup");
                }
                else {
                    res.setStatus(404, "Not found");
                    res.headers.set("Content-type", "text/plain");
                    res.end("Not found");
                }
            }
        }
    });
    exports.requestHandler.push(function (req, res) {
        if (req.path === "/config") {
            res.setStatus(200);
            res.headers.set("Content-type", "text/html");
            res.end("<html>\n      <head>\n        <title>Configuration</title>\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1, shrink-to-fit=no\">\n        <link \n          rel=\"stylesheet\" \n          href=\"https://bootswatch.com/4/united/bootstrap.min.css\" \n          crossorigin=\"anonymous\"\n        />\n        <link\n          rel=\"stylesheet\"\n          href=\"https://use.fontawesome.com/releases/v5.6.1/css/all.css\"\n          crossorigin=\"anonymous\"\n        />\n      </head>\n      <body>\n        <div class=\"container\">\n          <div id=\"editor_holder\"></div>\n          <p>\n            <form action=\"/restart\" method=\"post\">\n              <button\n                type=\"button\"\n                class=\"btn btn-primary\"\n                onclick=\"save(editor.getValue())\"\n              >\n                Save\n              </button>\n              <button\n                type=\"submit\"\n                class=\"btn btn-secondary\"\n              >\n                Restart\n              </button>\n            </form>\n          </p>\n        </div>\n        <script\n          src=\"https://code.jquery.com/jquery-3.2.1.slim.min.js\"\n          integrity=\"sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN\"\n          crossorigin=\"anonymous\"\n        ></script>\n        <script\n          src=\"https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js\"\n          integrity=\"sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q\"\n          crossorigin=\"anonymous\"\n        ></script>\n        <script\n          src=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js\"\n          integrity=\"sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl\"\n          crossorigin=\"anonymous\"\n        ></script>\n        <script src=\"https://cdn.jsdelivr.net/npm/@json-editor/json-editor@latest/dist/jsoneditor.min.js\"\n          crossorigin=\"anonymous\"\n        ></script>\n        <script>\n          const element = document.getElementById(\"editor_holder\");\n          const editor = new JSONEditor(element, \n            {\n              theme: \"bootstrap4\",\n              iconlib: \"fontawesome5\",\n              disable_edit_json: true,\n              disable_array_delete_all_rows: true,\n              disable_array_delete_last_row: true,\n              ajax: true,\n              schema: {\n                $schema: \"http://json-schema.org/draft-07/schema\",\n                $ref: '/config/schema'\n              }\n            });\n          editor.on('ready', () => {\n            editor.disable();\n            fetch('/config/current').then(r=>r.json()).then(data => {\n              editor.setValue(data);\n              editor.enable();\n            });\n          });\n\n          function save(data)\n          {\n            fetch('/config/current', { method: 'POST', body: JSON.stringify(data)}).then(()=>alert('Saved. Some settings may require a restart.'));\n          }\n        </script>\n      </body>\n    </html>");
        }
    });
    exports.requestHandler.push(function (req, res) {
        if (req.path === "/config/schema") {
            res.setStatus(200);
            res.headers.set("Content-type", "application/json");
            res.end("\n      {\n        \"type\": \"object\",\n        \"format\": \"categories\",\n        \"options\": {\n          \"disable_collapse\": true,\n          \"disable_properties\": true\n        },\n        \"title\": \"Configuration\",\n        \"description\": \"Configure every aspect.\",\n        \"additionalProperties\": false,\n        \"required\": " + JSON.stringify(Object.keys(schema)) + ",\n        \"properties\": " + JSON.stringify(schema) + "\n      }");
        }
    });
    exports.requestHandler.push(function (req, res) {
        if (req.path === "/config/current") {
            if (req.method === "GET") {
                res.setStatus(200);
                res.headers.set("Content-type", "application/json");
                res.end(JSON.stringify(configManager.config));
            }
            else if (req.method === "POST") {
                try {
                    if (req.body) {
                        configManager.saveConfig(JSON.parse(req.body));
                        res.setStatus(204);
                        res.end();
                    }
                    else {
                        res.setStatus(400);
                        res.end("No config provided.");
                    }
                }
                catch (error) {
                    console.error(error);
                    res.setStatus(500);
                    res.end("Internal server error while saving configuration.");
                }
            }
        }
    });
    exports.requestHandler.push(function (req, res) {
        if (/\/logs(|\?.*)/.exec(req.path)) {
            res.setStatus(200);
            res.headers.set("Content-type", "text/plain");
            global.el_flushLogBuffer();
            res.end(readFile("/data/logs.txt"));
        }
    });
    exports.requestHandler.push(function (req, res) {
        if (/\/deletelogs(|\?.*)/.exec(req.path)) {
            removeFile("/data/logs.txt");
            successMessage = "Logs were deleted successfully.";
            redirect(res, "/setup");
        }
    });
}
exports.startConfigServer = startConfigServer;
