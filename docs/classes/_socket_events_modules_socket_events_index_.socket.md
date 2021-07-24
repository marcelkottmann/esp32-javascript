[esp32-javascript](../README.md) › ["socket-events/modules/socket-events/index"](../modules/_socket_events_modules_socket_events_index_.md) › [Socket](_socket_events_modules_socket_events_index_.socket.md)

# Class: Socket

## Hierarchy

* **Socket**

## Implements

* [Esp32JsSocket](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md)

## Index

### Properties

* [_isConnected](_socket_events_modules_socket_events_index_.socket.md#private-_isconnected)
* [_isError](_socket_events_modules_socket_events_index_.socket.md#_iserror)
* [_isListening](_socket_events_modules_socket_events_index_.socket.md#private-_islistening)
* [_onWritable](_socket_events_modules_socket_events_index_.socket.md#private-_onwritable)
* [dataBuffer](_socket_events_modules_socket_events_index_.socket.md#private-databuffer)
* [dataBufferSize](_socket_events_modules_socket_events_index_.socket.md#private-databuffersize)
* [defaultBufferSize](_socket_events_modules_socket_events_index_.socket.md#private-defaultbuffersize)
* [flushAlways](_socket_events_modules_socket_events_index_.socket.md#flushalways)
* [onAccept](_socket_events_modules_socket_events_index_.socket.md#onaccept)
* [onClose](_socket_events_modules_socket_events_index_.socket.md#onclose)
* [onConnect](_socket_events_modules_socket_events_index_.socket.md#onconnect)
* [onData](_socket_events_modules_socket_events_index_.socket.md#ondata)
* [onError](_socket_events_modules_socket_events_index_.socket.md#onerror)
* [readTimeout](_socket_events_modules_socket_events_index_.socket.md#private-readtimeout)
* [readTimeoutHandle](_socket_events_modules_socket_events_index_.socket.md#private-readtimeouthandle)
* [sockfd](_socket_events_modules_socket_events_index_.socket.md#sockfd)
* [ssl](_socket_events_modules_socket_events_index_.socket.md#ssl)
* [textEncoder](_socket_events_modules_socket_events_index_.socket.md#private-textencoder)
* [writebuffer](_socket_events_modules_socket_events_index_.socket.md#writebuffer)

### Accessors

* [isConnected](_socket_events_modules_socket_events_index_.socket.md#isconnected)
* [isError](_socket_events_modules_socket_events_index_.socket.md#iserror)
* [isListening](_socket_events_modules_socket_events_index_.socket.md#islistening)
* [onWritable](_socket_events_modules_socket_events_index_.socket.md#onwritable)

### Methods

* [clearReadTimeoutTimer](_socket_events_modules_socket_events_index_.socket.md#clearreadtimeouttimer)
* [extendReadTimeout](_socket_events_modules_socket_events_index_.socket.md#extendreadtimeout)
* [flush](_socket_events_modules_socket_events_index_.socket.md#flush)
* [maintainSocketStatus](_socket_events_modules_socket_events_index_.socket.md#private-maintainsocketstatus)
* [setReadTimeout](_socket_events_modules_socket_events_index_.socket.md#setreadtimeout)
* [write](_socket_events_modules_socket_events_index_.socket.md#write)

## Properties

### `Private` _isConnected

• **_isConnected**: *boolean* = false

*Defined in [socket-events/modules/socket-events/index.ts:213](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L213)*

___

###  _isError

• **_isError**: *boolean* = false

*Defined in [socket-events/modules/socket-events/index.ts:214](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L214)*

___

### `Private` _isListening

• **_isListening**: *boolean* = false

*Defined in [socket-events/modules/socket-events/index.ts:215](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L215)*

___

### `Private` _onWritable

• **_onWritable**: *[OnWritableCB](../modules/_socket_events_modules_socket_events_index_.md#onwritablecb) | null* = null

*Defined in [socket-events/modules/socket-events/index.ts:212](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L212)*

___

### `Private` dataBuffer

• **dataBuffer**: *Uint8Array‹›* = new Uint8Array(this.defaultBufferSize)

*Defined in [socket-events/modules/socket-events/index.ts:169](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L169)*

___

### `Private` dataBufferSize

• **dataBufferSize**: *number* = 0

*Defined in [socket-events/modules/socket-events/index.ts:170](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L170)*

___

### `Private` defaultBufferSize

• **defaultBufferSize**: *number* = 3 * 1024

*Defined in [socket-events/modules/socket-events/index.ts:168](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L168)*

___

###  flushAlways

• **flushAlways**: *boolean* = true

*Defined in [socket-events/modules/socket-events/index.ts:217](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L217)*

___

###  onAccept

• **onAccept**: *[OnAcceptCB](../modules/_socket_events_modules_socket_events_index_.md#onacceptcb) | null* = null

*Implementation of [Esp32JsSocket](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md).[onAccept](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md#onaccept)*

*Defined in [socket-events/modules/socket-events/index.ts:207](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L207)*

The onData callback.

___

###  onClose

• **onClose**: *[OnCloseCB](../modules/_socket_events_modules_socket_events_index_.md#onclosecb) | null* = null

*Implementation of [Esp32JsSocket](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md).[onClose](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md#onclose)*

*Defined in [socket-events/modules/socket-events/index.ts:211](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L211)*

___

###  onConnect

• **onConnect**: *[OnConnectCB](../modules/_socket_events_modules_socket_events_index_.md#onconnectcb) | null* = null

*Implementation of [Esp32JsSocket](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md).[onConnect](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md#onconnect)*

*Defined in [socket-events/modules/socket-events/index.ts:209](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L209)*

___

###  onData

• **onData**: *[OnDataCB](../modules/_socket_events_modules_socket_events_index_.md#ondatacb) | null* = null

*Implementation of [Esp32JsSocket](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md).[onData](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md#ondata)*

*Defined in [socket-events/modules/socket-events/index.ts:208](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L208)*

___

###  onError

• **onError**: *[OnErrorCB](../modules/_socket_events_modules_socket_events_index_.md#onerrorcb) | null* = null

*Implementation of [Esp32JsSocket](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md).[onError](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md#onerror)*

*Defined in [socket-events/modules/socket-events/index.ts:210](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L210)*

___

### `Private` readTimeout

• **readTimeout**: *number* = -1

*Defined in [socket-events/modules/socket-events/index.ts:173](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L173)*

___

### `Private` readTimeoutHandle

• **readTimeoutHandle**: *number* = -1

*Defined in [socket-events/modules/socket-events/index.ts:174](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L174)*

___

###  sockfd

• **sockfd**: *number* = -1

*Implementation of [Esp32JsSocket](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md).[sockfd](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md#sockfd)*

*Defined in [socket-events/modules/socket-events/index.ts:201](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L201)*

The socket file descriptor.

___

###  ssl

• **ssl**: *any* = null

*Implementation of [Esp32JsSocket](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md).[ssl](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md#ssl)*

*Defined in [socket-events/modules/socket-events/index.ts:216](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L216)*

___

### `Private` textEncoder

• **textEncoder**: *TextEncoder* = new TextEncoder()

*Defined in [socket-events/modules/socket-events/index.ts:171](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L171)*

___

###  writebuffer

• **writebuffer**: *[BufferEntry](../interfaces/_socket_events_modules_socket_events_index_.bufferentry.md)[]* = []

*Implementation of [Esp32JsSocket](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md).[writebuffer](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md#writebuffer)*

*Defined in [socket-events/modules/socket-events/index.ts:172](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L172)*

## Accessors

###  isConnected

• **get isConnected**(): *boolean*

*Defined in [socket-events/modules/socket-events/index.ts:234](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L234)*

**Returns:** *boolean*

• **set isConnected**(`isConnected`: boolean): *void*

*Defined in [socket-events/modules/socket-events/index.ts:229](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L229)*

**Parameters:**

Name | Type |
------ | ------ |
`isConnected` | boolean |

**Returns:** *void*

___

###  isError

• **get isError**(): *boolean*

*Defined in [socket-events/modules/socket-events/index.ts:261](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L261)*

**Returns:** *boolean*

• **set isError**(`isError`: boolean): *void*

*Defined in [socket-events/modules/socket-events/index.ts:256](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L256)*

**Parameters:**

Name | Type |
------ | ------ |
`isError` | boolean |

**Returns:** *void*

___

###  isListening

• **get isListening**(): *boolean*

*Defined in [socket-events/modules/socket-events/index.ts:243](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L243)*

**Returns:** *boolean*

• **set isListening**(`isListening`: boolean): *void*

*Defined in [socket-events/modules/socket-events/index.ts:238](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L238)*

**Parameters:**

Name | Type |
------ | ------ |
`isListening` | boolean |

**Returns:** *void*

___

###  onWritable

• **get onWritable**(): *null | function*

*Defined in [socket-events/modules/socket-events/index.ts:252](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L252)*

**Returns:** *null | function*

• **set onWritable**(`onWritable`: [OnWritableCB](../modules/_socket_events_modules_socket_events_index_.md#onwritablecb) | null): *void*

*Defined in [socket-events/modules/socket-events/index.ts:247](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L247)*

**Parameters:**

Name | Type |
------ | ------ |
`onWritable` | [OnWritableCB](../modules/_socket_events_modules_socket_events_index_.md#onwritablecb) &#124; null |

**Returns:** *void*

## Methods

###  clearReadTimeoutTimer

▸ **clearReadTimeoutTimer**(): *void*

*Defined in [socket-events/modules/socket-events/index.ts:181](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L181)*

**Returns:** *void*

___

###  extendReadTimeout

▸ **extendReadTimeout**(): *void*

*Defined in [socket-events/modules/socket-events/index.ts:187](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L187)*

**Returns:** *void*

___

###  flush

▸ **flush**(`cb?`: undefined | function): *void*

*Defined in [socket-events/modules/socket-events/index.ts:294](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L294)*

**Parameters:**

Name | Type |
------ | ------ |
`cb?` | undefined &#124; function |

**Returns:** *void*

___

### `Private` maintainSocketStatus

▸ **maintainSocketStatus**(): *void*

*Defined in [socket-events/modules/socket-events/index.ts:219](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L219)*

**Returns:** *void*

___

###  setReadTimeout

▸ **setReadTimeout**(`readTimeout`: number): *void*

*Implementation of [Esp32JsSocket](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md)*

*Defined in [socket-events/modules/socket-events/index.ts:176](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L176)*

**Parameters:**

Name | Type |
------ | ------ |
`readTimeout` | number |

**Returns:** *void*

___

###  write

▸ **write**(`data`: string | Uint8Array): *void*

*Implementation of [Esp32JsSocket](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md)*

*Defined in [socket-events/modules/socket-events/index.ts:265](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L265)*

**Parameters:**

Name | Type |
------ | ------ |
`data` | string &#124; Uint8Array |

**Returns:** *void*
