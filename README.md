# esp32-javascript

![](https://github.com/marcelkottmann/esp32-javascript/workflows/Build/badge.svg)

"Lightweight" JS interpreter for ESP32. Provides JS-based eventloop implementation
and native asynchronous network and timer functions.
Because of the limited memory on ESP32-WROOM modules, the full functionality is currently only realizable on ESP32-WROVER modules, that include additional 4MB of SPIRAM memory.   

## Content
[Getting started](#getting-started)

[API](#api)

[Compatibility](#compatibility)

## Getting started

### Prerequisites
Install [esp-idf](http://esp-idf.readthedocs.io/en/latest/get-started/index.html#setup-toolchain) on your system.

### First install
Clone esp32-javascript inside your esp directory (normally ~/esp):
```shell
    cd ~/esp
    git clone https://github.com/pepe79/esp32-javascript.git
```

Change into ~/esp/esp32-javascript.
```shell
    cd ~/esp/esp32-javascript
```

Maybe you want to change the BOARD_VARIANT in the ./CMakeLists.txt file.

First build the project with
```shell
    idf.py build
```

Connect your ESP32 Dev Board via USB and run
```shell
    idf.py flash monitor
```

Use the keyboard shortcut `AltGr + ]` to leave serial monitor.

Now you have installed the pre-configured boot script.

If this is your first install, your onboard LED should blink now. Blinking signals that your board has started a soft ap with the ssid "esp32". With your mobile or desktop connect to the WLAN SSID "esp32" and open http://192.168.4.1/setup (if you have not changed the default credentials your username / password is esp32 / esp32 ). You can change the default password in `./sdkconfig` by changing the value of `CONFIG_ESP32_JS_BASIC_AUTH_PASSWORD`.  

On the Setup page you can configure your WLAN settings and an URL to download your JS main script from.

Please note that the script, does not need to have a main function, because its evaluated entirely. 
That means, to print out "Hello World", you only have to include one line in your script on the webserver:

```js
    console.log('Hello world!');
```

### C/C++bindings

If you need to create your own C/C++ bindings for your JS code, this are the steps to perform:

1. Create a file named `project.cpp` in the `./main` directory
2. Implement the esp32_javascript_main callback function inside this `project.ccp`:
```c
   #include "esp32-javascript.h"

   extern void esp32_javascript_main(duk_context *ctx)
   {
     // do your own duktape bindings here
   }
```

See [Duktape Programmer's Guide](https://duktape.org/guide.html) for more information regarding Duktape bindings.

If you need more than this, you can create your own esp-idf component below `./components`. Then delegate the `esp32_javascript_main` function to this component.
Additionally you have to set your component name in the top level `./CMakeLists.txt`. Refer to the documentation next to the setting `ESP32_JS_PROJECT_NAME`.
See [ESP Build System](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-guides/build-system.html) for information on how to create a component with the esp-idf build system.

### Clean        

You can clean the project by executing

```shell
    idf.py fullclean
```

### Factory reset        

You can erase the persistent flash memory, which will be equivalent to a factory reset, by executing

```shell
    idf.py erase_flash
```

## Compatibility

Tested with esp-idf (master branch commit hash 2e14149b).

## API
[API documentation](docs/README.md)

### Update docs

Update documentation by executing

```shell
    npm run doc
```

## License
See source files.
