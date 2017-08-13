# esp32-javascript

"Lightweight" JS interpreter for ESP32.   

## Getting started

### Modify main.js
Remove content form main/main.js and add a 
minimal JS-Script with a main function:

    function main(){
        print('Hello world!');
    }

## Start
Connect your ESP32 and run

    make flash monitor
