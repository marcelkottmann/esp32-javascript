interface Esp32JsConfig {
  wlan: {
    ssid: string;
    password: string;
  };
  ota: {
    url: any;
    offline: boolean;
  };
}

export var config: Esp32JsConfig;
export function reloadConfig() {
  config = {
    wlan: {
      ssid: el_load("config.ssid"),
      password: el_load("config.password"),
    },
    ota: {
      url: urlparse(el_load("config.url")),
      offline: el_load("config.offline") === "true",
    },
  };
}
reloadConfig();
