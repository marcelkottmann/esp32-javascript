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
* [setInterval](_esp32_javascript_modules_esp32_js_eventloop_index_.md#setinterval)
* [setTimeout](_esp32_javascript_modules_esp32_js_eventloop_index_.md#settimeout)
* [start](_esp32_javascript_modules_esp32_js_eventloop_index_.md#start)

## Type aliases

###  Esp32JsEventHandler

Ƭ **Esp32JsEventHandler**: *function*

*Defined in [esp32-javascript/modules/esp32-js-eventloop/index.ts:9](https://github.com/marcelkottmann/esp32-javascript/blob/801e1cb/components/esp32-javascript/modules/esp32-js-eventloop/index.ts#L9)*

#### Type declaration:

▸ (`event`: Esp32JsEventloopEvent, `collected`: Function[]): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`event` | Esp32JsEventloopEvent |
`collected` | Function[] |

## Variables

### `Const` afterSuspendHandlers

• **afterSuspendHandlers**: *[Esp32JsEventHandler](_esp32_javascript_modules_esp32_js_eventloop_index_.md#esp32jseventhandler)[]* = []

*Defined in [esp32-javascript/modules/esp32-js-eventloop/index.ts:27](https://github.com/marcelkottmann/esp32-javascript/blob/801e1cb/components/esp32-javascript/modules/esp32-js-eventloop/index.ts#L27)*

___

### `Const` beforeSuspendHandlers

• **beforeSuspendHandlers**: *function[]* = []

*Defined in [esp32-javascript/modules/esp32-js-eventloop/index.ts:26](https://github.com/marcelkottmann/esp32-javascript/blob/801e1cb/components/esp32-javascript/modules/esp32-js-eventloop/index.ts#L26)*

___

### `Let` handles

• **handles**: *number* = 0

*Defined in [esp32-javascript/modules/esp32-js-eventloop/index.ts:25](https://github.com/marcelkottmann/esp32-javascript/blob/801e1cb/components/esp32-javascript/modules/esp32-js-eventloop/index.ts#L25)*

___

### `Const` intervals

• **intervals**: *number[]* = []

*Defined in [esp32-javascript/modules/esp32-js-eventloop/index.ts:24](https://github.com/marcelkottmann/esp32-javascript/blob/801e1cb/components/esp32-javascript/modules/esp32-js-eventloop/index.ts#L24)*

___

### `Const` timers

• **timers**: *[Esp32JsTimer](../interfaces/_esp32_javascript_modules_esp32_js_eventloop_index_.esp32jstimer.md)[]* = []

*Defined in [esp32-javascript/modules/esp32-js-eventloop/index.ts:23](https://github.com/marcelkottmann/esp32-javascript/blob/801e1cb/components/esp32-javascript/modules/esp32-js-eventloop/index.ts#L23)*

## Functions

###  clearInterval

▸ **clearInterval**(`handle`: number): *void*

*Defined in [esp32-javascript/modules/esp32-js-eventloop/index.ts:52](https://github.com/marcelkottmann/esp32-javascript/blob/801e1cb/components/esp32-javascript/modules/esp32-js-eventloop/index.ts#L52)*

**Parameters:**

Name | Type |
------ | ------ |
`handle` | number |

**Returns:** *void*

___

###  clearTimeout

▸ **clearTimeout**(`handle`: number): *void*

*Defined in [esp32-javascript/modules/esp32-js-eventloop/index.ts:41](https://github.com/marcelkottmann/esp32-javascript/blob/801e1cb/components/esp32-javascript/modules/esp32-js-eventloop/index.ts#L41)*

**Parameters:**

Name | Type |
------ | ------ |
`handle` | number |

**Returns:** *void*

___

###  el_select_next

▸ **el_select_next**(): *Function[]*

*Defined in [esp32-javascript/modules/esp32-js-eventloop/index.ts:77](https://github.com/marcelkottmann/esp32-javascript/blob/801e1cb/components/esp32-javascript/modules/esp32-js-eventloop/index.ts#L77)*

**Returns:** *Function[]*

___

###  installIntervalTimeout

▸ **installIntervalTimeout**(`handle`: number, `fn`: Function, `timeout`: number): *void*

*Defined in [esp32-javascript/modules/esp32-js-eventloop/index.ts:60](https://github.com/marcelkottmann/esp32-javascript/blob/801e1cb/components/esp32-javascript/modules/esp32-js-eventloop/index.ts#L60)*

**Parameters:**

Name | Type |
------ | ------ |
`handle` | number |
`fn` | Function |
`timeout` | number |

**Returns:** *void*

___

###  setInterval

▸ **setInterval**(`fn`: Function, `timeout`: number): *number*

*Defined in [esp32-javascript/modules/esp32-js-eventloop/index.ts:70](https://github.com/marcelkottmann/esp32-javascript/blob/801e1cb/components/esp32-javascript/modules/esp32-js-eventloop/index.ts#L70)*

**Parameters:**

Name | Type |
------ | ------ |
`fn` | Function |
`timeout` | number |

**Returns:** *number*

___

###  setTimeout

▸ **setTimeout**(`fn`: Function, `timeout`: number): *number*

*Defined in [esp32-javascript/modules/esp32-js-eventloop/index.ts:30](https://github.com/marcelkottmann/esp32-javascript/blob/801e1cb/components/esp32-javascript/modules/esp32-js-eventloop/index.ts#L30)*

**Parameters:**

Name | Type |
------ | ------ |
`fn` | Function |
`timeout` | number |

**Returns:** *number*

___

###  start

▸ **start**(): *void*

*Defined in [esp32-javascript/modules/esp32-js-eventloop/index.ts:129](https://github.com/marcelkottmann/esp32-javascript/blob/801e1cb/components/esp32-javascript/modules/esp32-js-eventloop/index.ts#L129)*

**Returns:** *void*
