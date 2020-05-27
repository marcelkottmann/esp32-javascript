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
* [write](_socket_events_modules_socket_events_index_.esp32jssocket.md#write)

## Properties

###  onAccept

• **onAccept**: *[OnAcceptCB](../modules/_socket_events_modules_socket_events_index_.md#onacceptcb) | null*

*Defined in [socket-events/modules/socket-events/index.ts:15](https://github.com/marcelkottmann/esp32-javascript/blob/2b53f2e/components/socket-events/modules/socket-events/index.ts#L15)*

___

###  onClose

• **onClose**: *[OnCloseCB](../modules/_socket_events_modules_socket_events_index_.md#onclosecb) | null*

*Defined in [socket-events/modules/socket-events/index.ts:22](https://github.com/marcelkottmann/esp32-javascript/blob/2b53f2e/components/socket-events/modules/socket-events/index.ts#L22)*

___

###  onConnect

• **onConnect**: *[OnConnectCB](../modules/_socket_events_modules_socket_events_index_.md#onconnectcb) | null*

*Defined in [socket-events/modules/socket-events/index.ts:17](https://github.com/marcelkottmann/esp32-javascript/blob/2b53f2e/components/socket-events/modules/socket-events/index.ts#L17)*

___

###  onData

• **onData**: *[OnDataCB](../modules/_socket_events_modules_socket_events_index_.md#ondatacb) | null*

*Defined in [socket-events/modules/socket-events/index.ts:16](https://github.com/marcelkottmann/esp32-javascript/blob/2b53f2e/components/socket-events/modules/socket-events/index.ts#L16)*

___

###  onError

• **onError**: *[OnErrorCB](../modules/_socket_events_modules_socket_events_index_.md#onerrorcb) | null*

*Defined in [socket-events/modules/socket-events/index.ts:18](https://github.com/marcelkottmann/esp32-javascript/blob/2b53f2e/components/socket-events/modules/socket-events/index.ts#L18)*

___

###  onWritable

• **onWritable**: *[OnWritableCB](../modules/_socket_events_modules_socket_events_index_.md#onwritablecb) | null*

*Defined in [socket-events/modules/socket-events/index.ts:19](https://github.com/marcelkottmann/esp32-javascript/blob/2b53f2e/components/socket-events/modules/socket-events/index.ts#L19)*

___

###  sockfd

• **sockfd**: *number*

*Defined in [socket-events/modules/socket-events/index.ts:14](https://github.com/marcelkottmann/esp32-javascript/blob/2b53f2e/components/socket-events/modules/socket-events/index.ts#L14)*

___

###  ssl

• **ssl**: *any*

*Defined in [socket-events/modules/socket-events/index.ts:23](https://github.com/marcelkottmann/esp32-javascript/blob/2b53f2e/components/socket-events/modules/socket-events/index.ts#L23)*

___

###  writebuffer

• **writebuffer**: *[BufferEntry](_socket_events_modules_socket_events_index_.bufferentry.md)[]*

*Defined in [socket-events/modules/socket-events/index.ts:24](https://github.com/marcelkottmann/esp32-javascript/blob/2b53f2e/components/socket-events/modules/socket-events/index.ts#L24)*

## Methods

###  flush

▸ **flush**(`cb?`: undefined | function): *void*

*Defined in [socket-events/modules/socket-events/index.ts:20](https://github.com/marcelkottmann/esp32-javascript/blob/2b53f2e/components/socket-events/modules/socket-events/index.ts#L20)*

**Parameters:**

Name | Type |
------ | ------ |
`cb?` | undefined &#124; function |

**Returns:** *void*

___

###  write

▸ **write**(`data`: string | Uint8Array): *void*

*Defined in [socket-events/modules/socket-events/index.ts:21](https://github.com/marcelkottmann/esp32-javascript/blob/2b53f2e/components/socket-events/modules/socket-events/index.ts#L21)*

**Parameters:**

Name | Type |
------ | ------ |
`data` | string &#124; Uint8Array |

**Returns:** *void*
