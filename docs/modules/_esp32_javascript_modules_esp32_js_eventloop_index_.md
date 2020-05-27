[esp32-javascript](../README.md) › ["esp32-javascript/modules/esp32-js-eventloop/index"](_esp32_javascript_modules_esp32_js_eventloop_index_.md)

# Module: "esp32-javascript/modules/esp32-js-eventloop/index"

## Index

### Interfaces

* [Esp32JsTimer](../interfaces/_esp32_javascript_modules_esp32_js_eventloop_index_.esp32jstimer.md)

### Type aliases

* [Esp32JsEventHandler](_esp32_javascript_modules_esp32_js_eventloop_index_.md#esp32jseventhandler)

### Variables

* [afterSuspendHandlers](_esp32_javascript_modules_esp32_js_eventloop_index_.md#aftersuspendhandlers)
* [beforeSuspendHandlers](_esp32_javascript_modules_esp32_js_eventloop_index_.md#beforesuspendhandlers)
* [handles](_esp32_javascript_modules_esp32_js_eventloop_index_.md#handles)
* [intervals](_esp32_javascript_modules_esp32_js_eventloop_index_.md#intervals)
* [timers](_esp32_javascript_modules_esp32_js_eventloop_index_.md#timers)

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

*Defined in [esp32-javascript/modules/esp32-js-eventloop/index.ts:8](https://github.com/marcelkottmann/esp32-javascript/blob/79968c6/components/esp32-javascript/modules/esp32-js-eventloop/index.ts#L8)*

#### Type declaration:

▸ (`event`: Esp32JsEventloopEvent, `collected`: Function[]): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`event` | Esp32JsEventloopEvent |
`collected` | Function[] |

## Variables

###  afterSuspendHandlers

• **afterSuspendHandlers**: *[Esp32JsEventHandler](_esp32_javascript_modules_esp32_js_eventloop_index_.md#esp32jseventhandler)[]* = []

*Defined in [esp32-javascript/modules/esp32-js-eventloop/index.ts:25](https://github.com/marcelkottmann/esp32-javascript/blob/79968c6/components/esp32-javascript/modules/esp32-js-eventloop/index.ts#L25)*

___

###  beforeSuspendHandlers

• **beforeSuspendHandlers**: *function[]* = []

*Defined in [esp32-javascript/modules/esp32-js-eventloop/index.ts:24](https://github.com/marcelkottmann/esp32-javascript/blob/79968c6/components/esp32-javascript/modules/esp32-js-eventloop/index.ts#L24)*

___

###  handles

• **handles**: *number* = 0

*Defined in [esp32-javascript/modules/esp32-js-eventloop/index.ts:23](https://github.com/marcelkottmann/esp32-javascript/blob/79968c6/components/esp32-javascript/modules/esp32-js-eventloop/index.ts#L23)*

___

###  intervals

• **intervals**: *number[]* = []

*Defined in [esp32-javascript/modules/esp32-js-eventloop/index.ts:22](https://github.com/marcelkottmann/esp32-javascript/blob/79968c6/components/esp32-javascript/modules/esp32-js-eventloop/index.ts#L22)*

___

###  timers

• **timers**: *[Esp32JsTimer](../interfaces/_esp32_javascript_modules_esp32_js_eventloop_index_.esp32jstimer.md)[]* = []

*Defined in [esp32-javascript/modules/esp32-js-eventloop/index.ts:21](https://github.com/marcelkottmann/esp32-javascript/blob/79968c6/components/esp32-javascript/modules/esp32-js-eventloop/index.ts#L21)*

## Functions

###  clearInterval

▸ **clearInterval**(`handle`: number): *void*

*Defined in [esp32-javascript/modules/esp32-js-eventloop/index.ts:49](https://github.com/marcelkottmann/esp32-javascript/blob/79968c6/components/esp32-javascript/modules/esp32-js-eventloop/index.ts#L49)*

**Parameters:**

Name | Type |
------ | ------ |
`handle` | number |

**Returns:** *void*

___

###  clearTimeout

▸ **clearTimeout**(`handle`: number): *void*

*Defined in [esp32-javascript/modules/esp32-js-eventloop/index.ts:38](https://github.com/marcelkottmann/esp32-javascript/blob/79968c6/components/esp32-javascript/modules/esp32-js-eventloop/index.ts#L38)*

**Parameters:**

Name | Type |
------ | ------ |
`handle` | number |

**Returns:** *void*

___

###  el_select_next

▸ **el_select_next**(): *Function[]*

*Defined in [esp32-javascript/modules/esp32-js-eventloop/index.ts:72](https://github.com/marcelkottmann/esp32-javascript/blob/79968c6/components/esp32-javascript/modules/esp32-js-eventloop/index.ts#L72)*

**Returns:** *Function[]*

___

###  installIntervalTimeout

▸ **installIntervalTimeout**(`handle`: number, `fn`: Function, `timeout`: number): *void*

*Defined in [esp32-javascript/modules/esp32-js-eventloop/index.ts:56](https://github.com/marcelkottmann/esp32-javascript/blob/79968c6/components/esp32-javascript/modules/esp32-js-eventloop/index.ts#L56)*

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

*Defined in [esp32-javascript/modules/esp32-js-eventloop/index.ts:65](https://github.com/marcelkottmann/esp32-javascript/blob/79968c6/components/esp32-javascript/modules/esp32-js-eventloop/index.ts#L65)*

**Parameters:**

Name | Type |
------ | ------ |
`fn` | Function |
`timeout` | number |

**Returns:** *number*

___

###  setTimeout

▸ **setTimeout**(`fn`: Function, `timeout`: number): *number*

*Defined in [esp32-javascript/modules/esp32-js-eventloop/index.ts:27](https://github.com/marcelkottmann/esp32-javascript/blob/79968c6/components/esp32-javascript/modules/esp32-js-eventloop/index.ts#L27)*

**Parameters:**

Name | Type |
------ | ------ |
`fn` | Function |
`timeout` | number |

**Returns:** *number*

___

###  start

▸ **start**(): *void*

*Defined in [esp32-javascript/modules/esp32-js-eventloop/index.ts:123](https://github.com/marcelkottmann/esp32-javascript/blob/79968c6/components/esp32-javascript/modules/esp32-js-eventloop/index.ts#L123)*

**Returns:** *void*
