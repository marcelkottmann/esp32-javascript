Object.defineProperty(exports, "__esModule", { value: true });
exports.saveConfig = exports.reloadConfig = exports.config = void 0;
var CONFIG_PATH = "/data/config.js";
function reloadConfig() {
    try {
        exports.config = JSON.parse(readFile(CONFIG_PATH));
    }
    catch (error) {
        var dc = getFirmwareDefaults();
        exports.config = {
            access: {
                username: dc.basicAuthUsername,
                password: dc.basicAuthPassword,
            },
        };
        console.error("An error ocurred while accessing config. Maybe it does not exist.");
    }
}
exports.reloadConfig = reloadConfig;
function saveConfig(config) {
    try {
        console.debug("Saving config.");
        writeFile(CONFIG_PATH, JSON.stringify(config));
        console.debug("Reloading config.");
        reloadConfig();
    }
    catch (error) {
        console.error("An error ocurred while saving config.");
    }
}
exports.saveConfig = saveConfig;
