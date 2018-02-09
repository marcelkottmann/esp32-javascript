# esp32-javascript

"Lightweight" JS interpreter for ESP32. Provides JS-based eventloop implementation
and native asynchronous network and timer functions.    

## Content
[Getting started](#getting-started)

[API](#api)

[Compatibility](#compatibility)

## Getting started

### Prerequisites
Install [esp-idf](http://esp-idf.readthedocs.io/en/latest/get-started/index.html#setup-toolchain) on your system.

### First install
Clone esp32-javascript inside your esp directory (normally ~/esp):

    cd ~/esp
    git clone https://github.com/pepe79/esp32-javascript.git

Change into ~/esp/esp32-javascript.

    cd ~/esp/esp32-javascript

Connect your ESP32 Dev Board via USB and run

    make flash monitor

Use the keyboard shortcut `AltGr + ]` to leave serial monitor.

Now you have installed the pre-configured boot script.

If this is your first install, your onboard LED should now blink. Blinking signals that 
your Board has started a soft ap with the ssid "esp32". With your mobile or desktop connect 
to the WLAN SSID "esp32" and open http://192.168.4.1/setup

On the Setup page you can configure your WLAN settings and an URL to download your JS script from.

Please note that currently only http (and NO https) is possible.

If you don't own a webserver it's very easy to use cdn.rawgit.com to serve files from a github-respository.

To use rawgit follow this URL scheme:
http://cdn.rawgit.com/[GITHUB-USERNAME]/[GIT-REPOSITORY-NAME]/[MASTER-OR-TAG]/[FILENAME], e.g.
"http://cdn.rawgit.com/pepe79/test-ota/master/esp32.js"

Please not that the script, does not need to have a main function, because its evaluated entirely. 
That means, to print out "Hello World", you only have to include one line in your script on the webserver:

        print('Hello world!');

## Compatibility

Tested with 475ffe78e8c7674a6b9b2dff78774a4a8b66470a of esp-idf and xtensa-esp32-elf-linux64-1.22.0-80-g6c4433a-5.2.0.

## API

### Timer API

#### setTimeout

    function setTimeout(cb, timeout)

Creates a timer and calls the function cb **once** after the configured timeout. Returns a handle.  

#### setInterval

    function setInterval(cb, interval)

Creates a interval timer and call the function cb endlessly in the configured interval time. Returns a handle.  

#### clearInterval

    function clearInterval(handle)

Clears and removes an interval timer by specifing the corresponding handle.

### Socket API

#### sockConnect

    function sockConnect(host, port, onConnect, onData, onError, onClose)

Creates a non-blocking sockets and connects it to host and port. Provides some callback functions:

* onConnect: ()=>void called once upon successful connect.
* onData: (data:string)=>void called several times providing a data string, on each call.
* onError: ()=>void called once upon error.
* onClose: function() called once upon socket close.

#### sockListen

    function sockListen(port, onAccept, onError, onClose)

Creates a non-blocking listening socket, which automatically accepts incoming connections. Upon connection the onAccept call back is called with the connected 
socket as argument.

* port: number The listening port.
* onAccept: (socket: Socket)=>void Called once for every incoming connection.
* onError: ()=>void called once upon error with the listening socket.
* onClose: ()=>void called once upon socket close.

#### Socket

    type Socket =
    {
      sockfd: number;
      onData?: onData(data: string, sockfd: number)=>void;
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

## License
See source files.
