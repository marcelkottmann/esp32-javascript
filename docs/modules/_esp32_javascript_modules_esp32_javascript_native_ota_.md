[esp32-javascript](../README.md) › ["esp32-javascript/modules/esp32-javascript/native-ota"](_esp32_javascript_modules_esp32_javascript_native_ota_.md)

# Module: "esp32-javascript/modules/esp32-javascript/native-ota"

## Index

### Type aliases

* [SubmitErrorFunction](_esp32_javascript_modules_esp32_javascript_native_ota_.md#submiterrorfunction)
* [SubmitFunction](_esp32_javascript_modules_esp32_javascript_native_ota_.md#submitfunction)

### Variables

* [http](_esp32_javascript_modules_esp32_javascript_native_ota_.md#http)

### Functions

* [assertStatusCode](_esp32_javascript_modules_esp32_javascript_native_ota_.md#assertstatuscode)
* [upgrade](_esp32_javascript_modules_esp32_javascript_native_ota_.md#const-upgrade)
* [upgradeApp](_esp32_javascript_modules_esp32_javascript_native_ota_.md#upgradeapp)
* [upgradeModules](_esp32_javascript_modules_esp32_javascript_native_ota_.md#upgrademodules)

## Type aliases

###  SubmitErrorFunction

Ƭ **SubmitErrorFunction**: *function*

*Defined in [esp32-javascript/modules/esp32-javascript/native-ota.ts:28](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/native-ota.ts#L28)*

#### Type declaration:

▸ (`message`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`message` | string |

___

###  SubmitFunction

Ƭ **SubmitFunction**: *function*

*Defined in [esp32-javascript/modules/esp32-javascript/native-ota.ts:27](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/native-ota.ts#L27)*

#### Type declaration:

▸ (`type`: "app" | "modules"): *void*

**Parameters:**

Name | Type |
------ | ------ |
`type` | "app" &#124; "modules" |

## Variables

###  http

• **http**: *["esp32-javascript/modules/esp32-javascript/http"](_esp32_javascript_modules_esp32_javascript_http_.md)*

*Defined in [esp32-javascript/modules/esp32-javascript/native-ota.ts:24](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/native-ota.ts#L24)*

## Functions

###  assertStatusCode

▸ **assertStatusCode**(`status`: number, `url`: string): *(Anonymous function)*

*Defined in [esp32-javascript/modules/esp32-javascript/native-ota.ts:30](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/native-ota.ts#L30)*

**Parameters:**

Name | Type |
------ | ------ |
`status` | number |
`url` | string |

**Returns:** *(Anonymous function)*

___

### `Const` upgrade

▸ **upgrade**(`appImageUrl`: string, `modulesImageUrl`: string, `onError`: function, `onFinish`: function): *void*

*Defined in [esp32-javascript/modules/esp32-javascript/native-ota.ts:135](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/native-ota.ts#L135)*

**Parameters:**

▪ **appImageUrl**: *string*

▪ **modulesImageUrl**: *string*

▪ **onError**: *function*

▸ (`message`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`message` | string |

▪ **onFinish**: *function*

▸ (): *void*

**Returns:** *void*

___

###  upgradeApp

▸ **upgradeApp**(`handle`: number, `appImageUrl`: string, `submitSuccess`: [SubmitFunction](_esp32_javascript_modules_esp32_javascript_native_ota_.md#submitfunction), `submitError`: [SubmitErrorFunction](_esp32_javascript_modules_esp32_javascript_native_ota_.md#submiterrorfunction)): *object*

*Defined in [esp32-javascript/modules/esp32-javascript/native-ota.ts:39](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/native-ota.ts#L39)*

**Parameters:**

Name | Type |
------ | ------ |
`handle` | number |
`appImageUrl` | string |
`submitSuccess` | [SubmitFunction](_esp32_javascript_modules_esp32_javascript_native_ota_.md#submitfunction) |
`submitError` | [SubmitErrorFunction](_esp32_javascript_modules_esp32_javascript_native_ota_.md#submiterrorfunction) |

**Returns:** *object*

* **cancel**(): *function*

  * (): *void*

* **cancelled**: *boolean*

___

###  upgradeModules

▸ **upgradeModules**(`partition`: number, `modulesImageUrl`: string, `submitSuccess`: [SubmitFunction](_esp32_javascript_modules_esp32_javascript_native_ota_.md#submitfunction), `submitError`: [SubmitErrorFunction](_esp32_javascript_modules_esp32_javascript_native_ota_.md#submiterrorfunction)): *object*

*Defined in [esp32-javascript/modules/esp32-javascript/native-ota.ts:90](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/native-ota.ts#L90)*

**Parameters:**

Name | Type |
------ | ------ |
`partition` | number |
`modulesImageUrl` | string |
`submitSuccess` | [SubmitFunction](_esp32_javascript_modules_esp32_javascript_native_ota_.md#submitfunction) |
`submitError` | [SubmitErrorFunction](_esp32_javascript_modules_esp32_javascript_native_ota_.md#submiterrorfunction) |

**Returns:** *object*

* **cancel**(): *function*

  * (): *void*

* **cancelled**: *boolean*
