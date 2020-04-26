[esp32-javascript](../README.md) › ["esp32-javascript/modules/esp32-javascript/configserver"](_esp32_javascript_modules_esp32_javascript_configserver_.md)

# Module: "esp32-javascript/modules/esp32-javascript/configserver"

## Index

### Variables

* [baExceptionPathes](_esp32_javascript_modules_esp32_javascript_configserver_.md#const-baexceptionpathes)
* [configManager](_esp32_javascript_modules_esp32_javascript_configserver_.md#configmanager)
* [requestHandler](_esp32_javascript_modules_esp32_javascript_configserver_.md#const-requesthandler)

### Functions

* [addSchema](_esp32_javascript_modules_esp32_javascript_configserver_.md#addschema)
* [page](_esp32_javascript_modules_esp32_javascript_configserver_.md#page)
* [redirect](_esp32_javascript_modules_esp32_javascript_configserver_.md#redirect)
* [startConfigServer](_esp32_javascript_modules_esp32_javascript_configserver_.md#startconfigserver)

### Object literals

* [schema](_esp32_javascript_modules_esp32_javascript_configserver_.md#let-schema)

## Variables

### `Const` baExceptionPathes

• **baExceptionPathes**: *string[]* = []

*Defined in [esp32-javascript/modules/esp32-javascript/configserver.ts:87](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/esp32-javascript/modules/esp32-javascript/configserver.ts#L87)*

___

###  configManager

• **configManager**: *["esp32-javascript/modules/esp32-javascript/config"](_esp32_javascript_modules_esp32_javascript_config_.md)*

*Defined in [esp32-javascript/modules/esp32-javascript/configserver.ts:1](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/esp32-javascript/modules/esp32-javascript/configserver.ts#L1)*

___

### `Const` requestHandler

• **requestHandler**: *function[]* = []

*Defined in [esp32-javascript/modules/esp32-javascript/configserver.ts:83](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/esp32-javascript/modules/esp32-javascript/configserver.ts#L83)*

## Functions

###  addSchema

▸ **addSchema**(`additional`: any): *void*

*Defined in [esp32-javascript/modules/esp32-javascript/configserver.ts:79](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/esp32-javascript/modules/esp32-javascript/configserver.ts#L79)*

**Parameters:**

Name | Type |
------ | ------ |
`additional` | any |

**Returns:** *void*

___

###  page

▸ **page**(`res`: [Esp32JsResponse](../interfaces/_esp32_javascript_modules_esp32_javascript_http_.esp32jsresponse.md), `headline`: string, `text`: string | string[], `cb?`: undefined | function): *void*

*Defined in [esp32-javascript/modules/esp32-javascript/configserver.ts:96](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/esp32-javascript/modules/esp32-javascript/configserver.ts#L96)*

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

*Defined in [esp32-javascript/modules/esp32-javascript/configserver.ts:89](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/esp32-javascript/modules/esp32-javascript/configserver.ts#L89)*

**Parameters:**

Name | Type |
------ | ------ |
`res` | [Esp32JsResponse](../interfaces/_esp32_javascript_modules_esp32_javascript_http_.esp32jsresponse.md) |
`location` | string |

**Returns:** *void*

___

###  startConfigServer

▸ **startConfigServer**(): *void*

*Defined in [esp32-javascript/modules/esp32-javascript/configserver.ts:155](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/esp32-javascript/modules/esp32-javascript/configserver.ts#L155)*

**Returns:** *void*

## Object literals

### `Let` schema

### ▪ **schema**: *object*

*Defined in [esp32-javascript/modules/esp32-javascript/configserver.ts:11](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/esp32-javascript/modules/esp32-javascript/configserver.ts#L11)*

▪ **access**: *object*

*Defined in [esp32-javascript/modules/esp32-javascript/configserver.ts:12](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/esp32-javascript/modules/esp32-javascript/configserver.ts#L12)*

* **additionalProperties**: *boolean* = false

* **required**: *string[]* = ["username", "password"]

* **title**: *string* = "Access"

* **type**: *string* = "object"

* **options**: *object*

  * **disable_collapse**: *boolean* = true

  * **disable_properties**: *boolean* = true

* **properties**: *object*

  * **password**: *object*

    * **title**: *string* = "Password"

    * **type**: *string* = "string"

  * **username**: *object*

    * **title**: *string* = "Username"

    * **type**: *string* = "string"

▪ **ota**: *object*

*Defined in [esp32-javascript/modules/esp32-javascript/configserver.ts:52](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/esp32-javascript/modules/esp32-javascript/configserver.ts#L52)*

* **additionalProperties**: *boolean* = false

* **required**: *string[]* = ["url", "offline", "script"]

* **title**: *string* = "Ota"

* **type**: *string* = "object"

* **options**: *object*

  * **disable_collapse**: *boolean* = true

  * **disable_properties**: *boolean* = true

* **properties**: *object*

  * **offline**: *object*

    * **title**: *string* = "Offline"

    * **type**: *string* = "boolean"

  * **script**: *object*

    * **format**: *string* = "textarea"

    * **title**: *string* = "Offline"

    * **type**: *string* = "string"

  * **url**: *object*

    * **title**: *string* = "Firmware url"

    * **type**: *string* = "string"

▪ **wifi**: *object*

*Defined in [esp32-javascript/modules/esp32-javascript/configserver.ts:32](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/esp32-javascript/modules/esp32-javascript/configserver.ts#L32)*

* **additionalProperties**: *boolean* = false

* **required**: *string[]* = ["ssid", "password"]

* **title**: *string* = "WiFi"

* **type**: *string* = "object"

* **options**: *object*

  * **disable_collapse**: *boolean* = true

  * **disable_properties**: *boolean* = true

* **properties**: *object*

  * **password**: *object*

    * **title**: *string* = "Password"

    * **type**: *string* = "string"

  * **ssid**: *object*

    * **title**: *string* = "SSID"

    * **type**: *string* = "string"
