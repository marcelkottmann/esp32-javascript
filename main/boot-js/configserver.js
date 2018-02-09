
var requestHandler = [];

function startConfigServer() {
    print('Starting config server.');
    httpServer(80, function (req, res) {
        if (req.path === '/') {
            res.end(redirect('/setup'));
        } else if (req.path === '/restart') {
            if (req.method === 'GET') {
                res.end(page('Request restart', '<form action="/restart" method="post"><input type="submit" value="Restart" /></form>'));
            } else {
                res.end(page('Restarting...', ''));
                restart();
            }
        } else if (req.path === '/setup') {
            if (req.method === 'GET') {
                res.end(page('Setup', '<form action="/setup" method="post">' +
                    'SSID: <input type="text" name="ssid" value="' + el_load('config.ssid') + '" /><br/>' +
                    'Password: <input type="text" name="password" value="' + el_load('config.password') + '" /><br/>' +
                    'JS File URL: <input type="text" name="url" value="' + el_load('config.url') + '" /><br/>' +
                    'Offline Mode: <input type="checkbox" name="offline" value="true" ' +
                    (el_load('config.offline') === 'true' ? 'checked' : '') + '/><br/>' +
                    '<textarea name="script">' + el_load('config.script') + '</textarea>' +
                    '<input type="submit" value="Save" /></form>'));
            } else {
                var config = parseQueryStr(req.body);
                el_store('config.ssid', config.ssid);
                el_store('config.password', config.password);
                el_store('config.url', config.url);
                el_store('config.offline', config.offline === 'true' ? 'true' : 'false');
                el_store('config.script', config.script);

                res.end(page('Saved', JSON.stringify(config)));
            }
        } else {
            for (var i = 0; i < requestHandler.length; i++) {
                if (!res.isEnded) {
                    requestHandler[i](req, res);
                }
            }
            if (!res.isEnded) {
                res.end(page('404', 'Not found'));
            }
        }
    });
}
