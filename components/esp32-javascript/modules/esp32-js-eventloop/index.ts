interface Esp32JsTimer {
  handle: number;
  timeout: number;
  // eslint-disable-next-line @typescript-eslint/ban-types
  fn: Function;
  installed: boolean;
}

type Esp32JsEventHandler = (
  event: Esp32JsEventloopEvent,
  // eslint-disable-next-line @typescript-eslint/ban-types
  collected: Function[]
) => boolean;

errorhandler =
  typeof errorhandler === "undefined"
    ? function (error) {
      console.error("Uncaught error:");
      console.error(error.stack || error);
    }
    : errorhandler;

const timers: Esp32JsTimer[] = [];
const intervals: number[] = [];
let handles = 0;
export const beforeSuspendHandlers: (() => void)[] = [];
export const afterSuspendHandlers: Esp32JsEventHandler[] = [];

// eslint-disable-next-line @typescript-eslint/ban-types
function setTimeout(fn: Function, timeout: number) {
  const handle = el_createTimer(timeout);
  timers.push({
    timeout: Date.now() + timeout,
    fn: fn,
    handle: handle,
    installed: true,
  });
  return handle;
}

function clearTimeout(handle: number) {
  for (let i = 0; i < timers.length; i++) {
    if (timers[i].handle === handle) {
      const removed = timers.splice(i, 1);
      if (removed[0].installed) {
        el_removeTimer(handle);
      }
    }
  }
}

function clearInterval(handle: number) {
  const idx = intervals.indexOf(handle);
  if (idx >= 0) {
    intervals.splice(idx, 1);
  }
}

// eslint-disable-next-line @typescript-eslint/ban-types
function installIntervalTimeout(handle: number, fn: Function, timeout: number) {
  setTimeout(function () {
    if (intervals.indexOf(handle) >= 0) {
      fn();
      installIntervalTimeout(handle, fn, timeout);
    }
  }, timeout);
}

// eslint-disable-next-line @typescript-eslint/ban-types
function setInterval(fn: Function, timeout: number) {
  const handle = handles++;
  intervals.push(handle);
  installIntervalTimeout(handle, fn, timeout);
  return handle;
}

function el_select_next() {
  if (beforeSuspendHandlers) {
    beforeSuspendHandlers.forEach(function (h) {
      h();
    });
  }

  const events = el_suspend();

  // eslint-disable-next-line @typescript-eslint/ban-types
  const collected: Function[] = [];
  for (let evid = 0; evid < events.length; evid++) {
    const evt = events[evid];
    console.debug("HANDLE EVENT: " + JSON.stringify(evt));
    if (evt.type === 0) {
      //TIMER EVENT
      let nextTimer = null;
      for (let timerIdx = 0; timerIdx < timers.length; timerIdx++) {
        if (timers[timerIdx].handle === evt.status) {
          nextTimer = timers.splice(timerIdx, 1)[0];
          collected.push(nextTimer.fn);
        }
      }
      if (!nextTimer) {
        //throw Error('UNKNOWN TIMER HANDLE!!!');
        console.warn(
          "UNKNOWN TIMER HANDLE:" +
          JSON.stringify(evt) +
          ";" +
          JSON.stringify(timers)
        );
      }
    } else {
      let eventHandled = false;
      if (afterSuspendHandlers) {
        afterSuspendHandlers.forEach(function (
          handleCustomEvent: Esp32JsEventHandler
        ) {
          if (typeof handleCustomEvent === "function") {
            eventHandled = eventHandled || handleCustomEvent(evt, collected);
          }
        });
      }

      if (!eventHandled) {
        throw Error("UNKNOWN eventType " + JSON.stringify(evt));
      }
    }
  }
  return collected;
}

export function start(): void {
  // eslint-disable-next-line @typescript-eslint/ban-types
  let nextfuncs: Function[] = [main];
  for (; ;) {
    if (Array.isArray(nextfuncs)) {
      nextfuncs.forEach(function (nf) {
        if (typeof nf === "function") {
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
