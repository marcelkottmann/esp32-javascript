import { StringBuffer } from "./stringbuffer";

console.info("Load global.js (NEW)...");
require("./global.js");

/**
 * This is defines the function to append to buffered file logging.
 */
console.info("Loading logging buffer (NEW)...");
const TDIWEF = "TDIWEF";
global.el_flushLogBuffer = function (): void {
  const swap = global.logBuffer;
  global.logBuffer = new StringBuffer();
  appendFile("/data/logs.txt", swap.toString());
};
global.el_appendLogBuffer = function (message: string, level: number): void {
  global.logBuffer = global.logBuffer || new StringBuffer();
  const l = TDIWEF.substr(level, 1);
  global.logBuffer.append(`${l}\t${new Date()}\t${message}\n`);
  if (global.logBuffer.length > 1024) {
    global.el_flushLogBuffer();
  }
};

console.info("Importing http (NEW)...");
import http = require("./http");

console.info("Importing boot (NEW)...");
import boot = require("./boot");

console.info("Importing eventloop (NEW)...");
import eventloop = require("esp32-js-eventloop");

console.info("Importing config (NEW)...");
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
