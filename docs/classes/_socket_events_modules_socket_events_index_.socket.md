[esp32-javascript](../README.md) › ["socket-events/modules/socket-events/index"](../modules/_socket_events_modules_socket_events_index_.md) › [Socket](_socket_events_modules_socket_events_index_.socket.md)

# Class: Socket

**`class`** 

## Hierarchy

* **Socket**

## Implements

* [Esp32JsSocket](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md)

## Index

### Properties

* [dataBuffer](_socket_events_modules_socket_events_index_.socket.md#private-databuffer)
* [dataBufferSize](_socket_events_modules_socket_events_index_.socket.md#private-databuffersize)
* [defaultBufferSize](_socket_events_modules_socket_events_index_.socket.md#private-defaultbuffersize)
* [flushAlways](_socket_events_modules_socket_events_index_.socket.md#flushalways)
* [isConnected](_socket_events_modules_socket_events_index_.socket.md#isconnected)
* [isError](_socket_events_modules_socket_events_index_.socket.md#iserror)
* [isListening](_socket_events_modules_socket_events_index_.socket.md#islistening)
* [onAccept](_socket_events_modules_socket_events_index_.socket.md#onaccept)
* [onClose](_socket_events_modules_socket_events_index_.socket.md#onclose)
* [onConnect](_socket_events_modules_socket_events_index_.socket.md#onconnect)
* [onData](_socket_events_modules_socket_events_index_.socket.md#ondata)
* [onError](_socket_events_modules_socket_events_index_.socket.md#onerror)
* [onWritable](_socket_events_modules_socket_events_index_.socket.md#onwritable)
* [sockfd](_socket_events_modules_socket_events_index_.socket.md#sockfd)
* [ssl](_socket_events_modules_socket_events_index_.socket.md#ssl)
* [textEncoder](_socket_events_modules_socket_events_index_.socket.md#private-textencoder)
* [writebuffer](_socket_events_modules_socket_events_index_.socket.md#writebuffer)

### Methods

* [flush](_socket_events_modules_socket_events_index_.socket.md#flush)
* [write](_socket_events_modules_socket_events_index_.socket.md#write)

## Properties

### `Private` dataBuffer

• **dataBuffer**: *Uint8Array‹›* = new Uint8Array(this.defaultBufferSize)

*Defined in [socket-events/modules/socket-events/index.ts:94](https://github.com/marcelkottmann/esp32-javascript/blob/2b53f2e/components/socket-events/modules/socket-events/index.ts#L94)*

___

### `Private` dataBufferSize

• **dataBufferSize**: *number* = 0

*Defined in [socket-events/modules/socket-events/index.ts:95](https://github.com/marcelkottmann/esp32-javascript/blob/2b53f2e/components/socket-events/modules/socket-events/index.ts#L95)*

___

### `Private` defaultBufferSize

• **defaultBufferSize**: *number* = 3 * 1024

*Defined in [socket-events/modules/socket-events/index.ts:93](https://github.com/marcelkottmann/esp32-javascript/blob/2b53f2e/components/socket-events/modules/socket-events/index.ts#L93)*

___

###  flushAlways

• **flushAlways**: *boolean* = true

*Defined in [socket-events/modules/socket-events/index.ts:119](https://github.com/marcelkottmann/esp32-javascript/blob/2b53f2e/components/socket-events/modules/socket-events/index.ts#L119)*

___

###  isConnected

• **isConnected**: *boolean* = false

*Defined in [socket-events/modules/socket-events/index.ts:115](https://github.com/marcelkottmann/esp32-javascript/blob/2b53f2e/components/socket-events/modules/socket-events/index.ts#L115)*

___

###  isError

• **isError**: *boolean* = false

*Defined in [socket-events/modules/socket-events/index.ts:116](https://github.com/marcelkottmann/esp32-javascript/blob/2b53f2e/components/socket-events/modules/socket-events/index.ts#L116)*

___

###  isListening

• **isListening**: *boolean* = false

*Defined in [socket-events/modules/socket-events/index.ts:117](https://github.com/marcelkottmann/esp32-javascript/blob/2b53f2e/components/socket-events/modules/socket-events/index.ts#L117)*

___

###  onAccept

• **onAccept**: *[OnAcceptCB](../modules/_socket_events_modules_socket_events_index_.md#onacceptcb) | null* = null

*Implementation of [Esp32JsSocket](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md).[onAccept](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md#onaccept)*

*Defined in [socket-events/modules/socket-events/index.ts:109](https://github.com/marcelkottmann/esp32-javascript/blob/2b53f2e/components/socket-events/modules/socket-events/index.ts#L109)*

The onData callback.

**`type`** {module:socket-events~onDataCB}

___

###  onClose

• **onClose**: *[OnCloseCB](../modules/_socket_events_modules_socket_events_index_.md#onclosecb) | null* = null

*Implementation of [Esp32JsSocket](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md).[onClose](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md#onclose)*

*Defined in [socket-events/modules/socket-events/index.ts:113](https://github.com/marcelkottmann/esp32-javascript/blob/2b53f2e/components/socket-events/modules/socket-events/index.ts#L113)*

___

###  onConnect

• **onConnect**: *[OnConnectCB](../modules/_socket_events_modules_socket_events_index_.md#onconnectcb) | null* = null

*Implementation of [Esp32JsSocket](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md).[onConnect](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md#onconnect)*

*Defined in [socket-events/modules/socket-events/index.ts:111](https://github.com/marcelkottmann/esp32-javascript/blob/2b53f2e/components/socket-events/modules/socket-events/index.ts#L111)*

___

###  onData

• **onData**: *[OnDataCB](../modules/_socket_events_modules_socket_events_index_.md#ondatacb) | null* = null

*Implementation of [Esp32JsSocket](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md).[onData](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md#ondata)*

*Defined in [socket-events/modules/socket-events/index.ts:110](https://github.com/marcelkottmann/esp32-javascript/blob/2b53f2e/components/socket-events/modules/socket-events/index.ts#L110)*

___

###  onError

• **onError**: *[OnErrorCB](../modules/_socket_events_modules_socket_events_index_.md#onerrorcb) | null* = null

*Implementation of [Esp32JsSocket](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md).[onError](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md#onerror)*

*Defined in [socket-events/modules/socket-events/index.ts:112](https://github.com/marcelkottmann/esp32-javascript/blob/2b53f2e/components/socket-events/modules/socket-events/index.ts#L112)*

___

###  onWritable

• **onWritable**: *[OnWritableCB](../modules/_socket_events_modules_socket_events_index_.md#onwritablecb) | null* = null

*Implementation of [Esp32JsSocket](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md).[onWritable](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md#onwritable)*

*Defined in [socket-events/modules/socket-events/index.ts:114](https://github.com/marcelkottmann/esp32-javascript/blob/2b53f2e/components/socket-events/modules/socket-events/index.ts#L114)*

___

###  sockfd

• **sockfd**: *number* = -1

*Implementation of [Esp32JsSocket](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md).[sockfd](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md#sockfd)*

*Defined in [socket-events/modules/socket-events/index.ts:103](https://github.com/marcelkottmann/esp32-javascript/blob/2b53f2e/components/socket-events/modules/socket-events/index.ts#L103)*

The socket file descriptor.

**`type`** {number}

___

###  ssl

• **ssl**: *any* = null

*Implementation of [Esp32JsSocket](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md).[ssl](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md#ssl)*

*Defined in [socket-events/modules/socket-events/index.ts:118](https://github.com/marcelkottmann/esp32-javascript/blob/2b53f2e/components/socket-events/modules/socket-events/index.ts#L118)*

___

### `Private` textEncoder

• **textEncoder**: *TextEncoder* = new TextEncoder()

*Defined in [socket-events/modules/socket-events/index.ts:96](https://github.com/marcelkottmann/esp32-javascript/blob/2b53f2e/components/socket-events/modules/socket-events/index.ts#L96)*

___

###  writebuffer

• **writebuffer**: *[BufferEntry](../interfaces/_socket_events_modules_socket_events_index_.bufferentry.md)[]* = []

*Implementation of [Esp32JsSocket](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md).[writebuffer](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md#writebuffer)*

*Defined in [socket-events/modules/socket-events/index.ts:97](https://github.com/marcelkottmann/esp32-javascript/blob/2b53f2e/components/socket-events/modules/socket-events/index.ts#L97)*

## Methods

###  flush

▸ **flush**(`cb?`: undefined | function): *void*

*Defined in [socket-events/modules/socket-events/index.ts:150](https://github.com/marcelkottmann/esp32-javascript/blob/2b53f2e/components/socket-events/modules/socket-events/index.ts#L150)*

**Parameters:**

Name | Type |
------ | ------ |
`cb?` | undefined &#124; function |

**Returns:** *void*

___

###  write

▸ **write**(`data`: string | Uint8Array): *void*

*Implementation of [Esp32JsSocket](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md)*

*Defined in [socket-events/modules/socket-events/index.ts:121](https://github.com/marcelkottmann/esp32-javascript/blob/2b53f2e/components/socket-events/modules/socket-events/index.ts#L121)*

**Parameters:**

Name | Type |
------ | ------ |
`data` | string &#124; Uint8Array |

**Returns:** *void*
