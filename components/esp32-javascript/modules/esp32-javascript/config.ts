interface Esp32JsConfig {
  access: {
    username: string;
    password: string;
  };
  wifi?: {
    ssid?: string;
    password?: string;
  };
  ota?: {
    url?: string;
    offline?: boolean;
    script?: string;
  };
}

const CONFIG_PATH = "/data/config.js";

export let config: Esp32JsConfig;

export function reloadConfig(): void {
  try {
    config = JSON.parse(readFile(CONFIG_PATH));
  } catch (error) {
    const dc = getFirmwareDefaults();
    config = {
      access: {
        username: dc.basicAuthUsername,
        password: dc.basicAuthPassword,
      },
    };
    console.error(
      "An error ocurred while accessing config. Maybe it does not exist."
    );
  }
}

export function saveConfig(config: Esp32JsConfig): void {
  try {
    console.debug("Saving config.");
    writeFile(CONFIG_PATH, JSON.stringify(config));
    console.debug("Reloading config.");
    reloadConfig();
  } catch (error) {
    console.error("An error ocurred while saving config.");
  }
}
