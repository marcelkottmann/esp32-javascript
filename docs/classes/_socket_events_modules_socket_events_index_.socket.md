[esp32-javascript](../README.md) › ["socket-events/modules/socket-events/index"](../modules/_socket_events_modules_socket_events_index_.md) › [Socket](_socket_events_modules_socket_events_index_.socket.md)

# Class: Socket

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
* [readTimeout](_socket_events_modules_socket_events_index_.socket.md#private-readtimeout)
* [readTimeoutHandle](_socket_events_modules_socket_events_index_.socket.md#private-readtimeouthandle)
* [sockfd](_socket_events_modules_socket_events_index_.socket.md#sockfd)
* [ssl](_socket_events_modules_socket_events_index_.socket.md#ssl)
* [textEncoder](_socket_events_modules_socket_events_index_.socket.md#private-textencoder)
* [writebuffer](_socket_events_modules_socket_events_index_.socket.md#writebuffer)

### Methods

* [clearReadTimeoutTimer](_socket_events_modules_socket_events_index_.socket.md#clearreadtimeouttimer)
* [extendReadTimeout](_socket_events_modules_socket_events_index_.socket.md#extendreadtimeout)
* [flush](_socket_events_modules_socket_events_index_.socket.md#flush)
* [setReadTimeout](_socket_events_modules_socket_events_index_.socket.md#setreadtimeout)
* [write](_socket_events_modules_socket_events_index_.socket.md#write)

## Properties

### `Private` dataBuffer

• **dataBuffer**: *Uint8Array‹›* = new Uint8Array(this.defaultBufferSize)

*Defined in [socket-events/modules/socket-events/index.ts:95](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/socket-events/modules/socket-events/index.ts#L95)*

___

### `Private` dataBufferSize

• **dataBufferSize**: *number* = 0

*Defined in [socket-events/modules/socket-events/index.ts:96](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/socket-events/modules/socket-events/index.ts#L96)*

___

### `Private` defaultBufferSize

• **defaultBufferSize**: *number* = 3 * 1024

*Defined in [socket-events/modules/socket-events/index.ts:94](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/socket-events/modules/socket-events/index.ts#L94)*

___

###  flushAlways

• **flushAlways**: *boolean* = true

*Defined in [socket-events/modules/socket-events/index.ts:143](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/socket-events/modules/socket-events/index.ts#L143)*

___

###  isConnected

• **isConnected**: *boolean* = false

*Defined in [socket-events/modules/socket-events/index.ts:139](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/socket-events/modules/socket-events/index.ts#L139)*

___

###  isError

• **isError**: *boolean* = false

*Defined in [socket-events/modules/socket-events/index.ts:140](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/socket-events/modules/socket-events/index.ts#L140)*

___

###  isListening

• **isListening**: *boolean* = false

*Defined in [socket-events/modules/socket-events/index.ts:141](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/socket-events/modules/socket-events/index.ts#L141)*

___

###  onAccept

• **onAccept**: *[OnAcceptCB](../modules/_socket_events_modules_socket_events_index_.md#onacceptcb) | null* = null

*Implementation of [Esp32JsSocket](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md).[onAccept](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md#onaccept)*

*Defined in [socket-events/modules/socket-events/index.ts:133](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/socket-events/modules/socket-events/index.ts#L133)*

The onData callback.

___

###  onClose

• **onClose**: *[OnCloseCB](../modules/_socket_events_modules_socket_events_index_.md#onclosecb) | null* = null

*Implementation of [Esp32JsSocket](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md).[onClose](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md#onclose)*

*Defined in [socket-events/modules/socket-events/index.ts:137](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/socket-events/modules/socket-events/index.ts#L137)*

___

###  onConnect

• **onConnect**: *[OnConnectCB](../modules/_socket_events_modules_socket_events_index_.md#onconnectcb) | null* = null

*Implementation of [Esp32JsSocket](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md).[onConnect](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md#onconnect)*

*Defined in [socket-events/modules/socket-events/index.ts:135](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/socket-events/modules/socket-events/index.ts#L135)*

___

###  onData

• **onData**: *[OnDataCB](../modules/_socket_events_modules_socket_events_index_.md#ondatacb) | null* = null

*Implementation of [Esp32JsSocket](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md).[onData](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md#ondata)*

*Defined in [socket-events/modules/socket-events/index.ts:134](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/socket-events/modules/socket-events/index.ts#L134)*

___

###  onError

• **onError**: *[OnErrorCB](../modules/_socket_events_modules_socket_events_index_.md#onerrorcb) | null* = null

*Implementation of [Esp32JsSocket](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md).[onError](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md#onerror)*

*Defined in [socket-events/modules/socket-events/index.ts:136](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/socket-events/modules/socket-events/index.ts#L136)*

___

###  onWritable

• **onWritable**: *[OnWritableCB](../modules/_socket_events_modules_socket_events_index_.md#onwritablecb) | null* = null

*Implementation of [Esp32JsSocket](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md).[onWritable](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md#onwritable)*

*Defined in [socket-events/modules/socket-events/index.ts:138](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/socket-events/modules/socket-events/index.ts#L138)*

___

### `Private` readTimeout

• **readTimeout**: *number* = -1

*Defined in [socket-events/modules/socket-events/index.ts:99](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/socket-events/modules/socket-events/index.ts#L99)*

___

### `Private` readTimeoutHandle

• **readTimeoutHandle**: *number* = -1

*Defined in [socket-events/modules/socket-events/index.ts:100](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/socket-events/modules/socket-events/index.ts#L100)*

___

###  sockfd

• **sockfd**: *number* = -1

*Implementation of [Esp32JsSocket](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md).[sockfd](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md#sockfd)*

*Defined in [socket-events/modules/socket-events/index.ts:127](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/socket-events/modules/socket-events/index.ts#L127)*

The socket file descriptor.

___

###  ssl

• **ssl**: *any* = null

*Implementation of [Esp32JsSocket](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md).[ssl](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md#ssl)*

*Defined in [socket-events/modules/socket-events/index.ts:142](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/socket-events/modules/socket-events/index.ts#L142)*

___

### `Private` textEncoder

• **textEncoder**: *TextEncoder* = new TextEncoder()

*Defined in [socket-events/modules/socket-events/index.ts:97](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/socket-events/modules/socket-events/index.ts#L97)*

___

###  writebuffer

• **writebuffer**: *[BufferEntry](../interfaces/_socket_events_modules_socket_events_index_.bufferentry.md)[]* = []

*Implementation of [Esp32JsSocket](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md).[writebuffer](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md#writebuffer)*

*Defined in [socket-events/modules/socket-events/index.ts:98](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/socket-events/modules/socket-events/index.ts#L98)*

## Methods

###  clearReadTimeoutTimer

▸ **clearReadTimeoutTimer**(): *void*

*Defined in [socket-events/modules/socket-events/index.ts:107](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/socket-events/modules/socket-events/index.ts#L107)*

**Returns:** *void*

___

###  extendReadTimeout

▸ **extendReadTimeout**(): *void*

*Defined in [socket-events/modules/socket-events/index.ts:113](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/socket-events/modules/socket-events/index.ts#L113)*

**Returns:** *void*

___

###  flush

▸ **flush**(`cb?`: undefined | function): *void*

*Defined in [socket-events/modules/socket-events/index.ts:174](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/socket-events/modules/socket-events/index.ts#L174)*

**Parameters:**

Name | Type |
------ | ------ |
`cb?` | undefined &#124; function |

**Returns:** *void*

___

###  setReadTimeout

▸ **setReadTimeout**(`readTimeout`: number): *void*

*Implementation of [Esp32JsSocket](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md)*

*Defined in [socket-events/modules/socket-events/index.ts:102](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/socket-events/modules/socket-events/index.ts#L102)*

**Parameters:**

Name | Type |
------ | ------ |
`readTimeout` | number |

**Returns:** *void*

___

###  write

▸ **write**(`data`: string | Uint8Array): *void*

*Implementation of [Esp32JsSocket](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md)*

*Defined in [socket-events/modules/socket-events/index.ts:145](https://github.com/marcelkottmann/esp32-javascript/blob/e6e5921/components/socket-events/modules/socket-events/index.ts#L145)*

**Parameters:**

Name | Type |
------ | ------ |
`data` | string &#124; Uint8Array |

**Returns:** *void*
