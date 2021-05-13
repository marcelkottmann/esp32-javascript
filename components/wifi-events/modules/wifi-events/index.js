Object.defineProperty(exports, "__esModule", { value: true });
exports.getIPAddress = exports.getBssid = exports.createSoftAp = exports.connectWifi = void 0;
var esp32_js_eventloop_1 = require("esp32-js-eventloop");
var wifi = undefined;
function resetWifiStatus(callback) {
    wifi = {
        status: callback,
        ip: undefined,
    };
    return wifi;
}
/**
 * Connect to AP with given ssid and password.
 *
 * @param ssid The ssid of the wifi network.
 * @param password The password of the wifi network.
 * @param {wifiStatusCallback} callback A cb which gets the connect status updates.
 */
function connectWifi(ssid, password, callback) {
    resetWifiStatus(callback);
    el_connectWifi(ssid, password);
}
exports.connectWifi = connectWifi;
/**
 * Create soft AP with given ssid and password.
 *
 * @param ssid The ssid of the wifi network.
 * @param password The password of the wifi network.
 * @param {wifiStatusCallback} callback A cb which gets the connect status updates.
 */
function createSoftAp(ssid, password, callback) {
    resetWifiStatus(callback);
    el_createSoftAp(ssid, password);
}
exports.createSoftAp = createSoftAp;
/**
 * Get the bssid of the current connected wifi AP as formatted as hex string.
 * @returns The bssid.
 */
function getBssid() {
    return getWifiConfig()
        .bssid.map(function (n) {
        return n.toString(16);
    })
        .join(":");
}
exports.getBssid = getBssid;
/**
 * Convert 32 bit number to ip address string.
 * @returns The ip address as string representation.
 */
function convertIPAddress(ip) {
    if (ip > 0) {
        return ((ip & 0xff) +
            "." +
            ((ip >>> 8) & 0xff) +
            "." +
            ((ip >>> 16) & 0xff) +
            "." +
            ((ip >>> 24) & 0xff));
    }
}
/**
 * Get the ip address.
 * @returns The ip address or undefined..
 */
function getIPAddress() {
    return wifi === null || wifi === void 0 ? void 0 : wifi.ip;
}
exports.getIPAddress = getIPAddress;
// eslint-disable-next-line @typescript-eslint/ban-types
function afterSuspend(evt, collected) {
    if (evt.type === EL_WIFI_EVENT_TYPE) {
        collected.push(function () {
            if (wifi) {
                var ip = convertIPAddress(evt.fd);
                wifi.ip = ip;
                wifi.status(evt, ip);
            }
        });
        return true;
    }
    return false;
}
esp32_js_eventloop_1.afterSuspendHandlers.push(afterSuspend);
