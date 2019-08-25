# esp32-javascript

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

    cd ~/esp
    git clone https://github.com/pepe79/esp32-javascript.git

Change into ~/esp/esp32-javascript.

    cd ~/esp/esp32-javascript

Open the Makefile and change settings in the configuration section.

Connect your ESP32 Dev Board via USB and run

    make flash monitor

Use the keyboard shortcut `AltGr + ]` to leave serial monitor.

Now you have installed the pre-configured boot script.

If this is your first install, your onboard LED should blink now. Blinking signals that 
your board has started a soft ap with the ssid "esp32". With your mobile or desktop connect 
to the WLAN SSID "esp32" and open http://192.168.4.1/setup (if you have not changed the default 
credentials your username / password is esp32 / esp32 ).

On the Setup page you can configure your WLAN settings and an URL to download your JS main script from.

Please note that the script, does not need to have a main function, because its evaluated entirely. 
That means, to print out "Hello World", you only have to include one line in your script on the webserver:

        console.log('Hello world!');

## Compatibility

Tested with release/v4.0 (ba0f4f17ed91c3372149beacdfbee6af58e4f634) of esp-idf.

## API
[API documentation](api.md)

## License
See source files.
