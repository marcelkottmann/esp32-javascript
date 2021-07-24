[esp32-javascript](../README.md) › ["esp32-javascript/modules/esp32-javascript/chunked"](_esp32_javascript_modules_esp32_javascript_chunked_.md)

# Module: "esp32-javascript/modules/esp32-javascript/chunked"

## Index

### Type aliases

* [ChunkedEncodingConsumer](_esp32_javascript_modules_esp32_javascript_chunked_.md#chunkedencodingconsumer)

### Variables

* [FINISHED](_esp32_javascript_modules_esp32_javascript_chunked_.md#const-finished)
* [READ_CR](_esp32_javascript_modules_esp32_javascript_chunked_.md#const-read_cr)
* [READ_LEN](_esp32_javascript_modules_esp32_javascript_chunked_.md#const-read_len)
* [READ_LF](_esp32_javascript_modules_esp32_javascript_chunked_.md#const-read_lf)
* [READ_PAYL](_esp32_javascript_modules_esp32_javascript_chunked_.md#const-read_payl)

### Functions

* [assertTransferChunked](_esp32_javascript_modules_esp32_javascript_chunked_.md#asserttransferchunked)
* [createChunkedEncodingConsumer](_esp32_javascript_modules_esp32_javascript_chunked_.md#createchunkedencodingconsumer)

## Type aliases

###  ChunkedEncodingConsumer

Ƭ **ChunkedEncodingConsumer**: *function*

*Defined in [esp32-javascript/modules/esp32-javascript/chunked.ts:36](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/chunked.ts#L36)*

#### Type declaration:

▸ (`data`: Uint8Array): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`data` | Uint8Array |

## Variables

### `Const` FINISHED

• **FINISHED**: *4* = 4

*Defined in [esp32-javascript/modules/esp32-javascript/chunked.ts:28](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/chunked.ts#L28)*

___

### `Const` READ_CR

• **READ_CR**: *0* = 0

*Defined in [esp32-javascript/modules/esp32-javascript/chunked.ts:24](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/chunked.ts#L24)*

___

### `Const` READ_LEN

• **READ_LEN**: *2* = 2

*Defined in [esp32-javascript/modules/esp32-javascript/chunked.ts:26](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/chunked.ts#L26)*

___

### `Const` READ_LF

• **READ_LF**: *1* = 1

*Defined in [esp32-javascript/modules/esp32-javascript/chunked.ts:25](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/chunked.ts#L25)*

___

### `Const` READ_PAYL

• **READ_PAYL**: *3* = 3

*Defined in [esp32-javascript/modules/esp32-javascript/chunked.ts:27](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/chunked.ts#L27)*

## Functions

###  assertTransferChunked

▸ **assertTransferChunked**(`test`: boolean, `message`: string): *void*

*Defined in [esp32-javascript/modules/esp32-javascript/chunked.ts:30](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/chunked.ts#L30)*

**Parameters:**

Name | Type |
------ | ------ |
`test` | boolean |
`message` | string |

**Returns:** *void*

___

###  createChunkedEncodingConsumer

▸ **createChunkedEncodingConsumer**(`onData?`: undefined | function): *[ChunkedEncodingConsumer](_esp32_javascript_modules_esp32_javascript_chunked_.md#chunkedencodingconsumer)*

*Defined in [esp32-javascript/modules/esp32-javascript/chunked.ts:38](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/chunked.ts#L38)*

**Parameters:**

Name | Type |
------ | ------ |
`onData?` | undefined &#124; function |

**Returns:** *[ChunkedEncodingConsumer](_esp32_javascript_modules_esp32_javascript_chunked_.md#chunkedencodingconsumer)*
