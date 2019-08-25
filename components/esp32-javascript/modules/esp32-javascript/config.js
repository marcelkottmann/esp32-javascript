var config = {};
function reloadConfig() {
    config = {
        wlan: {
            ssid: el_load('config.ssid'),
            password: el_load('config.password')
        },
        ota: {
            url: urlparse(el_load('config.url')),
            offline: el_load('config.offline') === 'true'
        }
    };
}
reloadConfig();

module.exports = {
    config: config,
    reloadConfig: reloadConfig
}