var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveConfig = exports.reloadConfig = exports.config = void 0;
var firmware_config_1 = __importDefault(require("./firmware-config"));
var CONFIG_PATH = "/data/config.js";
function reloadConfig() {
    try {
        exports.config = JSON.parse(readFile(CONFIG_PATH));
    }
    catch (error) {
        exports.config = firmware_config_1.default;
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
