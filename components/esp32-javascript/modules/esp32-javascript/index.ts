console.info("Load global.js (NEW)...");
require("./global.js");

import http = require("./http");
import boot = require("./boot");
import eventloop = require("esp32-js-eventloop");
import configManager = require("./config");

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
