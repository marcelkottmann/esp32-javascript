import { Esp32JsConfig } from "./config";

const firmwareConfig: Esp32JsConfig = {
  access: {
    username: "esp32",
    password: "esp32",
  },
  wifi: {
    ssid: "e2e",
    password: "e2epassword",
  },
  ota: {
    script: `require('./self-test').run();`,
    offline: true,
  },
};

export default firmwareConfig;
