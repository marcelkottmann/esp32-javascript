var config = {
    wlan: {
        ssid: el_load('config.ssid'),
        password: el_load('config.password')
    },
    ota: {
        url: parseUrl(el_load('config.url')),
        offline: el_load('config.offline') === 'true'
        //url: parseUrl('http://rawgit.com/pepe79/test-ota/0.12/esp32.js')
        //url: parseUrl('http://192.168.188.40/esp32.js')
    }
}
