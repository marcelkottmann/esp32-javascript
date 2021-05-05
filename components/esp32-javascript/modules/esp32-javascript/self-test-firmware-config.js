Object.defineProperty(exports, "__esModule", { value: true });
var firmwareConfig = {
    access: {
        username: "esp32",
        password: "esp32",
    },
    wifi: {
        ssid: "e2e",
        password: "e2epassword",
    },
    ota: {
        script: "require('./self-test').run();",
        offline: true,
    },
};
exports.default = firmwareConfig;
