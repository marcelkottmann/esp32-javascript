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

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:284](https://github.com/marcelkottmann/esp32-javascript/blob/79968c6/components/esp32-javascript/modules/esp32-javascript/http.ts#L284)*

___

### `Optional` onerror

• **onerror**? : *undefined | function*

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:292](https://github.com/marcelkottmann/esp32-javascript/blob/79968c6/components/esp32-javascript/modules/esp32-javascript/http.ts#L292)*

___

### `Optional` onload

• **onload**? : *undefined | function*

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:293](https://github.com/marcelkottmann/esp32-javascript/blob/79968c6/components/esp32-javascript/modules/esp32-javascript/http.ts#L293)*

___

### `Private` `Optional` reponseHeaders

• **reponseHeaders**? : *undefined | string*

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:285](https://github.com/marcelkottmann/esp32-javascript/blob/79968c6/components/esp32-javascript/modules/esp32-javascript/http.ts#L285)*

___

### `Private` `Optional` requestHeaders

• **requestHeaders**? : *[StringBuffer](_esp32_javascript_modules_esp32_javascript_stringbuffer_.stringbuffer.md)*

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:286](https://github.com/marcelkottmann/esp32-javascript/blob/79968c6/components/esp32-javascript/modules/esp32-javascript/http.ts#L286)*

___

### `Private` `Optional` responseText

• **responseText**? : *undefined | string*

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:290](https://github.com/marcelkottmann/esp32-javascript/blob/79968c6/components/esp32-javascript/modules/esp32-javascript/http.ts#L290)*

___

### `Private` `Optional` responseURL

• **responseURL**? : *undefined | string*

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:289](https://github.com/marcelkottmann/esp32-javascript/blob/79968c6/components/esp32-javascript/modules/esp32-javascript/http.ts#L289)*

___

### `Private` `Optional` status

• **status**? : *undefined | number*

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:287](https://github.com/marcelkottmann/esp32-javascript/blob/79968c6/components/esp32-javascript/modules/esp32-javascript/http.ts#L287)*

___

### `Private` `Optional` statusText

• **statusText**? : *undefined | string*

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:288](https://github.com/marcelkottmann/esp32-javascript/blob/79968c6/components/esp32-javascript/modules/esp32-javascript/http.ts#L288)*

___

### `Private` `Optional` url

• **url**? : *[AnchorElement](../interfaces/_esp32_javascript_urlparse_.anchorelement.md)*

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:283](https://github.com/marcelkottmann/esp32-javascript/blob/79968c6/components/esp32-javascript/modules/esp32-javascript/http.ts#L283)*

## Methods

###  getAllResponseHeaders

▸ **getAllResponseHeaders**(): *undefined | string*

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:337](https://github.com/marcelkottmann/esp32-javascript/blob/79968c6/components/esp32-javascript/modules/esp32-javascript/http.ts#L337)*

**Returns:** *undefined | string*

___

###  open

▸ **open**(`method`: string, `url`: string): *void*

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:341](https://github.com/marcelkottmann/esp32-javascript/blob/79968c6/components/esp32-javascript/modules/esp32-javascript/http.ts#L341)*

**Parameters:**

Name | Type |
------ | ------ |
`method` | string |
`url` | string |

**Returns:** *void*

___

###  send

▸ **send**(`body`: string): *void*

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:295](https://github.com/marcelkottmann/esp32-javascript/blob/79968c6/components/esp32-javascript/modules/esp32-javascript/http.ts#L295)*

**Parameters:**

Name | Type |
------ | ------ |
`body` | string |

**Returns:** *void*

___

###  setRequestHeader

▸ **setRequestHeader**(`name`: string, `value`: string): *void*

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:369](https://github.com/marcelkottmann/esp32-javascript/blob/79968c6/components/esp32-javascript/modules/esp32-javascript/http.ts#L369)*

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |
`value` | string |

**Returns:** *void*
