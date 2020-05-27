[esp32-javascript](../README.md) › ["esp32-javascript/modules/esp32-javascript/boot"](_esp32_javascript_modules_esp32_javascript_boot_.md)

# Module: "esp32-javascript/modules/esp32-javascript/boot"

## Index

### Variables

* [configServer](_esp32_javascript_modules_esp32_javascript_boot_.md#configserver)
* [configServerStarted](_esp32_javascript_modules_esp32_javascript_boot_.md#configserverstarted)
* [programLoaded](_esp32_javascript_modules_esp32_javascript_boot_.md#programloaded)
* [wifi](_esp32_javascript_modules_esp32_javascript_boot_.md#wifi)

### Functions

* [blink](_esp32_javascript_modules_esp32_javascript_boot_.md#blink)
* [connectToWifi](_esp32_javascript_modules_esp32_javascript_boot_.md#connecttowifi)
* [evalScript](_esp32_javascript_modules_esp32_javascript_boot_.md#evalscript)
* [main](_esp32_javascript_modules_esp32_javascript_boot_.md#main)
* [parseDate](_esp32_javascript_modules_esp32_javascript_boot_.md#parsedate)
* [startSoftApMode](_esp32_javascript_modules_esp32_javascript_boot_.md#startsoftapmode)

## Variables

###  configServer

• **configServer**: *["esp32-javascript/modules/esp32-javascript/configserver"](_esp32_javascript_modules_esp32_javascript_configserver_.md)*

*Defined in [esp32-javascript/modules/esp32-javascript/boot.ts:2](https://github.com/marcelkottmann/esp32-javascript/blob/79968c6/components/esp32-javascript/modules/esp32-javascript/boot.ts#L2)*

___

###  configServerStarted

• **configServerStarted**: *boolean* = false

*Defined in [esp32-javascript/modules/esp32-javascript/boot.ts:17](https://github.com/marcelkottmann/esp32-javascript/blob/79968c6/components/esp32-javascript/modules/esp32-javascript/boot.ts#L17)*

___

###  programLoaded

• **programLoaded**: *boolean* = false

*Defined in [esp32-javascript/modules/esp32-javascript/boot.ts:18](https://github.com/marcelkottmann/esp32-javascript/blob/79968c6/components/esp32-javascript/modules/esp32-javascript/boot.ts#L18)*

___

###  wifi

• **wifi**: *["wifi-events/modules/wifi-events/index"](_wifi_events_modules_wifi_events_index_.md)*

*Defined in [esp32-javascript/modules/esp32-javascript/boot.ts:1](https://github.com/marcelkottmann/esp32-javascript/blob/79968c6/components/esp32-javascript/modules/esp32-javascript/boot.ts#L1)*

## Functions

###  blink

▸ **blink**(): *number*

*Defined in [esp32-javascript/modules/esp32-javascript/boot.ts:20](https://github.com/marcelkottmann/esp32-javascript/blob/79968c6/components/esp32-javascript/modules/esp32-javascript/boot.ts#L20)*

**Returns:** *number*

___

###  connectToWifi

▸ **connectToWifi**(): *void*

*Defined in [esp32-javascript/modules/esp32-javascript/boot.ts:88](https://github.com/marcelkottmann/esp32-javascript/blob/79968c6/components/esp32-javascript/modules/esp32-javascript/boot.ts#L88)*

**Returns:** *void*

___

###  evalScript

▸ **evalScript**(`content`: string, `headers?`: Headers): *void*

*Defined in [esp32-javascript/modules/esp32-javascript/boot.ts:82](https://github.com/marcelkottmann/esp32-javascript/blob/79968c6/components/esp32-javascript/modules/esp32-javascript/boot.ts#L82)*

**Parameters:**

Name | Type |
------ | ------ |
`content` | string |
`headers?` | Headers |

**Returns:** *void*

___

###  main

▸ **main**(): *void*

*Defined in [esp32-javascript/modules/esp32-javascript/boot.ts:162](https://github.com/marcelkottmann/esp32-javascript/blob/79968c6/components/esp32-javascript/modules/esp32-javascript/boot.ts#L162)*

**Returns:** *void*

___

###  parseDate

▸ **parseDate**(`d`: string): *Date*

*Defined in [esp32-javascript/modules/esp32-javascript/boot.ts:57](https://github.com/marcelkottmann/esp32-javascript/blob/79968c6/components/esp32-javascript/modules/esp32-javascript/boot.ts#L57)*

**Parameters:**

Name | Type |
------ | ------ |
`d` | string |

**Returns:** *Date*

___

###  startSoftApMode

▸ **startSoftApMode**(): *void*

*Defined in [esp32-javascript/modules/esp32-javascript/boot.ts:28](https://github.com/marcelkottmann/esp32-javascript/blob/79968c6/components/esp32-javascript/modules/esp32-javascript/boot.ts#L28)*

**Returns:** *void*
