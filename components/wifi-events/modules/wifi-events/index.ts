import { afterSuspendHandlers } from "esp32-js-eventloop";

/**
 * @module wifi-events
 */
interface Esp32JsWifiEvent {
  status: number;
}

interface Esp32JsWifi {
  status: (event: Esp32JsWifiEvent) => void;
}

var wifi: Esp32JsWifi | undefined = undefined;

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

export function connectWifi(
  ssid: string,
  password: string,
  callback: (event: Esp32JsWifiEvent) => void
): void {
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
export function createSoftAp(
  ssid: string,
  password: string,
  callback: (event: Esp32JsWifiEvent) => void
): void {
  wifi = {
    status: callback,
  };
  el_createSoftAp(ssid, password);
}

/**
 * Get the bssid of the current connected wifi AP as formatted as hex string.
 * @returns The bssid.
 */
export function getBssid() {
  return getWifiConfig()
    .bssid.map(function (n) {
      return n.toString(16);
    })
    .join(":");
}

function afterSuspend(evt: Esp32JsEventloopEvent, collected: Function[]) {
  if (evt.type === EL_WIFI_EVENT_TYPE) {
    collected.push(
      (function (evt) {
        return function () {
          if (wifi) {
            wifi.status(evt);
          }
        };
      })(evt)
    );
    return true;
  }
  return false;
}

afterSuspendHandlers.push(afterSuspend);
