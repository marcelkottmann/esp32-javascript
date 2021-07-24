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

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:43](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/http.ts#L43)*

#### Type declaration:

▸ (`data?`: undefined | string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`data?` | undefined &#124; string |

___

###  flush

• **flush**: *function*

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:40](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/http.ts#L40)*

#### Type declaration:

▸ (): *void*

___

###  headers

• **headers**: *Headers*

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:48](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/http.ts#L48)*

___

###  headersWritten

• **headersWritten**: *boolean*

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:47](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/http.ts#L47)*

___

###  isEnded

• **isEnded**: *boolean*

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:45](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/http.ts#L45)*

___

###  on

• **on**: *function*

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:39](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/http.ts#L39)*

#### Type declaration:

▸ (`event`: "end", `cb`: function): *void*

**Parameters:**

▪ **event**: *"end"*

▪ **cb**: *function*

▸ (): *void*

___

###  setStatus

• **setStatus**: *function*

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:41](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/http.ts#L41)*

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

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:44](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/http.ts#L44)*

#### Type declaration:

* **status**: *number*

* **statusText**: *string*

___

###  statusWritten

• **statusWritten**: *boolean*

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:46](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/http.ts#L46)*

___

###  write

• **write**: *function*

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:42](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/http.ts#L42)*

#### Type declaration:

▸ (`data?`: string | Uint8Array): *void*

**Parameters:**

Name | Type |
------ | ------ |
`data?` | string &#124; Uint8Array |
