try {
    timers = [];
    handles = 0;

    function setTimeout(fn, timeout) {
        var handle = handles++;
        timers.push({
            timeout: Date.now() + timeout,
            fn: fn,
            handle: handle
        });
        return handle;
    }

    function el_select_next(timers) {
        var nextTimer;
        if (timers.length > 0) {
            timers.sort(function (a, b) {
                return a.timeout - b.timeout;
            });
            nextTimer = timers.shift();
        } else {
            nextTimer = undefined;
        }

        if (nextTimer) {
            el_suspend(nextTimer.timeout - Date.now());
            return nextTimer.fn;
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