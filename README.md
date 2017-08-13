# esp32-javascript

## Getting started

### Modify main.js
Modify main.js to a minimal JS-Script with a main function:

    function main(){
        print('Hello world!');
    }

### Converting main.js and eventloop js
After modifying main.js or eventloop.js you have to re-create the corresponsding hex-files.

    (cat main/main.js && echo -n -e '\0') | xxd -i > main/main.hex
    (cat main/eventloop.js && echo -n -e '\0') | xxd -i > main/eventloop.hex

## Start
Connect your ESP32 and run

    make flash monitor
