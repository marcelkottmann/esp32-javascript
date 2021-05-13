import { afterSuspendHandlers } from "esp32-js-eventloop";

/**
 * @module wifi-events
 */
interface Esp32JsWifiEvent {
  status: number;
}

interface Esp32JsWifi {
  status: (event: Esp32JsWifiEvent, ip: string | undefined) => void;
  ip: string | undefined;
}

let wifi: Esp32JsWifi | undefined = undefined;

function resetWifiStatus(
  callback: (event: Esp32JsWifiEvent, ip: string | undefined) => void
) {
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
export function connectWifi(
  ssid: string,
  password: string,
  callback: (event: Esp32JsWifiEvent, ip: string | undefined) => void
): void {
  resetWifiStatus(callback);
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
  resetWifiStatus(callback);
  el_createSoftAp(ssid, password);
}

/**
 * Get the bssid of the current connected wifi AP as formatted as hex string.
 * @returns The bssid.
 */
export function getBssid(): string {
  return getWifiConfig()
    .bssid.map((n) => {
      return n.toString(16);
    })
    .join(":");
}

/**
 * Convert 32 bit number to ip address string.
 * @returns The ip address as string representation.
 */
function convertIPAddress(ip: number): string | undefined {
  if (ip > 0) {
    return (
      (ip & 0xff) +
      "." +
      ((ip >>> 8) & 0xff) +
      "." +
      ((ip >>> 16) & 0xff) +
      "." +
      ((ip >>> 24) & 0xff)
    );
  }
}

/**
 * Get the ip address.
 * @returns The ip address or undefined..
 */
export function getIPAddress(): string | undefined {
  return wifi?.ip;
}

// eslint-disable-next-line @typescript-eslint/ban-types
function afterSuspend(evt: Esp32JsEventloopEvent, collected: Function[]) {
  if (evt.type === EL_WIFI_EVENT_TYPE) {
    collected.push(() => {
      if (wifi) {
        const ip = convertIPAddress(evt.fd);
        wifi.ip = ip;
        wifi.status(evt, ip);
      }
    });
    return true;
  }
  return false;
}

afterSuspendHandlers.push(afterSuspend);
