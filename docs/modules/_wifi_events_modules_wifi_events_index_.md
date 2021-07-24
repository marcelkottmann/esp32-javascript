[esp32-javascript](../README.md) › ["wifi-events/modules/wifi-events/index"](_wifi_events_modules_wifi_events_index_.md)

# Module: "wifi-events/modules/wifi-events/index"

## Index

### Interfaces

* [Esp32JsWifi](../interfaces/_wifi_events_modules_wifi_events_index_.esp32jswifi.md)
* [Esp32JsWifiEvent](../interfaces/_wifi_events_modules_wifi_events_index_.esp32jswifievent.md)

### Variables

* [wifi](_wifi_events_modules_wifi_events_index_.md#let-wifi)

### Functions

* [afterSuspend](_wifi_events_modules_wifi_events_index_.md#aftersuspend)
* [connectWifi](_wifi_events_modules_wifi_events_index_.md#connectwifi)
* [convertBssidToArray](_wifi_events_modules_wifi_events_index_.md#convertbssidtoarray)
* [convertBssidToString](_wifi_events_modules_wifi_events_index_.md#convertbssidtostring)
* [convertIPAddress](_wifi_events_modules_wifi_events_index_.md#convertipaddress)
* [createSoftAp](_wifi_events_modules_wifi_events_index_.md#createsoftap)
* [getBssid](_wifi_events_modules_wifi_events_index_.md#getbssid)
* [getIPAddress](_wifi_events_modules_wifi_events_index_.md#getipaddress)
* [resetWifiStatus](_wifi_events_modules_wifi_events_index_.md#resetwifistatus)

## Variables

### `Let` wifi

• **wifi**: *[Esp32JsWifi](../interfaces/_wifi_events_modules_wifi_events_index_.esp32jswifi.md) | undefined* = undefined

*Defined in [wifi-events/modules/wifi-events/index.ts:38](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/wifi-events/modules/wifi-events/index.ts#L38)*

## Functions

###  afterSuspend

▸ **afterSuspend**(`evt`: Esp32JsEventloopEvent, `collected`: function[]): *boolean*

*Defined in [wifi-events/modules/wifi-events/index.ts:152](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/wifi-events/modules/wifi-events/index.ts#L152)*

**Parameters:**

Name | Type |
------ | ------ |
`evt` | Esp32JsEventloopEvent |
`collected` | function[] |

**Returns:** *boolean*

___

###  connectWifi

▸ **connectWifi**(`ssid`: string, `password`: string, `callback`: function, `bssid?`: undefined | string): *void*

*Defined in [wifi-events/modules/wifi-events/index.ts:58](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/wifi-events/modules/wifi-events/index.ts#L58)*

Connect to AP with given ssid and password.

**Parameters:**

▪ **ssid**: *string*

The ssid of the wifi network.

▪ **password**: *string*

The password of the wifi network.

▪ **callback**: *function*

A cb which gets the connect status updates.

▸ (`event`: [Esp32JsWifiEvent](../interfaces/_wifi_events_modules_wifi_events_index_.esp32jswifievent.md), `ip`: string | undefined): *void*

**Parameters:**

Name | Type |
------ | ------ |
`event` | [Esp32JsWifiEvent](../interfaces/_wifi_events_modules_wifi_events_index_.esp32jswifievent.md) |
`ip` | string &#124; undefined |

▪`Optional`  **bssid**: *undefined | string*

Optional bssid to pin to a specific AP.

**Returns:** *void*

___

###  convertBssidToArray

▸ **convertBssidToArray**(`bssid`: string): *[number, number, number, number, number, number] | undefined*

*Defined in [wifi-events/modules/wifi-events/index.ts:117](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/wifi-events/modules/wifi-events/index.ts#L117)*

Converts a bssid string representation in a 6 number array.

**Parameters:**

Name | Type |
------ | ------ |
`bssid` | string |

**Returns:** *[number, number, number, number, number, number] | undefined*

The bssid as 6 number array.

___

###  convertBssidToString

▸ **convertBssidToString**(`bssid`: [number, number, number, number, number, number]): *string | undefined*

*Defined in [wifi-events/modules/wifi-events/index.ts:100](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/wifi-events/modules/wifi-events/index.ts#L100)*

Converts a 6 number array into a string representation of a BSSID.

**Parameters:**

Name | Type |
------ | ------ |
`bssid` | [number, number, number, number, number, number] |

**Returns:** *string | undefined*

The bssid as string representation.

___

###  convertIPAddress

▸ **convertIPAddress**(`ip`: number): *string | undefined*

*Defined in [wifi-events/modules/wifi-events/index.ts:130](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/wifi-events/modules/wifi-events/index.ts#L130)*

Convert 32 bit number to ip address string.

**Parameters:**

Name | Type |
------ | ------ |
`ip` | number |

**Returns:** *string | undefined*

The ip address as string representation.

___

###  createSoftAp

▸ **createSoftAp**(`ssid`: string, `password`: string, `callback`: function): *void*

*Defined in [wifi-events/modules/wifi-events/index.ts:79](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/wifi-events/modules/wifi-events/index.ts#L79)*

Create soft AP with given ssid and password.

**Parameters:**

▪ **ssid**: *string*

The ssid of the wifi network.

▪ **password**: *string*

The password of the wifi network.

▪ **callback**: *function*

A cb which gets the connect status updates.

▸ (`event`: [Esp32JsWifiEvent](../interfaces/_wifi_events_modules_wifi_events_index_.esp32jswifievent.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`event` | [Esp32JsWifiEvent](../interfaces/_wifi_events_modules_wifi_events_index_.esp32jswifievent.md) |

**Returns:** *void*

___

###  getBssid

▸ **getBssid**(): *string | undefined*

*Defined in [wifi-events/modules/wifi-events/index.ts:92](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/wifi-events/modules/wifi-events/index.ts#L92)*

Get the bssid of the current connected wifi AP as formatted as hex string.

**Returns:** *string | undefined*

The bssid.

___

###  getIPAddress

▸ **getIPAddress**(): *string | undefined*

*Defined in [wifi-events/modules/wifi-events/index.ts:148](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/wifi-events/modules/wifi-events/index.ts#L148)*

Get the ip address.

**Returns:** *string | undefined*

The ip address or undefined..

___

###  resetWifiStatus

▸ **resetWifiStatus**(`callback`: function): *[Esp32JsWifi](../interfaces/_wifi_events_modules_wifi_events_index_.esp32jswifi.md)*

*Defined in [wifi-events/modules/wifi-events/index.ts:40](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/wifi-events/modules/wifi-events/index.ts#L40)*

**Parameters:**

▪ **callback**: *function*

▸ (`event`: [Esp32JsWifiEvent](../interfaces/_wifi_events_modules_wifi_events_index_.esp32jswifievent.md), `ip`: string | undefined): *void*

**Parameters:**

Name | Type |
------ | ------ |
`event` | [Esp32JsWifiEvent](../interfaces/_wifi_events_modules_wifi_events_index_.esp32jswifievent.md) |
`ip` | string &#124; undefined |

**Returns:** *[Esp32JsWifi](../interfaces/_wifi_events_modules_wifi_events_index_.esp32jswifi.md)*
