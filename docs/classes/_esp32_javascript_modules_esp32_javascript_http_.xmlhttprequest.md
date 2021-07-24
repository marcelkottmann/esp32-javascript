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
* [responseText](_esp32_javascript_modules_esp32_javascript_http_.xmlhttprequest.md#optional-responsetext)
* [responseURL](_esp32_javascript_modules_esp32_javascript_http_.xmlhttprequest.md#optional-responseurl)
* [status](_esp32_javascript_modules_esp32_javascript_http_.xmlhttprequest.md#optional-status)
* [statusText](_esp32_javascript_modules_esp32_javascript_http_.xmlhttprequest.md#optional-statustext)
* [url](_esp32_javascript_modules_esp32_javascript_http_.xmlhttprequest.md#private-optional-url)

### Methods

* [getAllResponseHeaders](_esp32_javascript_modules_esp32_javascript_http_.xmlhttprequest.md#getallresponseheaders)
* [open](_esp32_javascript_modules_esp32_javascript_http_.xmlhttprequest.md#open)
* [send](_esp32_javascript_modules_esp32_javascript_http_.xmlhttprequest.md#send)
* [setRequestHeader](_esp32_javascript_modules_esp32_javascript_http_.xmlhttprequest.md#setrequestheader)

## Properties

### `Private` method

• **method**: *string* = "GET"

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:567](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/http.ts#L567)*

___

### `Optional` onerror

• **onerror**? : *undefined | function*

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:575](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/http.ts#L575)*

___

### `Optional` onload

• **onload**? : *undefined | function*

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:576](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/http.ts#L576)*

___

### `Private` `Optional` reponseHeaders

• **reponseHeaders**? : *undefined | string*

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:568](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/http.ts#L568)*

___

### `Private` `Optional` requestHeaders

• **requestHeaders**? : *[StringBuffer](_esp32_javascript_modules_esp32_javascript_stringbuffer_.stringbuffer.md)*

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:569](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/http.ts#L569)*

___

### `Optional` responseText

• **responseText**? : *undefined | string*

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:573](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/http.ts#L573)*

___

### `Optional` responseURL

• **responseURL**? : *undefined | string*

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:572](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/http.ts#L572)*

___

### `Optional` status

• **status**? : *undefined | number*

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:570](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/http.ts#L570)*

___

### `Optional` statusText

• **statusText**? : *undefined | string*

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:571](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/http.ts#L571)*

___

### `Private` `Optional` url

• **url**? : *[AnchorElement](../interfaces/_esp32_javascript_urlparse_.anchorelement.md)*

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:566](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/http.ts#L566)*

## Methods

###  getAllResponseHeaders

▸ **getAllResponseHeaders**(): *string | undefined*

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:643](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/http.ts#L643)*

**Returns:** *string | undefined*

___

###  open

▸ **open**(`method`: string, `url`: string): *void*

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:647](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/http.ts#L647)*

**Parameters:**

Name | Type |
------ | ------ |
`method` | string |
`url` | string |

**Returns:** *void*

___

###  send

▸ **send**(`body`: string): *void*

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:578](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/http.ts#L578)*

**Parameters:**

Name | Type |
------ | ------ |
`body` | string |

**Returns:** *void*

___

###  setRequestHeader

▸ **setRequestHeader**(`name`: string, `value`: string): *void*

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:662](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/http.ts#L662)*

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |
`value` | string |

**Returns:** *void*
