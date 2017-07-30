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
        if (timers.length > 0) {
            timers.sort(function (a, b) {
                return a.timeout - b.timeout;
            });
            var selected = timers.shift();
            delay(selected.timeout - Date.now());
            selected.fn();
        }
    }

    setTimeout(main, 0);
    do {
        el_select_next(timers);
    } while (timers.length > 0);
} catch (error) {
    print('JS ERROR: ' + error);
}