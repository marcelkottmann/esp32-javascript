console.info('Load global.js (NEW)...')
require('./global.js');

console.info('Loading promise.js and exposing globals (NEW)...')
global.Promise = require('./promise.js').Promise;

console.info('Loading http.js and exposing globals (NEW)...')
global.XMLHttpRequest = require('./http').XMLHttpRequest;

console.info('Loading fetch.js and exposing globals (NEW)...')
require('./fetch.js');

console.info('Loading boot.js and exposing main (NEW)...')
global.main = require('./boot').main;

console.info('Loading socket-events (NEW)...')
require('socket-events');

console.info('Loading wifi-events (NEW)...')
require('wifi-events');

console.info('Loading eventloop.js and starting eventloop (NEW)...')
require('./eventloop').start();
