/**
 * @module wifi-events
 */

var eventloop = require('esp32-javascript/eventloop');
var afterSuspendHandlers = eventloop.afterSuspendHandlers;

var wifi = undefined;

/**
 * Callback for wifi status.
 *
 * @callback wifiStatusCallback
 * @param  status - The connection status.
 */

/**
 * Connect to AP with given ssid and password.
 * 
 * @param ssid The ssid of the wifi network.
 * @param password The password of the wifi network.
 * @param {wifiStatusCallback} callback A cb which gets the connect status updates.
 */
exports.connectWifi = function (ssid, password, callback) {
	wifi = {
		status: callback,
	};
	el_connectWifi(ssid, password);
}

/**
 * Create soft AP with given ssid and password.
 * 
 * @param ssid The ssid of the wifi network.
 * @param password The password of the wifi network.
 * @param {wifiStatusCallback} callback A cb which gets the connect status updates.
 */
exports.createSoftAp = function (ssid, password, callback) {
	wifi = {
		status: callback,
	};
	el_createSoftAp(ssid, password);
}

/**
 * Get the bssid of the current connected wifi AP as formatted as hex string.
 * @returns The bssid.
 */
exports.getBssid = function () {
	return getWifiConfig().bssid.map(function (n) { return n.toString(16) }).join(':');
}

function afterSuspend(evt, collected) {
	if (evt.type === EL_WIFI_EVENT_TYPE) {
		collected.push(function (evt) { return function () { wifi.status(evt) } }(evt));
		return true;
	}
	return false
}

afterSuspendHandlers.push(afterSuspend);
