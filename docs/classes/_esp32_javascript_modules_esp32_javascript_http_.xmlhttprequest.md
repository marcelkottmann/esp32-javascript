[esp32-javascript](../README.md) › ["esp32-javascript/modules/esp32-javascript/http"](../modules/_esp32_javascript_modules_esp32_javascript_http_.md) › [XMLHttpRequest](_esp32_javascript_modules_esp32_javascript_http_.xmlhttprequest.md)

# Class: XMLHttpRequest

## Hierarchy

* **XMLHttpRequest**

## Index

### Properties

* [method](_esp32_javascript_modules_esp32_javascript_http_.xmlhttprequest.md#private-method)
* [onerror](_esp32_javascript_modules_esp32_javascript_http_.xmlhttprequest.md#optional-onerror)
* [onload](_esp32_javascript_modules_esp32_javascript_http_.xmlhttprequest.md#optional-onload)
* [reponseHeaders](_esp32_javascript_modules_esp32_javascript_http_.xmlhttprequest.md#private-optional-reponseheaders)
* [requestHeaders](_esp32_javascript_modules_esp32_javascript_http_.xmlhttprequest.md#private-optional-requestheaders)
* [responseText](_esp32_javascript_modules_esp32_javascript_http_.xmlhttprequest.md#private-optional-responsetext)
* [responseURL](_esp32_javascript_modules_esp32_javascript_http_.xmlhttprequest.md#private-optional-responseurl)
* [status](_esp32_javascript_modules_esp32_javascript_http_.xmlhttprequest.md#private-optional-status)
* [statusText](_esp32_javascript_modules_esp32_javascript_http_.xmlhttprequest.md#private-optional-statustext)
* [url](_esp32_javascript_modules_esp32_javascript_http_.xmlhttprequest.md#private-optional-url)

### Methods

* [getAllResponseHeaders](_esp32_javascript_modules_esp32_javascript_http_.xmlhttprequest.md#getallresponseheaders)
* [open](_esp32_javascript_modules_esp32_javascript_http_.xmlhttprequest.md#open)
* [send](_esp32_javascript_modules_esp32_javascript_http_.xmlhttprequest.md#send)
* [setRequestHeader](_esp32_javascript_modules_esp32_javascript_http_.xmlhttprequest.md#setrequestheader)

## Properties

### `Private` method

• **method**: *string* = "GET"

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:484](https://github.com/marcelkottmann/esp32-javascript/blob/801e1cb/components/esp32-javascript/modules/esp32-javascript/http.ts#L484)*

___

### `Optional` onerror

• **onerror**? : *undefined | function*

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:492](https://github.com/marcelkottmann/esp32-javascript/blob/801e1cb/components/esp32-javascript/modules/esp32-javascript/http.ts#L492)*

___

### `Optional` onload

• **onload**? : *undefined | function*

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:493](https://github.com/marcelkottmann/esp32-javascript/blob/801e1cb/components/esp32-javascript/modules/esp32-javascript/http.ts#L493)*

___

### `Private` `Optional` reponseHeaders

• **reponseHeaders**? : *undefined | string*

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:485](https://github.com/marcelkottmann/esp32-javascript/blob/801e1cb/components/esp32-javascript/modules/esp32-javascript/http.ts#L485)*

___

### `Private` `Optional` requestHeaders

• **requestHeaders**? : *[StringBuffer](_esp32_javascript_modules_esp32_javascript_stringbuffer_.stringbuffer.md)*

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:486](https://github.com/marcelkottmann/esp32-javascript/blob/801e1cb/components/esp32-javascript/modules/esp32-javascript/http.ts#L486)*

___

### `Private` `Optional` responseText

• **responseText**? : *undefined | string*

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:490](https://github.com/marcelkottmann/esp32-javascript/blob/801e1cb/components/esp32-javascript/modules/esp32-javascript/http.ts#L490)*

___

### `Private` `Optional` responseURL

• **responseURL**? : *undefined | string*

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:489](https://github.com/marcelkottmann/esp32-javascript/blob/801e1cb/components/esp32-javascript/modules/esp32-javascript/http.ts#L489)*

___

### `Private` `Optional` status

• **status**? : *undefined | number*

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:487](https://github.com/marcelkottmann/esp32-javascript/blob/801e1cb/components/esp32-javascript/modules/esp32-javascript/http.ts#L487)*

___

### `Private` `Optional` statusText

• **statusText**? : *undefined | string*

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:488](https://github.com/marcelkottmann/esp32-javascript/blob/801e1cb/components/esp32-javascript/modules/esp32-javascript/http.ts#L488)*

___

### `Private` `Optional` url

• **url**? : *[AnchorElement](../interfaces/_esp32_javascript_urlparse_.anchorelement.md)*

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:483](https://github.com/marcelkottmann/esp32-javascript/blob/801e1cb/components/esp32-javascript/modules/esp32-javascript/http.ts#L483)*

## Methods

###  getAllResponseHeaders

▸ **getAllResponseHeaders**(): *string | undefined*

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:538](https://github.com/marcelkottmann/esp32-javascript/blob/801e1cb/components/esp32-javascript/modules/esp32-javascript/http.ts#L538)*

**Returns:** *string | undefined*

___

###  open

▸ **open**(`method`: string, `url`: string): *void*

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:542](https://github.com/marcelkottmann/esp32-javascript/blob/801e1cb/components/esp32-javascript/modules/esp32-javascript/http.ts#L542)*

**Parameters:**

Name | Type |
------ | ------ |
`method` | string |
`url` | string |

**Returns:** *void*

___

###  send

▸ **send**(`body`: string): *void*

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:495](https://github.com/marcelkottmann/esp32-javascript/blob/801e1cb/components/esp32-javascript/modules/esp32-javascript/http.ts#L495)*

**Parameters:**

Name | Type |
------ | ------ |
`body` | string |

**Returns:** *void*

___

###  setRequestHeader

▸ **setRequestHeader**(`name`: string, `value`: string): *void*

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:569](https://github.com/marcelkottmann/esp32-javascript/blob/801e1cb/components/esp32-javascript/modules/esp32-javascript/http.ts#L569)*

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |
`value` | string |

**Returns:** *void*
