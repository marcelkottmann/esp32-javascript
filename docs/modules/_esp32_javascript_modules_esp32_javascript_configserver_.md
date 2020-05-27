[esp32-javascript](../README.md) › ["esp32-javascript/modules/esp32-javascript/configserver"](_esp32_javascript_modules_esp32_javascript_configserver_.md)

# Module: "esp32-javascript/modules/esp32-javascript/configserver"

## Index

### Variables

* [baExceptionPathes](_esp32_javascript_modules_esp32_javascript_configserver_.md#baexceptionpathes)
* [configManager](_esp32_javascript_modules_esp32_javascript_configserver_.md#configmanager)
* [requestHandler](_esp32_javascript_modules_esp32_javascript_configserver_.md#requesthandler)

### Functions

* [getHeader](_esp32_javascript_modules_esp32_javascript_configserver_.md#getheader)
* [page](_esp32_javascript_modules_esp32_javascript_configserver_.md#page)
* [redirect](_esp32_javascript_modules_esp32_javascript_configserver_.md#redirect)
* [startConfigServer](_esp32_javascript_modules_esp32_javascript_configserver_.md#startconfigserver)

## Variables

###  baExceptionPathes

• **baExceptionPathes**: *string[]* = []

*Defined in [esp32-javascript/modules/esp32-javascript/configserver.ts:10](https://github.com/marcelkottmann/esp32-javascript/blob/2b53f2e/components/esp32-javascript/modules/esp32-javascript/configserver.ts#L10)*

___

###  configManager

• **configManager**: *["esp32-javascript/modules/esp32-javascript/config"](_esp32_javascript_modules_esp32_javascript_config_.md)*

*Defined in [esp32-javascript/modules/esp32-javascript/configserver.ts:1](https://github.com/marcelkottmann/esp32-javascript/blob/2b53f2e/components/esp32-javascript/modules/esp32-javascript/configserver.ts#L1)*

___

###  requestHandler

• **requestHandler**: *function[]* = []

*Defined in [esp32-javascript/modules/esp32-javascript/configserver.ts:9](https://github.com/marcelkottmann/esp32-javascript/blob/2b53f2e/components/esp32-javascript/modules/esp32-javascript/configserver.ts#L9)*

## Functions

###  getHeader

▸ **getHeader**(`statusCode`: number, `additionalHeaders`: string): *string*

*Defined in [esp32-javascript/modules/esp32-javascript/configserver.ts:12](https://github.com/marcelkottmann/esp32-javascript/blob/2b53f2e/components/esp32-javascript/modules/esp32-javascript/configserver.ts#L12)*

**Parameters:**

Name | Type |
------ | ------ |
`statusCode` | number |
`additionalHeaders` | string |

**Returns:** *string*

___

###  page

▸ **page**(`res`: [Esp32JsResponse](../interfaces/_esp32_javascript_modules_esp32_javascript_http_.esp32jsresponse.md), `headline`: string, `text`: string | string[], `cb?`: undefined | function): *void*

*Defined in [esp32-javascript/modules/esp32-javascript/configserver.ts:27](https://github.com/marcelkottmann/esp32-javascript/blob/2b53f2e/components/esp32-javascript/modules/esp32-javascript/configserver.ts#L27)*

**Parameters:**

Name | Type |
------ | ------ |
`res` | [Esp32JsResponse](../interfaces/_esp32_javascript_modules_esp32_javascript_http_.esp32jsresponse.md) |
`headline` | string |
`text` | string &#124; string[] |
`cb?` | undefined &#124; function |

**Returns:** *void*

___

###  redirect

▸ **redirect**(`res`: [Esp32JsResponse](../interfaces/_esp32_javascript_modules_esp32_javascript_http_.esp32jsresponse.md), `location`: string): *void*

*Defined in [esp32-javascript/modules/esp32-javascript/configserver.ts:23](https://github.com/marcelkottmann/esp32-javascript/blob/2b53f2e/components/esp32-javascript/modules/esp32-javascript/configserver.ts#L23)*

**Parameters:**

Name | Type |
------ | ------ |
`res` | [Esp32JsResponse](../interfaces/_esp32_javascript_modules_esp32_javascript_http_.esp32jsresponse.md) |
`location` | string |

**Returns:** *void*

___

###  startConfigServer

▸ **startConfigServer**(): *void*

*Defined in [esp32-javascript/modules/esp32-javascript/configserver.ts:56](https://github.com/marcelkottmann/esp32-javascript/blob/2b53f2e/components/esp32-javascript/modules/esp32-javascript/configserver.ts#L56)*

**Returns:** *void*
