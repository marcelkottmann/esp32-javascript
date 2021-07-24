[esp32-javascript](../README.md) › ["esp32-javascript/modules/esp32-javascript/configserver"](_esp32_javascript_modules_esp32_javascript_configserver_.md)

# Module: "esp32-javascript/modules/esp32-javascript/configserver"

## Index

### Variables

* [baExceptionPathes](_esp32_javascript_modules_esp32_javascript_configserver_.md#const-baexceptionpathes)
* [configManager](_esp32_javascript_modules_esp32_javascript_configserver_.md#configmanager)
* [errorMessage](_esp32_javascript_modules_esp32_javascript_configserver_.md#let-errormessage)
* [requestHandler](_esp32_javascript_modules_esp32_javascript_configserver_.md#const-requesthandler)
* [successMessage](_esp32_javascript_modules_esp32_javascript_configserver_.md#let-successmessage)

### Functions

* [addSchema](_esp32_javascript_modules_esp32_javascript_configserver_.md#addschema)
* [getLogFileList](_esp32_javascript_modules_esp32_javascript_configserver_.md#getlogfilelist)
* [page](_esp32_javascript_modules_esp32_javascript_configserver_.md#page)
* [redirect](_esp32_javascript_modules_esp32_javascript_configserver_.md#redirect)
* [startConfigServer](_esp32_javascript_modules_esp32_javascript_configserver_.md#startconfigserver)

### Object literals

* [schema](_esp32_javascript_modules_esp32_javascript_configserver_.md#let-schema)
* [upgradeStatus](_esp32_javascript_modules_esp32_javascript_configserver_.md#const-upgradestatus)

## Variables

### `Const` baExceptionPathes

• **baExceptionPathes**: *string[]* = []

*Defined in [esp32-javascript/modules/esp32-javascript/configserver.ts:120](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/configserver.ts#L120)*

___

###  configManager

• **configManager**: *["esp32-javascript/modules/esp32-javascript/config"](_esp32_javascript_modules_esp32_javascript_config_.md)*

*Defined in [esp32-javascript/modules/esp32-javascript/configserver.ts:24](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/configserver.ts#L24)*

___

### `Let` errorMessage

• **errorMessage**: *string* = ""

*Defined in [esp32-javascript/modules/esp32-javascript/configserver.ts:239](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/configserver.ts#L239)*

___

### `Const` requestHandler

• **requestHandler**: *function[]* = []

*Defined in [esp32-javascript/modules/esp32-javascript/configserver.ts:116](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/configserver.ts#L116)*

___

### `Let` successMessage

• **successMessage**: *string* = ""

*Defined in [esp32-javascript/modules/esp32-javascript/configserver.ts:238](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/configserver.ts#L238)*

## Functions

###  addSchema

▸ **addSchema**(`additional`: any): *void*

*Defined in [esp32-javascript/modules/esp32-javascript/configserver.ts:112](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/configserver.ts#L112)*

**Parameters:**

Name | Type |
------ | ------ |
`additional` | any |

**Returns:** *void*

___

###  getLogFileList

▸ **getLogFileList**(): *object[]*

*Defined in [esp32-javascript/modules/esp32-javascript/configserver.ts:209](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/configserver.ts#L209)*

**Returns:** *object[]*

___

###  page

▸ **page**(`res`: [Esp32JsResponse](../interfaces/_esp32_javascript_modules_esp32_javascript_http_.esp32jsresponse.md), `headline`: string, `text`: string | string[], `cb?`: undefined | function, `additionalHeadTags?`: undefined | string): *void*

*Defined in [esp32-javascript/modules/esp32-javascript/configserver.ts:129](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/configserver.ts#L129)*

**Parameters:**

Name | Type |
------ | ------ |
`res` | [Esp32JsResponse](../interfaces/_esp32_javascript_modules_esp32_javascript_http_.esp32jsresponse.md) |
`headline` | string |
`text` | string &#124; string[] |
`cb?` | undefined &#124; function |
`additionalHeadTags?` | undefined &#124; string |

**Returns:** *void*

___

###  redirect

▸ **redirect**(`res`: [Esp32JsResponse](../interfaces/_esp32_javascript_modules_esp32_javascript_http_.esp32jsresponse.md), `location`: string): *void*

*Defined in [esp32-javascript/modules/esp32-javascript/configserver.ts:122](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/configserver.ts#L122)*

**Parameters:**

Name | Type |
------ | ------ |
`res` | [Esp32JsResponse](../interfaces/_esp32_javascript_modules_esp32_javascript_http_.esp32jsresponse.md) |
`location` | string |

**Returns:** *void*

___

###  startConfigServer

▸ **startConfigServer**(): *void*

*Defined in [esp32-javascript/modules/esp32-javascript/configserver.ts:240](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/configserver.ts#L240)*

**Returns:** *void*

## Object literals

### `Let` schema

### ▪ **schema**: *object*

*Defined in [esp32-javascript/modules/esp32-javascript/configserver.ts:40](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/configserver.ts#L40)*

▪ **access**: *object*

*Defined in [esp32-javascript/modules/esp32-javascript/configserver.ts:41](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/configserver.ts#L41)*

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

*Defined in [esp32-javascript/modules/esp32-javascript/configserver.ts:85](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/configserver.ts#L85)*

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

*Defined in [esp32-javascript/modules/esp32-javascript/configserver.ts:61](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/configserver.ts#L61)*

* **additionalProperties**: *boolean* = false

* **required**: *string[]* = ["ssid", "password"]

* **title**: *string* = "WiFi"

* **type**: *string* = "object"

* **options**: *object*

  * **disable_collapse**: *boolean* = true

  * **disable_properties**: *boolean* = true

* **properties**: *object*

  * **bssid**: *object*

    * **title**: *string* = "BSSID"

    * **type**: *string* = "string"

  * **password**: *object*

    * **title**: *string* = "Password"

    * **type**: *string* = "string"

  * **ssid**: *object*

    * **title**: *string* = "SSID"

    * **type**: *string* = "string"

___

### `Const` upgradeStatus

### ▪ **upgradeStatus**: *object*

*Defined in [esp32-javascript/modules/esp32-javascript/configserver.ts:230](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/configserver.ts#L230)*

###  message

• **message**: *string* = ""

*Defined in [esp32-javascript/modules/esp32-javascript/configserver.ts:235](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/configserver.ts#L235)*

###  status

• **status**: *"idle"* = "idle"

*Defined in [esp32-javascript/modules/esp32-javascript/configserver.ts:234](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/configserver.ts#L234)*
