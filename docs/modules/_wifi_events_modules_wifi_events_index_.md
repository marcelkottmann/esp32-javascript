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
* [convertIPAddress](_wifi_events_modules_wifi_events_index_.md#convertipaddress)
* [createSoftAp](_wifi_events_modules_wifi_events_index_.md#createsoftap)
* [getBssid](_wifi_events_modules_wifi_events_index_.md#getbssid)
* [getIPAddress](_wifi_events_modules_wifi_events_index_.md#getipaddress)
* [resetWifiStatus](_wifi_events_modules_wifi_events_index_.md#resetwifistatus)

## Variables

### `Let` wifi

• **wifi**: *[Esp32JsWifi](../interfaces/_wifi_events_modules_wifi_events_index_.esp32jswifi.md) | undefined* = undefined

*Defined in [wifi-events/modules/wifi-events/index.ts:15](https://github.com/marcelkottmann/esp32-javascript/blob/801e1cb/components/wifi-events/modules/wifi-events/index.ts#L15)*

## Functions

###  afterSuspend

▸ **afterSuspend**(`evt`: Esp32JsEventloopEvent, `collected`: Function[]): *boolean*

*Defined in [wifi-events/modules/wifi-events/index.ts:98](https://github.com/marcelkottmann/esp32-javascript/blob/801e1cb/components/wifi-events/modules/wifi-events/index.ts#L98)*

**Parameters:**

Name | Type |
------ | ------ |
`evt` | Esp32JsEventloopEvent |
`collected` | Function[] |

**Returns:** *boolean*

___

###  connectWifi

▸ **connectWifi**(`ssid`: string, `password`: string, `callback`: function): *void*

*Defined in [wifi-events/modules/wifi-events/index.ts:34](https://github.com/marcelkottmann/esp32-javascript/blob/801e1cb/components/wifi-events/modules/wifi-events/index.ts#L34)*

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

**Returns:** *void*

___

###  convertIPAddress

▸ **convertIPAddress**(`ip`: number): *string | undefined*

*Defined in [wifi-events/modules/wifi-events/index.ts:75](https://github.com/marcelkottmann/esp32-javascript/blob/801e1cb/components/wifi-events/modules/wifi-events/index.ts#L75)*

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

*Defined in [wifi-events/modules/wifi-events/index.ts:50](https://github.com/marcelkottmann/esp32-javascript/blob/801e1cb/components/wifi-events/modules/wifi-events/index.ts#L50)*

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

▸ **getBssid**(): *string*

*Defined in [wifi-events/modules/wifi-events/index.ts:63](https://github.com/marcelkottmann/esp32-javascript/blob/801e1cb/components/wifi-events/modules/wifi-events/index.ts#L63)*

Get the bssid of the current connected wifi AP as formatted as hex string.

**Returns:** *string*

The bssid.

___

###  getIPAddress

▸ **getIPAddress**(): *string | undefined*

*Defined in [wifi-events/modules/wifi-events/index.ts:93](https://github.com/marcelkottmann/esp32-javascript/blob/801e1cb/components/wifi-events/modules/wifi-events/index.ts#L93)*

Get the ip address.

**Returns:** *string | undefined*

The ip address or undefined..

___

###  resetWifiStatus

▸ **resetWifiStatus**(`callback`: function): *[Esp32JsWifi](../interfaces/_wifi_events_modules_wifi_events_index_.esp32jswifi.md)*

*Defined in [wifi-events/modules/wifi-events/index.ts:17](https://github.com/marcelkottmann/esp32-javascript/blob/801e1cb/components/wifi-events/modules/wifi-events/index.ts#L17)*

**Parameters:**

▪ **callback**: *function*

▸ (`event`: [Esp32JsWifiEvent](../interfaces/_wifi_events_modules_wifi_events_index_.esp32jswifievent.md), `ip`: string | undefined): *void*

**Parameters:**

Name | Type |
------ | ------ |
`event` | [Esp32JsWifiEvent](../interfaces/_wifi_events_modules_wifi_events_index_.esp32jswifievent.md) |
`ip` | string &#124; undefined |

**Returns:** *[Esp32JsWifi](../interfaces/_wifi_events_modules_wifi_events_index_.esp32jswifi.md)*
