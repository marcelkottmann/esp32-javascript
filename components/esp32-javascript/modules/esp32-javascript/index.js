Object.defineProperty(exports, "__esModule", { value: true });
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
var stringbuffer_1 = require("./stringbuffer");
console.info("Load global.js (NEW)...");
require("./global.js");
/**
 * This is defines the function to append to buffered file logging.
 */
console.info("Loading logging buffer (NEW)...");
var TDIWEF = "TDIWEF";
global.el_flushLogBuffer = function () {
    var swap = global.logBuffer;
    global.logBuffer = new stringbuffer_1.StringBuffer();
    appendFile("/data/logs.txt", swap.toString());
};
global.el_appendLogBuffer = function (message, level) {
    global.logBuffer = global.logBuffer || new stringbuffer_1.StringBuffer();
    var l = TDIWEF.substr(level, 1);
    global.logBuffer.append(l + "\t" + new Date() + "\t" + message + "\n");
    if (global.logBuffer.length > 1024) {
        global.el_flushLogBuffer();
    }
};
console.info("Importing http (NEW)...");
var http = require("./http");
console.info("Importing boot (NEW)...");
var boot = require("./boot");
console.info("Importing eventloop (NEW)...");
var eventloop = require("esp32-js-eventloop");
console.info("Importing config (NEW)...");
var configManager = require("./config");
console.info("Loading promise.js and exposing globals (NEW)...");
// eslint-disable-next-line @typescript-eslint/no-var-requires
global.Promise = require("./promise.js").Promise;
console.info("Loading config (NEW)...");
configManager.reloadConfig();
console.info("Loading http.js and exposing globals (NEW)...");
global.XMLHttpRequest = http.XMLHttpRequest;
console.info("Loading fetch.js and exposing globals (NEW)...");
require("./fetch.js");
console.info("Loading boot.js and exposing main (NEW)...");
global.main = boot.main;
console.info("Loading socket-events (NEW)...");
require("socket-events");
console.info("Loading wifi-events (NEW)...");
require("wifi-events");
console.info("Loading eventloop.js and starting eventloop (NEW)...");
eventloop.start();
