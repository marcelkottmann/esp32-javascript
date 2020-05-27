[esp32-javascript](../README.md) › ["wifi-events/modules/wifi-events/index"](_wifi_events_modules_wifi_events_index_.md)

# Module: "wifi-events/modules/wifi-events/index"

## Index

### Interfaces

* [Esp32JsWifi](../interfaces/_wifi_events_modules_wifi_events_index_.esp32jswifi.md)
* [Esp32JsWifiEvent](../interfaces/_wifi_events_modules_wifi_events_index_.esp32jswifievent.md)

### Variables

* [wifi](_wifi_events_modules_wifi_events_index_.md#wifi)

### Functions

* [afterSuspend](_wifi_events_modules_wifi_events_index_.md#aftersuspend)
* [connectWifi](_wifi_events_modules_wifi_events_index_.md#connectwifi)
* [createSoftAp](_wifi_events_modules_wifi_events_index_.md#createsoftap)
* [getBssid](_wifi_events_modules_wifi_events_index_.md#getbssid)

## Variables

###  wifi

• **wifi**: *[Esp32JsWifi](../interfaces/_wifi_events_modules_wifi_events_index_.esp32jswifi.md) | undefined* = undefined

*Defined in [wifi-events/modules/wifi-events/index.ts:14](https://github.com/marcelkottmann/esp32-javascript/blob/79968c6/components/wifi-events/modules/wifi-events/index.ts#L14)*

## Functions

###  afterSuspend

▸ **afterSuspend**(`evt`: Esp32JsEventloopEvent, `collected`: Function[]): *boolean*

*Defined in [wifi-events/modules/wifi-events/index.ts:72](https://github.com/marcelkottmann/esp32-javascript/blob/79968c6/components/wifi-events/modules/wifi-events/index.ts#L72)*

**Parameters:**

Name | Type |
------ | ------ |
`evt` | Esp32JsEventloopEvent |
`collected` | Function[] |

**Returns:** *boolean*

___

###  connectWifi

▸ **connectWifi**(`ssid`: string, `password`: string, `callback`: function): *void*

*Defined in [wifi-events/modules/wifi-events/index.ts:31](https://github.com/marcelkottmann/esp32-javascript/blob/79968c6/components/wifi-events/modules/wifi-events/index.ts#L31)*

Connect to AP with given ssid and password.

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

###  createSoftAp

▸ **createSoftAp**(`ssid`: string, `password`: string, `callback`: function): *void*

*Defined in [wifi-events/modules/wifi-events/index.ts:49](https://github.com/marcelkottmann/esp32-javascript/blob/79968c6/components/wifi-events/modules/wifi-events/index.ts#L49)*

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

*Defined in [wifi-events/modules/wifi-events/index.ts:64](https://github.com/marcelkottmann/esp32-javascript/blob/79968c6/components/wifi-events/modules/wifi-events/index.ts#L64)*

Get the bssid of the current connected wifi AP as formatted as hex string.

**Returns:** *string*

The bssid.
