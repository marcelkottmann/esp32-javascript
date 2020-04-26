[esp32-javascript](../README.md) › ["esp32-javascript/modules/esp32-javascript/http"](_esp32_javascript_modules_esp32_javascript_http_.md)

# Module: "esp32-javascript/modules/esp32-javascript/http"

## Index

### Classes

* [EventEmitter](../classes/_esp32_javascript_modules_esp32_javascript_http_.eventemitter.md)
* [XMLHttpRequest](../classes/_esp32_javascript_modules_esp32_javascript_http_.xmlhttprequest.md)

### Interfaces

* [Esp32JsRequest](../interfaces/_esp32_javascript_modules_esp32_javascript_http_.esp32jsrequest.md)
* [Esp32JsResponse](../interfaces/_esp32_javascript_modules_esp32_javascript_http_.esp32jsresponse.md)

### Variables

* [closeSocket](_esp32_javascript_modules_esp32_javascript_http_.md#const-closesocket)
* [sockConnect](_esp32_javascript_modules_esp32_javascript_http_.md#const-sockconnect)
* [sockListen](_esp32_javascript_modules_esp32_javascript_http_.md#const-socklisten)
* [socketEvents](_esp32_javascript_modules_esp32_javascript_http_.md#socketevents)

### Functions

* [decodeQueryParam](_esp32_javascript_modules_esp32_javascript_http_.md#decodequeryparam)
* [httpClient](_esp32_javascript_modules_esp32_javascript_http_.md#httpclient)
* [httpServer](_esp32_javascript_modules_esp32_javascript_http_.md#httpserver)
* [parseHeaders](_esp32_javascript_modules_esp32_javascript_http_.md#parseheaders)
* [parseQueryStr](_esp32_javascript_modules_esp32_javascript_http_.md#parsequerystr)

## Variables

### `Const` closeSocket

• **closeSocket**: *[closeSocket](_socket_events_modules_socket_events_index_.md#closesocket)* = socketEvents.closeSocket

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:26](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/esp32-javascript/modules/esp32-javascript/http.ts#L26)*

___

### `Const` sockConnect

• **sockConnect**: *[sockConnect](_socket_events_modules_socket_events_index_.md#sockconnect)* = socketEvents.sockConnect

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:25](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/esp32-javascript/modules/esp32-javascript/http.ts#L25)*

___

### `Const` sockListen

• **sockListen**: *[sockListen](_socket_events_modules_socket_events_index_.md#socklisten)* = socketEvents.sockListen

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:24](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/esp32-javascript/modules/esp32-javascript/http.ts#L24)*

___

###  socketEvents

• **socketEvents**: *["socket-events/modules/socket-events/index"](_socket_events_modules_socket_events_index_.md)*

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:1](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/esp32-javascript/modules/esp32-javascript/http.ts#L1)*

## Functions

###  decodeQueryParam

▸ **decodeQueryParam**(`value`: string): *string*

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:355](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/esp32-javascript/modules/esp32-javascript/http.ts#L355)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | string |

**Returns:** *string*

___

###  httpClient

▸ **httpClient**(`ssl`: boolean, `host`: string, `port`: string, `path`: string, `method`: string, `requestHeaders?`: undefined | string, `body?`: undefined | object, `successCB?`: undefined | function, `errorCB?`: undefined | function, `finishCB?`: undefined | function): *void*

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:372](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/esp32-javascript/modules/esp32-javascript/http.ts#L372)*

**Parameters:**

Name | Type |
------ | ------ |
`ssl` | boolean |
`host` | string |
`port` | string |
`path` | string |
`method` | string |
`requestHeaders?` | undefined &#124; string |
`body?` | undefined &#124; object |
`successCB?` | undefined &#124; function |
`errorCB?` | undefined &#124; function |
`finishCB?` | undefined &#124; function |

**Returns:** *void*

___

###  httpServer

▸ **httpServer**(`port`: string | number, `isSSL`: boolean, `cb`: function): *void*

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:63](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/esp32-javascript/modules/esp32-javascript/http.ts#L63)*

**Parameters:**

▪ **port**: *string | number*

▪ **isSSL**: *boolean*

▪ **cb**: *function*

▸ (`req`: [Esp32JsRequest](../interfaces/_esp32_javascript_modules_esp32_javascript_http_.esp32jsrequest.md), `res`: [Esp32JsResponse](../interfaces/_esp32_javascript_modules_esp32_javascript_http_.esp32jsresponse.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`req` | [Esp32JsRequest](../interfaces/_esp32_javascript_modules_esp32_javascript_http_.esp32jsrequest.md) |
`res` | [Esp32JsResponse](../interfaces/_esp32_javascript_modules_esp32_javascript_http_.esp32jsresponse.md) |

**Returns:** *void*

___

###  parseHeaders

▸ **parseHeaders**(`complete`: [StringBuffer](../classes/_esp32_javascript_modules_esp32_javascript_stringbuffer_.stringbuffer.md), `endOfHeaders`: number): *object*

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:28](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/esp32-javascript/modules/esp32-javascript/http.ts#L28)*

**Parameters:**

Name | Type |
------ | ------ |
`complete` | [StringBuffer](../classes/_esp32_javascript_modules_esp32_javascript_stringbuffer_.stringbuffer.md) |
`endOfHeaders` | number |

**Returns:** *object*

* **headers**: *Headers*

* **statusLine**: *undefined | string*

___

###  parseQueryStr

▸ **parseQueryStr**(`query`: string | null): *object*

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:359](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/esp32-javascript/modules/esp32-javascript/http.ts#L359)*

**Parameters:**

Name | Type |
------ | ------ |
`query` | string &#124; null |

**Returns:** *object*

* \[ **key**: *string*\]: string
