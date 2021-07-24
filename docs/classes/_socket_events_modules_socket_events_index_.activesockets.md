[esp32-javascript](../README.md) › ["socket-events/modules/socket-events/index"](../modules/_socket_events_modules_socket_events_index_.md) › [ActiveSockets](_socket_events_modules_socket_events_index_.activesockets.md)

# Class: ActiveSockets

## Hierarchy

* **ActiveSockets**

## Index

### Properties

* [activeSockets](_socket_events_modules_socket_events_index_.activesockets.md#private-activesockets)
* [sst_connectedSockets](_socket_events_modules_socket_events_index_.activesockets.md#sst_connectedsockets)
* [sst_connectedWritableSockets](_socket_events_modules_socket_events_index_.activesockets.md#sst_connectedwritablesockets)
* [sst_notConnectedSockets](_socket_events_modules_socket_events_index_.activesockets.md#sst_notconnectedsockets)

### Methods

* [add](_socket_events_modules_socket_events_index_.activesockets.md#add)
* [get](_socket_events_modules_socket_events_index_.activesockets.md#get)
* [maintainSocketStatus](_socket_events_modules_socket_events_index_.activesockets.md#maintainsocketstatus)
* [remove](_socket_events_modules_socket_events_index_.activesockets.md#remove)

## Properties

### `Private` activeSockets

• **activeSockets**: *[SocketLookupMap](_socket_events_modules_socket_events_index_.socketlookupmap.md)‹›* = new SocketLookupMap()

*Defined in [socket-events/modules/socket-events/index.ts:86](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L86)*

___

###  sst_connectedSockets

• **sst_connectedSockets**: *[NumberSet](_socket_events_modules_socket_events_index_.numberset.md)‹›* = new NumberSet()

*Defined in [socket-events/modules/socket-events/index.ts:90](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L90)*

___

###  sst_connectedWritableSockets

• **sst_connectedWritableSockets**: *[NumberSet](_socket_events_modules_socket_events_index_.numberset.md)‹›* = new NumberSet()

*Defined in [socket-events/modules/socket-events/index.ts:91](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L91)*

___

###  sst_notConnectedSockets

• **sst_notConnectedSockets**: *[NumberSet](_socket_events_modules_socket_events_index_.numberset.md)‹›* = new NumberSet()

*Defined in [socket-events/modules/socket-events/index.ts:89](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L89)*

## Methods

###  add

▸ **add**(`item`: [Socket](_socket_events_modules_socket_events_index_.socket.md)): *void*

*Defined in [socket-events/modules/socket-events/index.ts:133](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L133)*

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Socket](_socket_events_modules_socket_events_index_.socket.md) |

**Returns:** *void*

___

###  get

▸ **get**(`sockfd`: number): *[Socket](_socket_events_modules_socket_events_index_.socket.md) | undefined*

*Defined in [socket-events/modules/socket-events/index.ts:152](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L152)*

**Parameters:**

Name | Type |
------ | ------ |
`sockfd` | number |

**Returns:** *[Socket](_socket_events_modules_socket_events_index_.socket.md) | undefined*

___

###  maintainSocketStatus

▸ **maintainSocketStatus**(`sockfd`: number, `isListening`: boolean, `isConnected`: boolean, `isError`: boolean, `onWritable`: [OnWritableCB](../modules/_socket_events_modules_socket_events_index_.md#onwritablecb) | null): *void*

*Defined in [socket-events/modules/socket-events/index.ts:93](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L93)*

**Parameters:**

Name | Type |
------ | ------ |
`sockfd` | number |
`isListening` | boolean |
`isConnected` | boolean |
`isError` | boolean |
`onWritable` | [OnWritableCB](../modules/_socket_events_modules_socket_events_index_.md#onwritablecb) &#124; null |

**Returns:** *void*

___

###  remove

▸ **remove**(`sockfd`: number): *void*

*Defined in [socket-events/modules/socket-events/index.ts:144](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L144)*

**Parameters:**

Name | Type |
------ | ------ |
`sockfd` | number |

**Returns:** *void*
