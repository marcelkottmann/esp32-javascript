[esp32-javascript](../README.md) › ["socket-events/modules/socket-events/index"](_socket_events_modules_socket_events_index_.md)

# Module: "socket-events/modules/socket-events/index"

## Index

### Classes

* [Socket](../classes/_socket_events_modules_socket_events_index_.socket.md)

### Interfaces

* [BufferEntry](../interfaces/_socket_events_modules_socket_events_index_.bufferentry.md)
* [Esp32JsSocket](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md)
* [SocketArrayFind](../interfaces/_socket_events_modules_socket_events_index_.socketarrayfind.md)

### Type aliases

* [OnAcceptCB](_socket_events_modules_socket_events_index_.md#onacceptcb)
* [OnCloseCB](_socket_events_modules_socket_events_index_.md#onclosecb)
* [OnConnectCB](_socket_events_modules_socket_events_index_.md#onconnectcb)
* [OnDataCB](_socket_events_modules_socket_events_index_.md#ondatacb)
* [OnErrorCB](_socket_events_modules_socket_events_index_.md#onerrorcb)
* [OnWritableCB](_socket_events_modules_socket_events_index_.md#onwritablecb)

### Variables

* [sockets](_socket_events_modules_socket_events_index_.md#sockets)
* [sslClientCtx](_socket_events_modules_socket_events_index_.md#sslclientctx)

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

*Defined in [socket-events/modules/socket-events/index.ts:10](https://github.com/marcelkottmann/esp32-javascript/blob/2b53f2e/components/socket-events/modules/socket-events/index.ts#L10)*

#### Type declaration:

▸ (): *void*

___

###  OnCloseCB

Ƭ **OnCloseCB**: *function*

*Defined in [socket-events/modules/socket-events/index.ts:9](https://github.com/marcelkottmann/esp32-javascript/blob/2b53f2e/components/socket-events/modules/socket-events/index.ts#L9)*

#### Type declaration:

▸ (`sockfd`: number): *void*

**Parameters:**

Name | Type |
------ | ------ |
`sockfd` | number |

___

###  OnConnectCB

Ƭ **OnConnectCB**: *function*

*Defined in [socket-events/modules/socket-events/index.ts:7](https://github.com/marcelkottmann/esp32-javascript/blob/2b53f2e/components/socket-events/modules/socket-events/index.ts#L7)*

#### Type declaration:

▸ (`socket`: [Esp32JsSocket](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md)): *boolean | void*

**Parameters:**

Name | Type |
------ | ------ |
`socket` | [Esp32JsSocket](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md) |

___

###  OnDataCB

Ƭ **OnDataCB**: *function*

*Defined in [socket-events/modules/socket-events/index.ts:6](https://github.com/marcelkottmann/esp32-javascript/blob/2b53f2e/components/socket-events/modules/socket-events/index.ts#L6)*

#### Type declaration:

▸ (`data`: string, `sockfd`: number, `length`: number): *void*

**Parameters:**

Name | Type |
------ | ------ |
`data` | string |
`sockfd` | number |
`length` | number |

___

###  OnErrorCB

Ƭ **OnErrorCB**: *function*

*Defined in [socket-events/modules/socket-events/index.ts:8](https://github.com/marcelkottmann/esp32-javascript/blob/2b53f2e/components/socket-events/modules/socket-events/index.ts#L8)*

#### Type declaration:

▸ (`sockfd`: number): *void*

**Parameters:**

Name | Type |
------ | ------ |
`sockfd` | number |

___

###  OnWritableCB

Ƭ **OnWritableCB**: *function*

*Defined in [socket-events/modules/socket-events/index.ts:11](https://github.com/marcelkottmann/esp32-javascript/blob/2b53f2e/components/socket-events/modules/socket-events/index.ts#L11)*

#### Type declaration:

▸ (`socket`: [Esp32JsSocket](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md)): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`socket` | [Esp32JsSocket](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md) |

## Variables

###  sockets

• **sockets**: *[Socket](../classes/_socket_events_modules_socket_events_index_.socket.md)[] & [SocketArrayFind](../interfaces/_socket_events_modules_socket_events_index_.socketarrayfind.md)* = [] as any

*Defined in [socket-events/modules/socket-events/index.ts:69](https://github.com/marcelkottmann/esp32-javascript/blob/2b53f2e/components/socket-events/modules/socket-events/index.ts#L69)*

___

###  sslClientCtx

• **sslClientCtx**: *any*

*Defined in [socket-events/modules/socket-events/index.ts:27](https://github.com/marcelkottmann/esp32-javascript/blob/2b53f2e/components/socket-events/modules/socket-events/index.ts#L27)*

## Functions

###  afterSuspend

▸ **afterSuspend**(`evt`: Esp32JsEventloopEvent, `collected`: Function[]): *boolean*

*Defined in [socket-events/modules/socket-events/index.ts:450](https://github.com/marcelkottmann/esp32-javascript/blob/2b53f2e/components/socket-events/modules/socket-events/index.ts#L450)*

**Parameters:**

Name | Type |
------ | ------ |
`evt` | Esp32JsEventloopEvent |
`collected` | Function[] |

**Returns:** *boolean*

___

###  beforeSuspend

▸ **beforeSuspend**(): *void*

*Defined in [socket-events/modules/socket-events/index.ts:416](https://github.com/marcelkottmann/esp32-javascript/blob/2b53f2e/components/socket-events/modules/socket-events/index.ts#L416)*

**Returns:** *void*

___

###  closeSocket

▸ **closeSocket**(`socketOrSockfd`: [Esp32JsSocket](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md) | number): *void*

*Defined in [socket-events/modules/socket-events/index.ts:241](https://github.com/marcelkottmann/esp32-javascript/blob/2b53f2e/components/socket-events/modules/socket-events/index.ts#L241)*

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

*Defined in [socket-events/modules/socket-events/index.ts:223](https://github.com/marcelkottmann/esp32-javascript/blob/2b53f2e/components/socket-events/modules/socket-events/index.ts#L223)*

**Returns:** *[Socket](../classes/_socket_events_modules_socket_events_index_.socket.md)‹›*

___

###  performOnClose

▸ **performOnClose**(`socket`: [Esp32JsSocket](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md)): *void*

*Defined in [socket-events/modules/socket-events/index.ts:227](https://github.com/marcelkottmann/esp32-javascript/blob/2b53f2e/components/socket-events/modules/socket-events/index.ts#L227)*

**Parameters:**

Name | Type |
------ | ------ |
`socket` | [Esp32JsSocket](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md) |

**Returns:** *void*

___

###  resetSocket

▸ **resetSocket**(`socket`: [Socket](../classes/_socket_events_modules_socket_events_index_.socket.md)): *void*

*Defined in [socket-events/modules/socket-events/index.ts:408](https://github.com/marcelkottmann/esp32-javascript/blob/2b53f2e/components/socket-events/modules/socket-events/index.ts#L408)*

**Parameters:**

Name | Type |
------ | ------ |
`socket` | [Socket](../classes/_socket_events_modules_socket_events_index_.socket.md) |

**Returns:** *void*

___

###  sockConnect

▸ **sockConnect**(`ssl`: boolean, `host`: string, `port`: string, `onConnect`: [OnConnectCB](_socket_events_modules_socket_events_index_.md#onconnectcb), `onData`: function, `onError`: function, `onClose`: function): *[Esp32JsSocket](../interfaces/_socket_events_modules_socket_events_index_.esp32jssocket.md)*

*Defined in [socket-events/modules/socket-events/index.ts:283](https://github.com/marcelkottmann/esp32-javascript/blob/2b53f2e/components/socket-events/modules/socket-events/index.ts#L283)*

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

▸ (`data`: string, `sockfd`: number, `length`: number): *void*

**Parameters:**

Name | Type |
------ | ------ |
`data` | string |
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

*Defined in [socket-events/modules/socket-events/index.ts:333](https://github.com/marcelkottmann/esp32-javascript/blob/2b53f2e/components/socket-events/modules/socket-events/index.ts#L333)*

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
