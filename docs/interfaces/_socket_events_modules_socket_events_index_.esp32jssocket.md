[esp32-javascript](../README.md) › ["socket-events/modules/socket-events/index"](../modules/_socket_events_modules_socket_events_index_.md) › [Esp32JsSocket](_socket_events_modules_socket_events_index_.esp32jssocket.md)

# Interface: Esp32JsSocket

## Hierarchy

* **Esp32JsSocket**

## Implemented by

* [Socket](../classes/_socket_events_modules_socket_events_index_.socket.md)

## Index

### Properties

* [onAccept](_socket_events_modules_socket_events_index_.esp32jssocket.md#onaccept)
* [onClose](_socket_events_modules_socket_events_index_.esp32jssocket.md#onclose)
* [onConnect](_socket_events_modules_socket_events_index_.esp32jssocket.md#onconnect)
* [onData](_socket_events_modules_socket_events_index_.esp32jssocket.md#ondata)
* [onError](_socket_events_modules_socket_events_index_.esp32jssocket.md#onerror)
* [onWritable](_socket_events_modules_socket_events_index_.esp32jssocket.md#onwritable)
* [sockfd](_socket_events_modules_socket_events_index_.esp32jssocket.md#sockfd)
* [ssl](_socket_events_modules_socket_events_index_.esp32jssocket.md#ssl)
* [writebuffer](_socket_events_modules_socket_events_index_.esp32jssocket.md#writebuffer)

### Methods

* [flush](_socket_events_modules_socket_events_index_.esp32jssocket.md#flush)
* [setReadTimeout](_socket_events_modules_socket_events_index_.esp32jssocket.md#setreadtimeout)
* [write](_socket_events_modules_socket_events_index_.esp32jssocket.md#write)

## Properties

###  onAccept

• **onAccept**: *[OnAcceptCB](../modules/_socket_events_modules_socket_events_index_.md#onacceptcb) | null*

*Defined in [socket-events/modules/socket-events/index.ts:42](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L42)*

___

###  onClose

• **onClose**: *[OnCloseCB](../modules/_socket_events_modules_socket_events_index_.md#onclosecb) | null*

*Defined in [socket-events/modules/socket-events/index.ts:49](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L49)*

___

###  onConnect

• **onConnect**: *[OnConnectCB](../modules/_socket_events_modules_socket_events_index_.md#onconnectcb) | null*

*Defined in [socket-events/modules/socket-events/index.ts:44](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L44)*

___

###  onData

• **onData**: *[OnDataCB](../modules/_socket_events_modules_socket_events_index_.md#ondatacb) | null*

*Defined in [socket-events/modules/socket-events/index.ts:43](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L43)*

___

###  onError

• **onError**: *[OnErrorCB](../modules/_socket_events_modules_socket_events_index_.md#onerrorcb) | null*

*Defined in [socket-events/modules/socket-events/index.ts:45](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L45)*

___

###  onWritable

• **onWritable**: *[OnWritableCB](../modules/_socket_events_modules_socket_events_index_.md#onwritablecb) | null*

*Defined in [socket-events/modules/socket-events/index.ts:46](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L46)*

___

###  sockfd

• **sockfd**: *number*

*Defined in [socket-events/modules/socket-events/index.ts:41](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L41)*

___

###  ssl

• **ssl**: *any*

*Defined in [socket-events/modules/socket-events/index.ts:51](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L51)*

___

###  writebuffer

• **writebuffer**: *[BufferEntry](_socket_events_modules_socket_events_index_.bufferentry.md)[]*

*Defined in [socket-events/modules/socket-events/index.ts:52](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L52)*

## Methods

###  flush

▸ **flush**(`cb?`: undefined | function): *void*

*Defined in [socket-events/modules/socket-events/index.ts:47](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L47)*

**Parameters:**

Name | Type |
------ | ------ |
`cb?` | undefined &#124; function |

**Returns:** *void*

___

###  setReadTimeout

▸ **setReadTimeout**(`readTimeout`: number): *void*

*Defined in [socket-events/modules/socket-events/index.ts:50](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L50)*

**Parameters:**

Name | Type |
------ | ------ |
`readTimeout` | number |

**Returns:** *void*

___

###  write

▸ **write**(`data`: string | Uint8Array): *void*

*Defined in [socket-events/modules/socket-events/index.ts:48](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L48)*

**Parameters:**

Name | Type |
------ | ------ |
`data` | string &#124; Uint8Array |

**Returns:** *void*
