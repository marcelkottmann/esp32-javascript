resolveModule = function (requested_id, parent_id) {
	console.debug('resolveModule called');
	if (!parent_id || requested_id.substr(0, 1) != '.') {
		parent_id = 'file:///modules/'
	}

	var resolved = urlparse(parent_id).resolve(requested_id);

	var exists = false;
	if (fileExists(resolved.pathname + '/index.js')) {
		exists = true;
		resolved.pathname += '/index.js';
	} else if (fileExists(resolved.pathname)) {
		exists = true;
	} else if (fileExists(resolved.pathname + '.js')) {
		exists = true;
		resolved.pathname += '.js';
	} else if (fileExists(resolved.pathname + 'index.js')) {
		exists = true;
		resolved.pathname += 'index.js';
	}
	if (exists) {
		return resolved.href;
	}

	throw Error('Module ' + requested_id + ' not found.');
}

loadModule = function (resolved_id, exports, module) {
	console.debug('loadModule called');
	var url = urlparse(resolved_id);
	return readFile(url.pathname);
}