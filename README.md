# esp32-javascript

"Lightweight" JS interpreter for ESP32. Provides JS-based eventloop implementation
and native asynchronous network and timer functions.    

## Content
[Getting started](#getting-started)
[API](#api)

## Getting started

### Modify main.js
Remove content from main/main.js and add a 
minimal JS-Script with a main function:

    function main(){
        print('Hello world!');
    }

### Start
Connect your ESP32 and run

    make flash monitor


## API

### sockConnect

    function sockConnect(host, port, onConnect, onData, onError, onClose)

Creates a non-blocking sockets and connects it to host and port. Provides some callback functions:

* onConnect: ()=>void called once upon successful connect.
* onData: (data:string)=>void called several times providing a data string, on each call.
* onError: ()=>void called once upon error.
* onClose: function() called once upon socket close.

### sockListen

    function sockListen(port, onAccept, onError, onClose)

Creates a non-blocking listening socket, which automatically accepts incoming connections. Upon connection the onAccept call back is called with the connected 
socket as argument.

* port: number The listening port.
* onAccept: (socket: Socket)=>void Called once for every incoming connection.
* onError: ()=>void called once upon error with the listening socket.
* onClose: ()=>void called once upon socket close.

### Socket

    type Socket =
    {
      sockfd: number;
      onData?: onData(data: string)=>void;
      onError?: onError()=>void;
      onClose?: onClose()=>void;
      isConnected: boolean;
      isError: boolean;
      isListening: boolean;
          
      //only for listening sockets
      onAccept?: onAccept(socket: Socket)=>void;
      
      //only for non-listening sockets
      onConnect?: onConnect()=>void;
    }
