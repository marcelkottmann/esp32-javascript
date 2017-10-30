
freq = 5000;
channel = 0;
resolution = 8;
LED_BUILTIN = 2;
i = 0;

function out() {
    if (i < 15) {
        i = i + 1;
    }
    else if (i < 125) {
        i = i + 10;
    } else {
        i = 0;
    }
    ledcWrite(channel, i);
    setTimeout(out, 100);
}


function main() {
    ledcSetup(channel, freq, resolution);
    ledcAttachPin(LED_BUILTIN, channel);
    out();
}
