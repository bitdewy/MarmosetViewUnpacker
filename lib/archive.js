// bitdewy@gmail.com

'use strict';
var ByteStream = require('./bytestream')

function Archive(a) {
	this.files = [];
	for (a = new ByteStream(a) ; !a.empty() ;) {
		var b = {};
		b.name = a.readCString();
		b.type = a.readCString();
		var c = a.readUint32(),
			d = a.readUint32(),
			e = a.readUint32();
		b.data = a.readBytes(d);
		if (!(b.data.length < d)) {
			if (c & 1 && (b.data = this.decompress(b.data, e), null === b.data)) continue;
			this.files[b.name] = b;
		}
	}
}

Archive.prototype.get = function (a) {
	return this.files[a];
};

Archive.prototype.extract = function (a) {
	var b = this.files[a];
	delete this.files[a];
	return b;
};

Archive.prototype.decompress = function (a, b) {
	var c = new Uint8Array(b),
		d = 0,
		e = new Uint32Array(4096),
		f = new Uint32Array(4096),
		g = 256,
		h = a.length,
		k = 0,
		l = 1,
		m = 0,
		n = 1;
	c[d++] = a[0];
	for (var r = 1; ; r++) {
		n = r + (r >> 1);
		if (n + 1 >= h) break;
		var m = a[n + 1],
			n = a[n],
			p = r & 1 ? m << 4 | n >> 4 : (m & 15) << 8 | n;
		if (p < g)
			if (256 > p) m = d, n = 1, c[d++] = p;
			else
				for (var m = d, n = f[p], p = e[p], q = p + n; p < q;) c[d++] = c[p++];
		else if (p == g) {
			m = d;
			n = l + 1;
			p = k;
			for (q = k + l; p < q;) c[d++] = c[p++];
			c[d++] = c[k]
		} else break;
		e[g] = k;
		f[g++] = l + 1;
		k = m;
		l = n;
		g = 4096 <= g ? 256 : g
	}
	return d == b ? c : null;
};

exports = module.exports = Archive;
