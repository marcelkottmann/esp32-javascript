[esp32-javascript](../README.md) › ["socket-events/modules/socket-events/index"](_socket_events_modules_socket_events_index_.md)

# Module: "socket-events/modules/socket-events/index"

## Index

### Classes

* [ActiveSockets](../classes/_socket_events_modules_socket_events_index_.activesockets.md)
* [NumberSet](../classes/_socket_events_modules_socket_events_index_.numberset.md)
* [Socket](../classes/_socket_events_modules_socket_events_index_.socket.md)
* [SocketLookupMap](../classes/_socket_events_modules_socket_events_index_.socketlookupmap.md)

### Interfaces

* [BufferEntry](../interfaces/_socket_events_modules_socket_events_index_.bufferentry.md)
* [Esp32JsSocket](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md)

### Type aliases

* [OnAcceptCB](_socket_events_modules_socket_events_index_.md#onacceptcb)
* [OnCloseCB](_socket_events_modules_socket_events_index_.md#onclosecb)
* [OnConnectCB](_socket_events_modules_socket_events_index_.md#onconnectcb)
* [OnDataCB](_socket_events_modules_socket_events_index_.md#ondatacb)
* [OnErrorCB](_socket_events_modules_socket_events_index_.md#onerrorcb)
* [OnWritableCB](_socket_events_modules_socket_events_index_.md#onwritablecb)

### Variables

* [sockets](_socket_events_modules_socket_events_index_.md#const-sockets)
* [sslClientCtx](_socket_events_modules_socket_events_index_.md#let-sslclientctx)

### Functions

* [afterSuspend](_socket_events_modules_socket_events_index_.md#aftersuspend)
* [beforeSuspend](_socket_events_modules_socket_events_index_.md#beforesuspend)
* [closeSocket](_socket_events_modules_socket_events_index_.md#closesocket)
* [getOrCreateNewSocket](_socket_events_modules_socket_events_index_.md#getorcreatenewsocket)
* [performOnClose](_socket_events_modules_socket_events_index_.md#performonclose)
* [resetSocket](_socket_events_modules_socket_events_index_.md#resetsocket)
* [sockConnect](_socket_events_modules_socket_events_index_.md#sockconnect)
* [sockListen](_socket_events_modules_socket_events_index_.md#socklisten)

## Type aliases

###  OnAcceptCB

Ƭ **OnAcceptCB**: *function*

*Defined in [socket-events/modules/socket-events/index.ts:37](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L37)*

#### Type declaration:

▸ (): *void*

___

###  OnCloseCB

Ƭ **OnCloseCB**: *function*

*Defined in [socket-events/modules/socket-events/index.ts:36](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L36)*

#### Type declaration:

▸ (`sockfd`: number): *void*

**Parameters:**

Name | Type |
------ | ------ |
`sockfd` | number |

___

###  OnConnectCB

Ƭ **OnConnectCB**: *function*

*Defined in [socket-events/modules/socket-events/index.ts:34](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L34)*

#### Type declaration:

▸ (`socket`: [Esp32JsSocket](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md)): *boolean | void*

**Parameters:**

Name | Type |
------ | ------ |
`socket` | [Esp32JsSocket](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md) |

___

###  OnDataCB

Ƭ **OnDataCB**: *function*

*Defined in [socket-events/modules/socket-events/index.ts:29](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L29)*

#### Type declaration:

▸ (`data`: Uint8Array, `sockfd`: number, `length`: number): *void*

**Parameters:**

Name | Type |
------ | ------ |
`data` | Uint8Array |
`sockfd` | number |
`length` | number |

___

###  OnErrorCB

Ƭ **OnErrorCB**: *function*

*Defined in [socket-events/modules/socket-events/index.ts:35](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L35)*

#### Type declaration:

▸ (`sockfd`: number): *void*

**Parameters:**

Name | Type |
------ | ------ |
`sockfd` | number |

___

###  OnWritableCB

Ƭ **OnWritableCB**: *function*

*Defined in [socket-events/modules/socket-events/index.ts:38](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L38)*

#### Type declaration:

▸ (`socket`: [Esp32JsSocket](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md)): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`socket` | [Esp32JsSocket](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md) |

## Variables

### `Const` sockets

• **sockets**: *[ActiveSockets](../classes/_socket_events_modules_socket_events_index_.activesockets.md)‹›* = new ActiveSockets()

*Defined in [socket-events/modules/socket-events/index.ts:156](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L156)*

___

### `Let` sslClientCtx

• **sslClientCtx**: *any*

*Defined in [socket-events/modules/socket-events/index.ts:55](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L55)*

## Functions

###  afterSuspend

▸ **afterSuspend**(`evt`: Esp32JsEventloopEvent, `collected`: function[]): *boolean*

*Defined in [socket-events/modules/socket-events/index.ts:603](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L603)*

**Parameters:**

Name | Type |
------ | ------ |
`evt` | Esp32JsEventloopEvent |
`collected` | function[] |

**Returns:** *boolean*

___

###  beforeSuspend

▸ **beforeSuspend**(): *void*

*Defined in [socket-events/modules/socket-events/index.ts:587](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L587)*

**Returns:** *void*

___

###  closeSocket

▸ **closeSocket**(`socketOrSockfd`: [Esp32JsSocket](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md) | number): *void*

*Defined in [socket-events/modules/socket-events/index.ts:398](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L398)*

Flushes buffered writes, shutdowns SSL (if it is a secure socket),
close the socket, performs the close callback function, removes
socket from {@link module:socket-events.sockets}.

**Parameters:**

Name | Type |
------ | ------ |
`socketOrSockfd` | [Esp32JsSocket](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md) &#124; number |

**Returns:** *void*

___

###  getOrCreateNewSocket

▸ **getOrCreateNewSocket**(): *[Socket](../classes/_socket_events_modules_socket_events_index_.socket.md)‹›*

*Defined in [socket-events/modules/socket-events/index.ts:380](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L380)*

**Returns:** *[Socket](../classes/_socket_events_modules_socket_events_index_.socket.md)‹›*

___

###  performOnClose

▸ **performOnClose**(`socket`: [Esp32JsSocket](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md)): *void*

*Defined in [socket-events/modules/socket-events/index.ts:384](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L384)*

**Parameters:**

Name | Type |
------ | ------ |
`socket` | [Esp32JsSocket](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md) |

**Returns:** *void*

___

###  resetSocket

▸ **resetSocket**(`socket`: [Socket](../classes/_socket_events_modules_socket_events_index_.socket.md)): *void*

*Defined in [socket-events/modules/socket-events/index.ts:576](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L576)*

**Parameters:**

Name | Type |
------ | ------ |
`socket` | [Socket](../classes/_socket_events_modules_socket_events_index_.socket.md) |

**Returns:** *void*

___

###  sockConnect

▸ **sockConnect**(`ssl`: boolean, `host`: string, `port`: string, `onConnect`: [OnConnectCB](_socket_events_modules_socket_events_index_.md#onconnectcb), `onData`: function, `onError`: function, `onClose`: function): *[Esp32JsSocket](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md)*

*Defined in [socket-events/modules/socket-events/index.ts:442](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L442)*

Connects to specified host and port.

**Parameters:**

▪ **ssl**: *boolean*

If we want to connect via SSL.

▪ **host**: *string*

The remote hostname.

▪ **port**: *string*

The remote port.

▪ **onConnect**: *[OnConnectCB](_socket_events_modules_socket_events_index_.md#onconnectcb)*

A callback which gets called on connect event.

▪ **onData**: *function*

A callback which gets called on a data event.

▸ (`data`: Uint8Array, `sockfd`: number, `length`: number): *void*

**Parameters:**

Name | Type |
------ | ------ |
`data` | Uint8Array |
`sockfd` | number |
`length` | number |

▪ **onError**: *function*

A callback which gets called on an error event.

▸ (`sockfd`: number): *void*

**Parameters:**

Name | Type |
------ | ------ |
`sockfd` | number |

▪ **onClose**: *function*

A callback which gets called on a close event.

▸ (): *void*

**Returns:** *[Esp32JsSocket](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md)*

The socket.

___

###  sockListen

▸ **sockListen**(`port`: string | number, `onAccept`: function, `onError`: function, `onClose`: function, `isSSL`: boolean): *[Esp32JsSocket](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md) | null*

*Defined in [socket-events/modules/socket-events/index.ts:503](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L503)*

**Parameters:**

▪ **port**: *string | number*

▪ **onAccept**: *function*

▸ (`socket`: [Esp32JsSocket](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`socket` | [Esp32JsSocket](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md) |

▪ **onError**: *function*

▸ (`sockfd`: number): *void*

**Parameters:**

Name | Type |
------ | ------ |
`sockfd` | number |

▪ **onClose**: *function*

▸ (`sockfd`: number): *void*

**Parameters:**

Name | Type |
------ | ------ |
`sockfd` | number |

▪ **isSSL**: *boolean*

**Returns:** *[Esp32JsSocket](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md) | null*
