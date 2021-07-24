[esp32-javascript](../README.md) › ["esp32-javascript/modules/esp32-javascript/boot"](_esp32_javascript_modules_esp32_javascript_boot_.md)

# Module: "esp32-javascript/modules/esp32-javascript/boot"

## Index

### Variables

* [bootTime](_esp32_javascript_modules_esp32_javascript_boot_.md#let-boottime)
* [configServer](_esp32_javascript_modules_esp32_javascript_boot_.md#configserver)
* [configServerStarted](_esp32_javascript_modules_esp32_javascript_boot_.md#let-configserverstarted)
* [programLoaded](_esp32_javascript_modules_esp32_javascript_boot_.md#let-programloaded)
* [wifi](_esp32_javascript_modules_esp32_javascript_boot_.md#wifi)

### Functions

* [blink](_esp32_javascript_modules_esp32_javascript_boot_.md#blink)
* [connectToWifi](_esp32_javascript_modules_esp32_javascript_boot_.md#connecttowifi)
* [evalScript](_esp32_javascript_modules_esp32_javascript_boot_.md#evalscript)
* [getBootTime](_esp32_javascript_modules_esp32_javascript_boot_.md#getboottime)
* [loadOfflineScript](_esp32_javascript_modules_esp32_javascript_boot_.md#loadofflinescript)
* [main](_esp32_javascript_modules_esp32_javascript_boot_.md#main)
* [parseDate](_esp32_javascript_modules_esp32_javascript_boot_.md#parsedate)
* [setBootTime](_esp32_javascript_modules_esp32_javascript_boot_.md#setboottime)
* [startSoftApMode](_esp32_javascript_modules_esp32_javascript_boot_.md#startsoftapmode)

## Variables

### `Let` bootTime

• **bootTime**: *Date* = new Date()

*Defined in [esp32-javascript/modules/esp32-javascript/boot.ts:53](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/boot.ts#L53)*

___

###  configServer

• **configServer**: *["esp32-javascript/modules/esp32-javascript/configserver"](_esp32_javascript_modules_esp32_javascript_configserver_.md)*

*Defined in [esp32-javascript/modules/esp32-javascript/boot.ts:25](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/boot.ts#L25)*

___

### `Let` configServerStarted

• **configServerStarted**: *boolean* = false

*Defined in [esp32-javascript/modules/esp32-javascript/boot.ts:40](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/boot.ts#L40)*

___

### `Let` programLoaded

• **programLoaded**: *boolean* = false

*Defined in [esp32-javascript/modules/esp32-javascript/boot.ts:41](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/boot.ts#L41)*

___

###  wifi

• **wifi**: *["wifi-events/modules/wifi-events/index"](_wifi_events_modules_wifi_events_index_.md)*

*Defined in [esp32-javascript/modules/esp32-javascript/boot.ts:24](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/boot.ts#L24)*

## Functions

###  blink

▸ **blink**(): *undefined | number*

*Defined in [esp32-javascript/modules/esp32-javascript/boot.ts:43](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/boot.ts#L43)*

**Returns:** *undefined | number*

___

###  connectToWifi

▸ **connectToWifi**(): *void*

*Defined in [esp32-javascript/modules/esp32-javascript/boot.ts:138](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/boot.ts#L138)*

**Returns:** *void*

___

###  evalScript

▸ **evalScript**(`content`: string, `headers?`: Headers): *void*

*Defined in [esp32-javascript/modules/esp32-javascript/boot.ts:121](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/boot.ts#L121)*

**Parameters:**

Name | Type |
------ | ------ |
`content` | string |
`headers?` | Headers |

**Returns:** *void*

___

###  getBootTime

▸ **getBootTime**(): *Date*

*Defined in [esp32-javascript/modules/esp32-javascript/boot.ts:59](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/boot.ts#L59)*

**Returns:** *Date*

___

###  loadOfflineScript

▸ **loadOfflineScript**(): *void*

*Defined in [esp32-javascript/modules/esp32-javascript/boot.ts:129](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/boot.ts#L129)*

**Returns:** *void*

___

###  main

▸ **main**(): *void*

*Defined in [esp32-javascript/modules/esp32-javascript/boot.ts:229](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/boot.ts#L229)*

**Returns:** *void*

___

###  parseDate

▸ **parseDate**(`d`: string): *Date*

*Defined in [esp32-javascript/modules/esp32-javascript/boot.ts:92](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/boot.ts#L92)*

**Parameters:**

Name | Type |
------ | ------ |
`d` | string |

**Returns:** *Date*

___

###  setBootTime

▸ **setBootTime**(`date`: Date): *void*

*Defined in [esp32-javascript/modules/esp32-javascript/boot.ts:55](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/boot.ts#L55)*

**Parameters:**

Name | Type |
------ | ------ |
`date` | Date |

**Returns:** *void*

___

###  startSoftApMode

▸ **startSoftApMode**(): *void*

*Defined in [esp32-javascript/modules/esp32-javascript/boot.ts:63](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/boot.ts#L63)*

**Returns:** *void*
