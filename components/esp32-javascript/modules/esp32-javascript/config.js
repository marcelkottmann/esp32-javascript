Object.defineProperty(exports, "__esModule", { value: true });
function reloadConfig() {
    exports.config = {
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
exports.reloadConfig = reloadConfig;
reloadConfig();
