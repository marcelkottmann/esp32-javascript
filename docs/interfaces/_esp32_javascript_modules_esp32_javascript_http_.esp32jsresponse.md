[esp32-javascript](../README.md) › ["esp32-javascript/modules/esp32-javascript/http"](../modules/_esp32_javascript_modules_esp32_javascript_http_.md) › [Esp32JsResponse](_esp32_javascript_modules_esp32_javascript_http_.esp32jsresponse.md)

# Interface: Esp32JsResponse

## Hierarchy

* **Esp32JsResponse**

## Index

### Properties

* [end](_esp32_javascript_modules_esp32_javascript_http_.esp32jsresponse.md#end)
* [flush](_esp32_javascript_modules_esp32_javascript_http_.esp32jsresponse.md#flush)
* [headers](_esp32_javascript_modules_esp32_javascript_http_.esp32jsresponse.md#headers)
* [headersWritten](_esp32_javascript_modules_esp32_javascript_http_.esp32jsresponse.md#headerswritten)
* [isEnded](_esp32_javascript_modules_esp32_javascript_http_.esp32jsresponse.md#isended)
* [on](_esp32_javascript_modules_esp32_javascript_http_.esp32jsresponse.md#on)
* [setStatus](_esp32_javascript_modules_esp32_javascript_http_.esp32jsresponse.md#setstatus)
* [status](_esp32_javascript_modules_esp32_javascript_http_.esp32jsresponse.md#status)
* [statusWritten](_esp32_javascript_modules_esp32_javascript_http_.esp32jsresponse.md#statuswritten)
* [write](_esp32_javascript_modules_esp32_javascript_http_.esp32jsresponse.md#write)

## Properties

###  end

• **end**: *function*

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:16](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/esp32-javascript/modules/esp32-javascript/http.ts#L16)*

#### Type declaration:

▸ (`data?`: undefined | string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`data?` | undefined &#124; string |

___

###  flush

• **flush**: *function*

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:13](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/esp32-javascript/modules/esp32-javascript/http.ts#L13)*

#### Type declaration:

▸ (): *void*

___

###  headers

• **headers**: *Headers*

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:21](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/esp32-javascript/modules/esp32-javascript/http.ts#L21)*

___

###  headersWritten

• **headersWritten**: *boolean*

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:20](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/esp32-javascript/modules/esp32-javascript/http.ts#L20)*

___

###  isEnded

• **isEnded**: *boolean*

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:18](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/esp32-javascript/modules/esp32-javascript/http.ts#L18)*

___

###  on

• **on**: *function*

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:12](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/esp32-javascript/modules/esp32-javascript/http.ts#L12)*

#### Type declaration:

▸ (`event`: "end", `cb`: function): *void*

**Parameters:**

▪ **event**: *"end"*

▪ **cb**: *function*

▸ (): *void*

___

###  setStatus

• **setStatus**: *function*

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:14](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/esp32-javascript/modules/esp32-javascript/http.ts#L14)*

#### Type declaration:

▸ (`status`: number, `statusText?`: undefined | string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`status` | number |
`statusText?` | undefined &#124; string |

___

###  status

• **status**: *object*

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:17](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/esp32-javascript/modules/esp32-javascript/http.ts#L17)*

#### Type declaration:

* **status**: *number*

* **statusText**: *string*

___

###  statusWritten

• **statusWritten**: *boolean*

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:19](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/esp32-javascript/modules/esp32-javascript/http.ts#L19)*

___

###  write

• **write**: *function*

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:15](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/esp32-javascript/modules/esp32-javascript/http.ts#L15)*

#### Type declaration:

▸ (`data?`: string | Uint8Array): *void*

**Parameters:**

Name | Type |
------ | ------ |
`data?` | string &#124; Uint8Array |
