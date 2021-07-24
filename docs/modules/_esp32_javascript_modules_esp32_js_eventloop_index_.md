[esp32-javascript](../README.md) › ["esp32-javascript/modules/esp32-js-eventloop/index"](_esp32_javascript_modules_esp32_js_eventloop_index_.md)

# Module: "esp32-javascript/modules/esp32-js-eventloop/index"

## Index

### Interfaces

* [Esp32JsTimer](../interfaces/_esp32_javascript_modules_esp32_js_eventloop_index_.esp32jstimer.md)

### Type aliases

* [Esp32JsEventHandler](_esp32_javascript_modules_esp32_js_eventloop_index_.md#esp32jseventhandler)

### Variables

* [afterSuspendHandlers](_esp32_javascript_modules_esp32_js_eventloop_index_.md#const-aftersuspendhandlers)
* [beforeSuspendHandlers](_esp32_javascript_modules_esp32_js_eventloop_index_.md#const-beforesuspendhandlers)
* [handles](_esp32_javascript_modules_esp32_js_eventloop_index_.md#let-handles)
* [intervals](_esp32_javascript_modules_esp32_js_eventloop_index_.md#const-intervals)
* [timers](_esp32_javascript_modules_esp32_js_eventloop_index_.md#const-timers)

### Functions

* [clearInterval](_esp32_javascript_modules_esp32_js_eventloop_index_.md#clearinterval)
* [clearTimeout](_esp32_javascript_modules_esp32_js_eventloop_index_.md#cleartimeout)
* [el_select_next](_esp32_javascript_modules_esp32_js_eventloop_index_.md#el_select_next)
* [installIntervalTimeout](_esp32_javascript_modules_esp32_js_eventloop_index_.md#installintervaltimeout)
* [internalErrorHandler](_esp32_javascript_modules_esp32_js_eventloop_index_.md#internalerrorhandler)
* [setInterval](_esp32_javascript_modules_esp32_js_eventloop_index_.md#setinterval)
* [setTimeout](_esp32_javascript_modules_esp32_js_eventloop_index_.md#settimeout)
* [start](_esp32_javascript_modules_esp32_js_eventloop_index_.md#start)

## Type aliases

###  Esp32JsEventHandler

Ƭ **Esp32JsEventHandler**: *function*

*Defined in [esp32-javascript/modules/esp32-js-eventloop/index.ts:31](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-js-eventloop/index.ts#L31)*

#### Type declaration:

▸ (`event`: Esp32JsEventloopEvent, `collected`: function[]): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`event` | Esp32JsEventloopEvent |
`collected` | function[] |

## Variables

### `Const` afterSuspendHandlers

• **afterSuspendHandlers**: *[Esp32JsEventHandler](_esp32_javascript_modules_esp32_js_eventloop_index_.md#esp32jseventhandler)[]* = []

*Defined in [esp32-javascript/modules/esp32-js-eventloop/index.ts:53](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-js-eventloop/index.ts#L53)*

___

### `Const` beforeSuspendHandlers

• **beforeSuspendHandlers**: *function[]* = []

*Defined in [esp32-javascript/modules/esp32-js-eventloop/index.ts:52](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-js-eventloop/index.ts#L52)*

___

### `Let` handles

• **handles**: *number* = 0

*Defined in [esp32-javascript/modules/esp32-js-eventloop/index.ts:51](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-js-eventloop/index.ts#L51)*

___

### `Const` intervals

• **intervals**: *number[]* = []

*Defined in [esp32-javascript/modules/esp32-js-eventloop/index.ts:50](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-js-eventloop/index.ts#L50)*

___

### `Const` timers

• **timers**: *[Esp32JsTimer](../interfaces/_esp32_javascript_modules_esp32_js_eventloop_index_.esp32jstimer.md)[]* = []

*Defined in [esp32-javascript/modules/esp32-js-eventloop/index.ts:49](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-js-eventloop/index.ts#L49)*

## Functions

###  clearInterval

▸ **clearInterval**(`handle`: number): *void*

*Defined in [esp32-javascript/modules/esp32-js-eventloop/index.ts:77](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-js-eventloop/index.ts#L77)*

**Parameters:**

Name | Type |
------ | ------ |
`handle` | number |

**Returns:** *void*

___

###  clearTimeout

▸ **clearTimeout**(`handle`: number): *void*

*Defined in [esp32-javascript/modules/esp32-js-eventloop/index.ts:66](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-js-eventloop/index.ts#L66)*

**Parameters:**

Name | Type |
------ | ------ |
`handle` | number |

**Returns:** *void*

___

###  el_select_next

▸ **el_select_next**(): *function[]*

*Defined in [esp32-javascript/modules/esp32-js-eventloop/index.ts:104](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-js-eventloop/index.ts#L104)*

**Returns:** *function[]*

___

###  installIntervalTimeout

▸ **installIntervalTimeout**(`handle`: number, `fn`: function, `timeout`: number): *void*

*Defined in [esp32-javascript/modules/esp32-js-eventloop/index.ts:84](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-js-eventloop/index.ts#L84)*

**Parameters:**

▪ **handle**: *number*

▪ **fn**: *function*

▸ (): *void*

▪ **timeout**: *number*

**Returns:** *void*

___

###  internalErrorHandler

▸ **internalErrorHandler**(`error`: Error): *void*

*Defined in [esp32-javascript/modules/esp32-js-eventloop/index.ts:40](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-js-eventloop/index.ts#L40)*

**Parameters:**

Name | Type |
------ | ------ |
`error` | Error |

**Returns:** *void*

___

###  setInterval

▸ **setInterval**(`fn`: function, `timeout`: number): *number*

*Defined in [esp32-javascript/modules/esp32-js-eventloop/index.ts:97](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-js-eventloop/index.ts#L97)*

**Parameters:**

▪ **fn**: *function*

▸ (): *void*

▪ **timeout**: *number*

**Returns:** *number*

___

###  setTimeout

▸ **setTimeout**(`fn`: function, `timeout`: number): *number*

*Defined in [esp32-javascript/modules/esp32-js-eventloop/index.ts:55](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-js-eventloop/index.ts#L55)*

**Parameters:**

▪ **fn**: *function*

▸ (): *void*

▪ **timeout**: *number*

**Returns:** *number*

___

###  start

▸ **start**(): *void*

*Defined in [esp32-javascript/modules/esp32-js-eventloop/index.ts:175](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-js-eventloop/index.ts#L175)*

**Returns:** *void*
