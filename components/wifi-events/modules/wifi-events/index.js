Object.defineProperty(exports, "__esModule", { value: true });
var esp32_js_eventloop_1 = require("esp32-js-eventloop");
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
function connectWifi(ssid, password, callback) {
    wifi = {
        status: callback,
    };
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
    wifi = {
        status: callback,
    };
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
function afterSuspend(evt, collected) {
    if (evt.type === EL_WIFI_EVENT_TYPE) {
        collected.push((function (evt) {
            return function () {
                if (wifi) {
                    wifi.status(evt);
                }
            };
        })(evt));
        return true;
    }
    return false;
}
esp32_js_eventloop_1.afterSuspendHandlers.push(afterSuspend);
