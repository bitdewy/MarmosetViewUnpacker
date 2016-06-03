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

Archive.prototype.checkSignature = function (a) {
	if (!a) return !1;
	var b = this.get(a.name + ".sig");
	if (!b) return !1;
	b = JSON.parse(String.fromCharCode.apply(null, b.data));
	if (!b) return !1;
	for (var c = 5381, d = 0; d < a.data.length; ++d) c = 33 * c + a.data[d] & 4294967295;
	a = new BigInt;
	a.setBytes([0, 233, 33, 170, 116, 86, 29, 195, 228, 46, 189, 3, 185, 31, 245, 19, 159, 105, 73, 190, 158, 80, 175, 38, 210, 116, 221, 229, 171, 134, 104, 144, 140, 5, 99, 255, 208, 78, 248, 215, 172, 44, 79, 83, 5, 244, 152, 19, 92, 137, 112, 10, 101, 142, 209, 100, 244, 92, 190, 125, 28, 0, 185, 54, 143, 247, 49,
		37, 15, 254, 142, 180, 185, 232, 50, 219, 11, 186, 106, 116, 78, 212, 10, 105, 53, 26, 14, 181, 80, 47, 87, 213, 182, 19, 126, 151, 86, 109, 182, 224, 37, 135, 80, 59, 22, 93, 125, 68, 214, 106, 209, 152, 235, 157, 249, 245, 48, 76, 203, 0, 0, 95, 200, 246, 243, 229, 85, 79, 169
	], !0);
	d = new BigInt;
	d.setBytes(b[0]);
	return d.powmod(65537, a).toInt32() != c ? !1 : !0;
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

function BigInt(a) {
	this.digits = new Uint16Array(a || 0);
}

BigInt.prototype.setBytes = function (a, b) {
	var c = (a.length + 1) / 2 | 0;
	this.digits = new Uint16Array(c);
	if (b)
		for (var d = 0, c = a.length - 1; 0 <= c; c -= 2) this.digits[d++] = a[c] + (0 < c ? 256 * a[c - 1] : 0);
	else
		for (d = 0; d < c; ++d) this.digits[d] = a[2 * d] + 256 * a[2 * d + 1];
	this.trim();
};

BigInt.prototype.toInt32 = function () {
	var a = 0;
	0 < this.digits.length && (a = this.digits[0], 1 < this.digits.length && (a |= this.digits[1] << 16));
	return a;
};

BigInt.prototype.lessThan = function (a) {
	if (this.digits.length == a.digits.length)
		for (var b = this.digits.length - 1; 0 <= b; --b) {
			var c = this.digits[b],
				d = a.digits[b];
			if (c != d) return c < d
		}
	return this.digits.length < a.digits.length;
};

BigInt.prototype.shiftRight = function () {
	for (var a = 0, b = this.digits, c = b.length - 1; 0 <= c; --c) {
		var d = b[c];
		b[c] = d >> 1 | a << 15;
		a = d
	}
	this.trim();
};

BigInt.prototype.shiftLeft = function (a) {
	if (0 < a) {
		var b = a / 16 | 0;
		a %= 16;
		for (var c = 16 - a, d = this.digits.length + b + 1, e = new BigInt(d), f = 0; f < d; ++f) e.digits[f] = ((f < b || f >= this.digits.length + b ? 0 : this.digits[f - b]) << a | (f < b + 1 ? 0 : this.digits[f - b - 1]) >>> c) & 65535;
		e.trim();
		return e;
	}
	return new BigInt(this);
};

BigInt.prototype.bitCount = function () {
	var a = 0;
	if (0 < this.digits.length)
		for (var a = 16 * (this.digits.length - 1), b = this.digits[this.digits.length - 1]; b;) b >>>= 1, ++a;
	return a;
};

BigInt.prototype.sub = function (a) {
	var b = this.digits,
		c = a.digits,
		d = this.digits.length;
	a = a.digits.length;
	for (var e = 0, f = 0; f < d; ++f) {
		var g = b[f],
			h = f < a ? c[f] : 0,
			h = h + e,
			e = h > g ? 1 : 0,
			g = g + (e << 16);
		b[f] = g - h & 65535
	}
	this.trim();
};

BigInt.prototype.mul = function (a) {
	for (var b = new BigInt(this.digits.length + a.digits.length), c = b.digits, d = 0; d < this.digits.length; ++d)
		for (var e = this.digits[d], f = 0; f < a.digits.length; ++f)
			for (var g = e * a.digits[f], h = d + f; g;) {
				var k = (g & 65535) + c[h];
				c[h] = k & 65535;
				g >>>= 16;
				g += k >>> 16;
				++h
			}
	b.trim();
	return b
};

BigInt.prototype.mod = function (a) {
	if (0 >= this.digits.length || 0 >= a.digits.length) return new BigInt(0);
	var b = new BigInt(this.digits);
	if (!this.lessThan(a)) {
		for (var c = new BigInt(a.digits), c = c.shiftLeft(b.bitCount() - c.bitCount()) ; !b.lessThan(a) ;) c.lessThan(b) && b.sub(c), c.shiftRight();
		b.trim();
	}
	return b;
};

BigInt.prototype.powmod = function (a, b) {
	for (var c = new BigInt([1]), d = this.mod(b) ; a;) a & 1 && (c = c.mul(d).mod(b)), a >>>= 1, d = d.mul(d).mod(b);
	return c;
};

BigInt.prototype.trim = function () {
	for (var a = this.digits.length; 0 < a && 0 == this.digits[a - 1];)--a;
	a != this.digits.length && (this.digits = this.digits.subarray(0, a));
};

exports = module.exports = Archive;
