# API

This documentation is currently under construction.

## Modules

<dl>
<dt><a href="#module_wifi-events">wifi-events</a></dt>
<dd></dd>
<dt><a href="#module_socket-events">socket-events</a></dt>
<dd></dd>
</dl>

<a name="module_wifi-events"></a>

## wifi-events

* [wifi-events](#module_wifi-events)
    * _static_
        * [.connectWifi(ssid, password, callback)](#module_wifi-events.connectWifi)
        * [.createSoftAp(ssid, password, callback)](#module_wifi-events.createSoftAp)
        * [.getBssid()](#module_wifi-events.getBssid) ⇒
    * _inner_
        * [~wifiStatusCallback](#module_wifi-events..wifiStatusCallback) : <code>function</code>

<a name="module_wifi-events.connectWifi"></a>

### wifi-events.connectWifi(ssid, password, callback)
Connect to AP with given ssid and password.

**Kind**: static method of [<code>wifi-events</code>](#module_wifi-events)  

| Param | Type | Description |
| --- | --- | --- |
| ssid |  | The ssid of the wifi network. |
| password |  | The password of the wifi network. |
| callback | <code>wifiStatusCallback</code> | A cb which gets the connect status updates. |

<a name="module_wifi-events.createSoftAp"></a>

### wifi-events.createSoftAp(ssid, password, callback)
Create soft AP with given ssid and password.

**Kind**: static method of [<code>wifi-events</code>](#module_wifi-events)  

| Param | Type | Description |
| --- | --- | --- |
| ssid |  | The ssid of the wifi network. |
| password |  | The password of the wifi network. |
| callback | <code>wifiStatusCallback</code> | A cb which gets the connect status updates. |

<a name="module_wifi-events.getBssid"></a>

### wifi-events.getBssid() ⇒
Get the bssid of the current connected wifi AP as formatted as hex string.

**Kind**: static method of [<code>wifi-events</code>](#module_wifi-events)  
**Returns**: The bssid.  
<a name="module_wifi-events..wifiStatusCallback"></a>

### wifi-events~wifiStatusCallback : <code>function</code>
Callback for wifi status.

**Kind**: inner typedef of [<code>wifi-events</code>](#module_wifi-events)  

| Param | Description |
| --- | --- |
| status | The connection status. |

<a name="module_socket-events"></a>

## socket-events

* [socket-events](#module_socket-events)
    * _static_
        * [.sockets](#module_socket-events.sockets) : [<code>Array.&lt;Socket&gt;</code>](#module_socket-events..Socket)
        * [.closeSocket(socketOrSockfd)](#module_socket-events.closeSocket)
        * [.sockConnect(ssl, host, port, onConnect, onData, onError, onClose)](#module_socket-events.sockConnect) ⇒ [<code>Socket</code>](#module_socket-events..Socket)
    * _inner_
        * [~Socket](#module_socket-events..Socket)
            * [.sockfd](#module_socket-events..Socket+sockfd) : <code>number</code>
            * [.onData](#module_socket-events..Socket+onData) : [<code>onDataCB</code>](#module_socket-events..onDataCB)
        * [~onConnectCB](#module_socket-events..onConnectCB) ⇒ <code>boolean</code>
        * [~onDataCB](#module_socket-events..onDataCB) : <code>function</code>
        * [~onErrorCB](#module_socket-events..onErrorCB) : <code>function</code>
        * [~onCloseCB](#module_socket-events..onCloseCB) : <code>function</code>

<a name="module_socket-events.sockets"></a>

### socket-events.sockets : [<code>Array.&lt;Socket&gt;</code>](#module_socket-events..Socket)
An array which holds all active sockets.

**Kind**: static property of [<code>socket-events</code>](#module_socket-events)  
<a name="module_socket-events.closeSocket"></a>

### socket-events.closeSocket(socketOrSockfd)
Flushes buffered writes, shutdowns SSL (if it is a secure socket), 
close the socket, performs the close callback function, removes
socket from [sockets](#module_socket-events.sockets).

**Kind**: static method of [<code>socket-events</code>](#module_socket-events)  

| Param | Type |
| --- | --- |
| socketOrSockfd | [<code>Socket</code>](#module_socket-events..Socket) \| <code>number</code> | 

<a name="module_socket-events.sockConnect"></a>

### socket-events.sockConnect(ssl, host, port, onConnect, onData, onError, onClose) ⇒ [<code>Socket</code>](#module_socket-events..Socket)
Connects to specified host and port.

**Kind**: static method of [<code>socket-events</code>](#module_socket-events)  
**Returns**: [<code>Socket</code>](#module_socket-events..Socket) - The socket.  

| Param | Type | Description |
| --- | --- | --- |
| ssl | <code>boolean</code> | If we want to connect via SSL. |
| host | <code>string</code> | The remote hostname. |
| port | <code>number</code> | The remote port. |
| onConnect | [<code>onConnectCB</code>](#module_socket-events..onConnectCB) | A callback which gets called on connect event. |
| onData | [<code>onDataCB</code>](#module_socket-events..onDataCB) | A callback which gets called on a data event. |
| onError | [<code>onErrorCB</code>](#module_socket-events..onErrorCB) | A callback which gets called on an error event. |
| onClose | [<code>onCloseCB</code>](#module_socket-events..onCloseCB) | A callback which gets called on a close event. |

<a name="module_socket-events..Socket"></a>

### socket-events~Socket
**Kind**: inner class of [<code>socket-events</code>](#module_socket-events)  

* [~Socket](#module_socket-events..Socket)
    * [.sockfd](#module_socket-events..Socket+sockfd) : <code>number</code>
    * [.onData](#module_socket-events..Socket+onData) : [<code>onDataCB</code>](#module_socket-events..onDataCB)

<a name="module_socket-events..Socket+sockfd"></a>

#### socket.sockfd : <code>number</code>
The socket file descriptor.

**Kind**: instance property of [<code>Socket</code>](#module_socket-events..Socket)  
<a name="module_socket-events..Socket+onData"></a>

#### socket.onData : [<code>onDataCB</code>](#module_socket-events..onDataCB)
The onData callback.

**Kind**: instance property of [<code>Socket</code>](#module_socket-events..Socket)  
<a name="module_socket-events..onConnectCB"></a>

### socket-events~onConnectCB ⇒ <code>boolean</code>
Callback for connect event.

**Kind**: inner typedef of [<code>socket-events</code>](#module_socket-events)  
**Returns**: <code>boolean</code> - If the connection attempt should be retried.  

| Param | Type | Description |
| --- | --- | --- |
| socket | [<code>Socket</code>](#module_socket-events..Socket) | The socket. |

<a name="module_socket-events..onDataCB"></a>

### socket-events~onDataCB : <code>function</code>
Callback for data event.

**Kind**: inner typedef of [<code>socket-events</code>](#module_socket-events)  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>string</code> | Data that was received on the socket. |
| sockfd | <code>number</code> | The socket file descriptor. |
| length | <code>number</code> | The length of the data. |

<a name="module_socket-events..onErrorCB"></a>

### socket-events~onErrorCB : <code>function</code>
Callback for error event.

**Kind**: inner typedef of [<code>socket-events</code>](#module_socket-events)  

| Param | Type | Description |
| --- | --- | --- |
| sockfd | <code>number</code> | The socket file descriptor. |

<a name="module_socket-events..onCloseCB"></a>

### socket-events~onCloseCB : <code>function</code>
Callback for close event.

**Kind**: inner typedef of [<code>socket-events</code>](#module_socket-events)  

| Param | Type | Description |
| --- | --- | --- |
| sockfd | <code>number</code> | The socket file descriptor. |

