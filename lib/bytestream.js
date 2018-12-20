// bitdewy@gmail.com

'use strict';

function ByteStream(a) {
	this.buffer = new Buffer.alloc(a.length, a);
}

ByteStream.prototype.empty = function () {
	return 0 >= this.buffer.length;
};

ByteStream.prototype.readCString = function () {
	for (var a = this.buffer, b = a.length, c = 0; c < b; ++c)
		if (0 == a[c]) return a = String.fromCharCode.apply(null, this.buffer.slice(0, c)), this.buffer = this.buffer.slice(c + 1), a;
	return null;
};

ByteStream.prototype.asString = function () {
	for (var a = "", b = 0; b < this.buffer.length; ++b) a += String.fromCharCode(this.buffer[b]);
	return a;
};

ByteStream.prototype.readBytes = function (a) {
	var b = this.buffer.slice(0, a);
	this.buffer = this.buffer.slice(a);
	return b;
};

ByteStream.prototype.readUint32 = function () {
	var a = this.buffer,
		b = a[0] | a[1] << 8 | a[2] << 16 | a[3] << 24;
	this.buffer = a.slice(4);
	return b;
};

exports = module.exports = ByteStream;
