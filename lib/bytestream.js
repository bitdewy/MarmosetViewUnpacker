// bitdewy@gmail.com

'use strict';

function ByteStream(a) {
	this.bytes = new Buffer(a)
}

ByteStream.prototype.empty = function () {
	return 0 >= this.bytes.length
};

ByteStream.prototype.readCString = function () {
	for (var a = this.bytes, b = a.length, c = 0; c < b; ++c)
		if (0 == a[c]) return a = String.fromCharCode.apply(null, this.bytes.subarray(0, c)), this.bytes = this.bytes.subarray(c + 1), a;
	return null
};

ByteStream.prototype.asString = function () {
	for (var a = "", b = 0; b < this.bytes.length; ++b) a += String.fromCharCode(this.bytes[b]);
	return a
};

ByteStream.prototype.readBytes = function (a) {
	var b = this.bytes.subarray(0, a);
	this.bytes = this.bytes.subarray(a);
	return b
};

ByteStream.prototype.readUint32 = function () {
	var a = this.bytes,
		b = a[0] | a[1] << 8 | a[2] << 16 | a[3] << 24;
	this.bytes = a.subarray(4);
	return b
};

exports = module.exports = ByteStream;
