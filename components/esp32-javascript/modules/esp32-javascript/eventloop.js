try {
    errorHandler = typeof errorHandler === 'undefined' ?
        function (error) {
            console.error('Uncaught error:');
            console.error(error.stack || error);
        } :
        errorHandler;

    var timers = [];
    var intervals = [];
    var handles = 0;
    var beforeSuspendHandlers = [];
    var afterSuspendHandlers = [];

    function setTimeout(fn, timeout) {
        var handle = el_createTimer(timeout);
        timers.push({
            timeout: Date.now() + timeout,
            fn: fn,
            handle: handle,
            installed: true
        });
        return handle;
    }

    function clearTimeout(handle) {
        for (var i = 0; i < timers.length; i++) {
            if (timers[i].handle === handle) {
                var removed = timers.splice(i, 1);
                if (removed[0].installed) {
                    el_removeTimer(handle);
                }
            }
        }
    }

    function clearInterval(handle) {
        var idx = intervals.indexOf(handle);
        if (idx >= 0) {
            intervals.splice(idx, 1);
        }
    }

    function installIntervalTimeout(handle, fn, timeout) {
        setTimeout(function () {
            if (intervals.indexOf(handle) >= 0) {
                fn();
                installIntervalTimeout(handle, fn, timeout);
            }
        }, timeout);
    }

    function setInterval(fn, timeout) {
        var handle = handles++;
        intervals.push(handle);
        installIntervalTimeout(handle, fn, timeout);
        return handle;
    }

    function el_select_next() {

        if (beforeSuspendHandlers) {
            beforeSuspendHandlers.forEach(function (h) { h() });
        }

        var events = el_suspend();

        var collected = [];
        for (var evid = 0; evid < events.length; evid++) {
            var evt = events[evid];
            console.debug('HANDLE EVENT: ' + JSON.stringify(evt));
            if (evt.type === 0) { //TIMER EVENT
                var nextTimer = null;
                for (var timerIdx = 0; timerIdx < timers.length; timerIdx++) {
                    if (timers[timerIdx].handle === evt.status) {
                        nextTimer = timers.splice(timerIdx, 1)[0];
                        collected.push(nextTimer.fn);
                    }
                }
                if (!nextTimer) {
                    //throw Error('UNKNOWN TIMER HANDLE!!!');
                    console.warn('UNKNOWN TIMER HANDLE:' + JSON.stringify(evt) + ';' + JSON.stringify(timers));
                }
            } else {
                var eventHandled = false;
                if (afterSuspendHandlers) {
                    afterSuspendHandlers.forEach(function (handleCustomEvent) {
                        if (typeof handleCustomEvent === 'function') {
                            eventHandled |= handleCustomEvent(evt, collected);
                        }
                    });
                }

                if (!eventHandled) {
                    throw Error('UNKNOWN eventType ' + JSON.stringify(evt));
                }
            }
        }
        return collected;
    }

    function start() {
        nextfuncs = [main];
        while (true) {
            if (Array.isArray(nextfuncs)) {
                nextfuncs.forEach(function (nf) {
                    if (typeof nf === 'function') {
                        try {
                            nf();
                        } catch (error) {
                            errorhandler(error);
                        }
                    }
                });
            }
            nextfuncs = el_select_next();
        }
    }

    global.setTimeout = setTimeout;
    global.clearTimeout = clearTimeout;
    global.setInterval = setInterval;
    global.clearInterval = clearInterval;

    module.exports = {
        start: start,
        beforeSuspendHandlers: beforeSuspendHandlers,
        afterSuspendHandlers: afterSuspendHandlers
    }

} catch (error) {
    console.error('Unrecoverable error:');
    console.error(error.stack || error);
}
