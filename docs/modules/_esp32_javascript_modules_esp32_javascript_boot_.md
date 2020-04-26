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

*Defined in [esp32-javascript/modules/esp32-javascript/boot.ts:28](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/esp32-javascript/modules/esp32-javascript/boot.ts#L28)*

___

###  configServer

• **configServer**: *["esp32-javascript/modules/esp32-javascript/configserver"](_esp32_javascript_modules_esp32_javascript_configserver_.md)*

*Defined in [esp32-javascript/modules/esp32-javascript/boot.ts:2](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/esp32-javascript/modules/esp32-javascript/boot.ts#L2)*

___

### `Let` configServerStarted

• **configServerStarted**: *boolean* = false

*Defined in [esp32-javascript/modules/esp32-javascript/boot.ts:17](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/esp32-javascript/modules/esp32-javascript/boot.ts#L17)*

___

### `Let` programLoaded

• **programLoaded**: *boolean* = false

*Defined in [esp32-javascript/modules/esp32-javascript/boot.ts:18](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/esp32-javascript/modules/esp32-javascript/boot.ts#L18)*

___

###  wifi

• **wifi**: *["wifi-events/modules/wifi-events/index"](_wifi_events_modules_wifi_events_index_.md)*

*Defined in [esp32-javascript/modules/esp32-javascript/boot.ts:1](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/esp32-javascript/modules/esp32-javascript/boot.ts#L1)*

## Functions

###  blink

▸ **blink**(): *number*

*Defined in [esp32-javascript/modules/esp32-javascript/boot.ts:20](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/esp32-javascript/modules/esp32-javascript/boot.ts#L20)*

**Returns:** *number*

___

###  connectToWifi

▸ **connectToWifi**(): *void*

*Defined in [esp32-javascript/modules/esp32-javascript/boot.ts:111](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/esp32-javascript/modules/esp32-javascript/boot.ts#L111)*

**Returns:** *void*

___

###  evalScript

▸ **evalScript**(`content`: string, `headers?`: Headers): *void*

*Defined in [esp32-javascript/modules/esp32-javascript/boot.ts:96](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/esp32-javascript/modules/esp32-javascript/boot.ts#L96)*

**Parameters:**

Name | Type |
------ | ------ |
`content` | string |
`headers?` | Headers |

**Returns:** *void*

___

###  getBootTime

▸ **getBootTime**(): *Date*

*Defined in [esp32-javascript/modules/esp32-javascript/boot.ts:34](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/esp32-javascript/modules/esp32-javascript/boot.ts#L34)*

**Returns:** *Date*

___

###  loadOfflineScript

▸ **loadOfflineScript**(): *void*

*Defined in [esp32-javascript/modules/esp32-javascript/boot.ts:102](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/esp32-javascript/modules/esp32-javascript/boot.ts#L102)*

**Returns:** *void*

___

###  main

▸ **main**(): *void*

*Defined in [esp32-javascript/modules/esp32-javascript/boot.ts:192](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/esp32-javascript/modules/esp32-javascript/boot.ts#L192)*

**Returns:** *void*

___

###  parseDate

▸ **parseDate**(`d`: string): *Date*

*Defined in [esp32-javascript/modules/esp32-javascript/boot.ts:67](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/esp32-javascript/modules/esp32-javascript/boot.ts#L67)*

**Parameters:**

Name | Type |
------ | ------ |
`d` | string |

**Returns:** *Date*

___

###  setBootTime

▸ **setBootTime**(`date`: Date): *void*

*Defined in [esp32-javascript/modules/esp32-javascript/boot.ts:30](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/esp32-javascript/modules/esp32-javascript/boot.ts#L30)*

**Parameters:**

Name | Type |
------ | ------ |
`date` | Date |

**Returns:** *void*

___

###  startSoftApMode

▸ **startSoftApMode**(): *void*

*Defined in [esp32-javascript/modules/esp32-javascript/boot.ts:38](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/esp32-javascript/modules/esp32-javascript/boot.ts#L38)*

**Returns:** *void*
