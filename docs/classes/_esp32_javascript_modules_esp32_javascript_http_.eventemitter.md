[esp32-javascript](../README.md) › ["esp32-javascript/modules/esp32-javascript/http"](../modules/_esp32_javascript_modules_esp32_javascript_http_.md) › [EventEmitter](_esp32_javascript_modules_esp32_javascript_http_.eventemitter.md)

# Class: EventEmitter

## Hierarchy

* **EventEmitter**

## Index

### Properties

* [listener](_esp32_javascript_modules_esp32_javascript_http_.eventemitter.md#private-listener)

### Methods

* [emit](_esp32_javascript_modules_esp32_javascript_http_.eventemitter.md#emit)
* [on](_esp32_javascript_modules_esp32_javascript_http_.eventemitter.md#on)

## Properties

### `Private` listener

• **listener**: *object*

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:49](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/esp32-javascript/modules/esp32-javascript/http.ts#L49)*

#### Type declaration:

* \[ **event**: *string*\]: function[]

## Methods

###  emit

▸ **emit**(`event`: string): *void*

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:53](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/esp32-javascript/modules/esp32-javascript/http.ts#L53)*

**Parameters:**

Name | Type |
------ | ------ |
`event` | string |

**Returns:** *void*

___

###  on

▸ **on**(`event`: string, `cb`: function): *void*

*Defined in [esp32-javascript/modules/esp32-javascript/http.ts:50](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/esp32-javascript/modules/esp32-javascript/http.ts#L50)*

**Parameters:**

▪ **event**: *string*

▪ **cb**: *function*

▸ (): *void*

**Returns:** *void*
