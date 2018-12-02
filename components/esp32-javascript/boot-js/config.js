var config = {
    wlan: {
        ssid: el_load('config.ssid'),
        password: el_load('config.password')
    },
    ota: {
        url: parseUrl(el_load('config.url')),
        offline: el_load('config.offline') === 'true'
    }
}
