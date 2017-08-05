try {
    timers = [];
    handles = 0;
    wifi = undefined;

    function setTimeout(fn, timeout) {
        var handle = handles++;
        timers.push({
            timeout: Date.now() + timeout,
            fn: fn,
            handle: handle,
            installed: false
        });
        return handle;
    }

    function connectWifi(ssid, password, success) {
        wifi = {
            success: success,
        };
        connectWifiInternal(ssid, password);
    }

    function el_select_next() {
        if (timers.length > 0) {
            timers.sort(function (a, b) {
                return a.timeout - b.timeout;
            });
            var nextTimer = timers[0];
            if (nextTimer && !nextTimer.installed) {
                el_install_timer(nextTimer.timeout - Date.now(), nextTimer.handle);
                nextTimer.installed = true;
            }
        }

        var evt = el_suspend();

        print('EVENT RECEIVED:');
        print('type:' + evt.type);
        print('status:' + evt.status);

        if (evt.type === 0) { //TIMER EVENT
            for (var timerIdx = 0; timerIdx < timers.length; timerIdx++) {
                if (timers[timerIdx].handle === evt.status) {
                    var nextTimer = timers.splice(timerIdx, 1)[0];
                    return nextTimer.fn;
                }
            }
            throw "UNKNOWN TIMER HANDLE!!!";
        } else if (evt.type === 1) { //WIFI CONNECTED
            return wifi.success;
        } else {
            throw "UNKNOWN eventType " + eventType;
        }
    }

    nextfunc = main;
    do {
        nextfunc();
        nextfunc = el_select_next(timers);
    } while (nextfunc);
} catch (error) {
    print('JS ERROR: ' + error);
}