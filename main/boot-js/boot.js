errorhandler = function (error) {
    print('CUSTOM ERROR HANDLER: ' + error + '\"' + error.message + '\" (' + error.lineNumber + ')');
    startSoftApMode();
};

function main() {
    initU8x8();
    writeU8x8('Configuring lora ...');

    var nwskey = [0xF4, 0xBB, 0x65, 0x5F, 0x9A, 0x04, 0x15, 0xFA, 0xBC, 0x10, 0x0C, 0x69, 0x2D, 0xD2, 0x2E, 0x96];
    var appskey = [0x93, 0x14, 0xAA, 0x87, 0x00, 0x4B, 0x06, 0x26, 0xF4, 0x8F, 0x95, 0x7C, 0x3A, 0xDF, 0xB8, 0xB5];
    var devaddr = 0x26011B43;

    lorasetup(nwskey, appskey, devaddr);

    var sendInterval = 60;
    var count = 50;
    var func = function () {
        var message = 'Sending in ' + (sendInterval - count) + ' seconds ...';
        writeU8x8(message);
        if ((sendInterval - count) === 0) {
            writeU8x8('Sending data...');
            var success = lorasend([0xCA, 0xFF, 0xEE]);
            writeU8x8(success ? '...successful.' : '...failed.');
            count = 0;
        }
        count++;
    }
    setInterval(func, 1000);
}