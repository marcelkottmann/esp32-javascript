[esp32-javascript](../README.md) › ["socket-events/modules/socket-events/index"](../modules/_socket_events_modules_socket_events_index_.md) › [SocketLookupMap](_socket_events_modules_socket_events_index_.socketlookupmap.md)

# Class: SocketLookupMap

## Hierarchy

* **SocketLookupMap**

## Index

### Properties

* [map](_socket_events_modules_socket_events_index_.socketlookupmap.md#map)

### Methods

* [add](_socket_events_modules_socket_events_index_.socketlookupmap.md#add)
* [get](_socket_events_modules_socket_events_index_.socketlookupmap.md#get)
* [remove](_socket_events_modules_socket_events_index_.socketlookupmap.md#remove)

## Properties

###  map

• **map**: *object*

*Defined in [socket-events/modules/socket-events/index.ts:73](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L73)*

#### Type declaration:

* \[ **key**: *string*\]: [Socket](_socket_events_modules_socket_events_index_.socket.md)

## Methods

###  add

▸ **add**(`item`: [Socket](_socket_events_modules_socket_events_index_.socket.md)): *void*

*Defined in [socket-events/modules/socket-events/index.ts:74](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L74)*

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Socket](_socket_events_modules_socket_events_index_.socket.md) |

**Returns:** *void*

___

###  get

▸ **get**(`sockfd`: number): *[Socket](_socket_events_modules_socket_events_index_.socket.md) | undefined*

*Defined in [socket-events/modules/socket-events/index.ts:77](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L77)*

**Parameters:**

Name | Type |
------ | ------ |
`sockfd` | number |

**Returns:** *[Socket](_socket_events_modules_socket_events_index_.socket.md) | undefined*

___

###  remove

▸ **remove**(`sockfd`: number): *void*

*Defined in [socket-events/modules/socket-events/index.ts:80](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/socket-events/modules/socket-events/index.ts#L80)*

**Parameters:**

Name | Type |
------ | ------ |
`sockfd` | number |

**Returns:** *void*
