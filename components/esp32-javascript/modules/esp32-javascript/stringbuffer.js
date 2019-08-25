StringBuffer = function () {
	this.content = [];
	this.length = 0;
}
StringBuffer.prototype.toString = function () {
	if (this.content.length === 1) {
		return this.content[0];
	}
	var s = this.content.join('');
	this.content = [s];
	return s;
}
StringBuffer.prototype.append = function (s) {
	var str = s.toString();
	this.length += str.length;
	this.content.push(s.toString());
	return this;
}
function reg(t, f) {
	t.prototype[f] = function () {
		return this.toString()[f].apply(this, arguments);
	}
}
StringBuffer.prototype.substring = function (s, e) {
	if (typeof e === 'undefined') {
		e = this.length;
	}
	if (e < s) {
		var b = s;
		s = e;
		e = b;
	}
	if (s > this.length) {
		s = this.length;
	}
	if (e > this.length) {
		e = this.length;
	}
	if (s < 0) {
		s = 0;
	}
	if (e < 0) {
		e = 0;
	}
	var ns = new StringBuffer();
	if (this.content.length > 0) {
		var accs = 0;
		var i = 0;
		for (i = 0; i < this.content.length; i++) {
			if (s <= accs + this.content[i].length) {
				break;
			} else {
				accs += this.content[i].length;
			}
		}
		var acce = 0;
		var ei = 0;
		for (ei = 0; ei < this.content.length; ei++) {
			if (e <= acce + this.content[ei].length) {
				break;
			} else {
				acce += this.content[ei].length;
			}
		}
		if (i === ei) {
			ns.append(this.content[i].substring(s - accs, e - acce));
		} else {
			ns.append(this.content[i].substring(s - accs));
			this.content.slice(i + 1, ei).forEach(function (e) {
				ns.append(e);
			});

			ns.append(this.content[ei].substring(0, e - acce));
		}
	}
	return ns;
}
StringBuffer.prototype.substr = function (s, l) {
	if (s < 0) {
		s += this.length;
	}
	if (s < 0) {
		s = 0;
	}
	if (l < 0) {
		l = 0;
	}
	return this.substring(s, s + l);
}
reg(StringBuffer, 'indexOf');
reg(StringBuffer, 'toLowerCase');
reg(StringBuffer, 'toUpperCase');

module.exports = StringBuffer;