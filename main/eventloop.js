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

    function connectWifi(ssid, password, status) {
        wifi = {
            status: status,
        };
        connectWifiInternal(ssid, password);
    }

    function el_select_next() {
        //install all new timers
        for (var t = 0; t < timers.length; t++) {
            var timer = timers[t];
            if (!timer.installed) {
                el_install_timer(timer.timeout - Date.now(), timer.handle);
                timer.installed = true;
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
        } else if (evt.type === 1) { //WIFI EVENT
                return wifi.status.bind(this, evt);
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