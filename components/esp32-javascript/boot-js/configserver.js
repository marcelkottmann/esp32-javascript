
var requestHandler = [];

function startConfigServer() {
    print('Starting config server.');
    var defaultConfig = getDefaultConfig();
    var authString = ('Basic ' + btoa(defaultConfig.basicAuthUsername + ':' + defaultConfig.basicAuthPassword));
    httpServer(80, function (req, res) {
        if (req.headers['authorization'] !== authString) {
            print('401 response');
            res.write(getHeader(401, 'WWW-Authenticate: Basic realm="Enter credentials"\r\n'));
            res.end('401 Unauthorized');
        } else if (req.path === '/') {
            redirect(res, '/setup');
        } else if (req.path === '/style.css.gz') {
            res.write(getHeader(200, 'Content-Encoding: gzip\r\nCache-Control: public, max-age=3600, s-maxage=3600\r\nContent-type: text/css\r\n'));
            res.end(getCss());
        } else if (req.path === '/restart') {
            if (req.method === 'GET') {
                page(res, 'Request restart', '<form action="/restart" method="post"><input type="submit" value="Restart" /></form>');
            } else {
                page(res, 'Restarting...', '');
                restart();
            }
        } else if (req.path === '/setup') {
            if (req.method === 'GET') {
                page(res, 'Setup', '<form  class="pure-form pure-form-stacked" action="/setup" method="post"><fieldset>' +
                    '<label for="ssid">SSID</label><input type="text" name="ssid" value="' + el_load('config.ssid') + '" />' +
                    '<label for="password">Password</label><input type="text" name="password" value="' + el_load('config.password') + '" />' +
                    '<label for="url">JS file url</label><input type="text" name="url" value="' + el_load('config.url') + '" />' +
                    '<label for="offline" class="pure-checkbox"><input type="checkbox" name="offline" value="true" ' +
                    (el_load('config.offline') === 'true' ? 'checked' : '') + '/> Offline Mode</label>' +
                    '<textarea name="script">' + el_load('config.script') + '</textarea>' +
                    '<input type="submit" class="pure-button pure-button-primary" value="Save" /></fieldset></form>');
            } else {
                var config = parseQueryStr(req.body);
                el_store('config.ssid', config.ssid);
                el_store('config.password', config.password);
                el_store('config.url', config.url);
                el_store('config.offline', config.offline === 'true' ? 'true' : 'false');
                el_store('config.script', config.script);

                page(res, 'Saved', JSON.stringify(config));
            }
        } else {
            for (var i = 0; i < requestHandler.length; i++) {
                if (!res.isEnded) {
                    requestHandler[i](req, res);
                }
            }
            if (!res.isEnded) {
                res.write(getHeader(404, 'Content-type: text/plain\r\n'));
                res.end('Not found');
            }
        }
    });
}
