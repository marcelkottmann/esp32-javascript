import wifi = require("wifi-events");
import configServer = require("./configserver");
import { config, saveConfig } from "./config";

errorhandler = function (error) {
  console.error(error.stack || error);
  startSoftApMode();
};

if (typeof KEY_BUILTIN !== "undefined") {
  pinMode(KEY_BUILTIN, INPUT);
}
if (typeof LED_BUILTIN !== "undefined") {
  pinMode(LED_BUILTIN, OUTPUT);
}

let configServerStarted = false;
let programLoaded = false;

function blink() {
  let blinkState = 0;
  return setInterval(function () {
    digitalWrite(LED_BUILTIN, blinkState);
    blinkState = blinkState === 0 ? 1 : 0;
  }, 333);
}

let bootTime: Date = new Date();

function setBootTime(date: Date) {
  bootTime = date;
}

export function getBootTime(): Date {
  return bootTime;
}

function startSoftApMode() {
  console.info("Starting soft ap mode.");
  const blinkId = blink();
  console.debug("Blinking initialized.");
  wifi.createSoftAp("esp32", "", function (evt) {
    console.debug("WiFi Event received: " + evt);
    if (evt.status === 1) {
      console.info("SoftAP: Connected");
      if (!configServerStarted) {
        configServer.startConfigServer();
        configServerStarted = true;
      }
      const timeout = 5;
      //stop soft ap wifi after <timeout> minutes
      setTimeout(function () {
        console.info("Stopping soft ap now after " + timeout + " minutes.");
        stopWifi();
        clearInterval(blinkId);
        // start normal wifi connection attempts
        connectToWifi();
      }, timeout * 60 * 1000);
    } else if (evt.status === 0) {
      console.info("SoftAP: Disconnected");
    } else {
      console.debug("Unhandled wifi soft ap status " + evt.status);
    }
  });
}

function parseDate(d: string) {
  const day = parseInt(d.substr(5, 2));
  const month = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ].indexOf(d.substr(8, 3));
  const year = parseInt(d.substr(12, 4));
  const hour = parseInt(d.substr(17, 2));
  const minute = parseInt(d.substr(20, 2));
  const second = parseInt(d.substr(23, 2));

  const utc = Date.UTC(year, month, day, hour, minute, second, 0);
  if (isNaN(utc)) {
    throw Error("Invalid date");
  }

  return new Date(utc);
}

function evalScript(content: string, headers?: Headers) {
  console.debug("==> Start evaluation:");
  digitalWrite(LED_BUILTIN, 0);
  eval(content); // this uses headers implicitly (TODO CHECK)
}

function loadOfflineScript() {
  const programLoadedPrev = programLoaded;
  programLoaded = true;
  if (!programLoadedPrev && config?.ota?.script) {
    console.log("An offline script was found. Trying to execute...");
    evalScript(config.ota.script);
  }
}

function connectToWifi() {
  digitalWrite(LED_BUILTIN, 1);

  if (!config?.wifi?.ssid || !config?.wifi?.password) {
    console.error(
      "No ssid and/or password was configured. Cannot connect to wifi: "
    );
    return;
  }

  let retries = 0;
  wifi.connectWifi(config.wifi.ssid, config.wifi.password, function (evt) {
    if (evt.status === 0) {
      console.info("WIFI: DISCONNECTED");
      if (!configServerStarted) {
        retries++;
      }
      if (!configServerStarted && retries === 5) {
        console.warn("Maximum retries exceeded to connect to wifi.");
        if (config?.ota?.offline) {
          stopWifi();
          loadOfflineScript();
        } else {
          console.warn("No offline script was found.");
          startSoftApMode();
        }
      }
    } else if (evt.status === 1) {
      if (!programLoaded) {
        console.info("WIFI: CONNECTED");
        if (!configServerStarted) {
          configServer.startConfigServer();
          configServerStarted = true;
        }

        retries = 0;

        if (config?.ota?.url) {
          programLoaded = true;
          console.info("Loading program from: " + config.ota.url);

          let headers: Headers;
          fetch(config.ota.url)
            .then(function (r) {
              headers = r.headers;
              return r.text();
            })
            .then(function (data) {
              if (config?.ota?.offline) {
                config.ota.script = data;
                saveConfig(config);
                console.info("==> Saved offline script length=" + data.length);
              } else {
                console.info("==> NOT saving offline script");
              }

              const dateString = headers.get("Date");
              if (dateString) {
                const now = parseDate(dateString);
                setDateTimeInMillis(now.getTime());
                setDateTimeZoneOffsetInHours(2);
                setBootTime(new Date());
                console.debug(`Setting boot time to ${getBootTime()}`);
              }
              evalScript(data, headers);
            })
            .catch(function (error) {
              console.error(error);
              startSoftApMode();
            });
        } else {
          console.error("No OTA (Over-the-air) url specified.");
          loadOfflineScript();
        }
      }
    } else if (evt.status === 2) {
      console.info("WIFI: CONNECTING...");
    }
  });
}

export function main(): void {
  let showSetup = false;

  console.log("Current configuration:");
  console.log(JSON.stringify(config));

  if (typeof KEY_BUILTIN !== "undefined" && digitalRead(KEY_BUILTIN) == 0) {
    console.info("Setup key pressed: Starting setup mode ...");
    showSetup = true;
  }

  if (!config?.wifi?.ssid) {
    console.info("Missing wifi SSID configuration: Starting setup mode ...");
    showSetup = true;
  }

  if (!config?.wifi?.password) {
    console.info(
      "Missing wifi password configuration: Starting setup mode ..."
    );
    showSetup = true;
  }

  if (showSetup) {
    startSoftApMode();
  } else {
    console.info("Trying to connect to Wifi from JS:");
    connectToWifi();
  }
}
