// bitdewy@gmail.com

'use strict';

var Archive = require('./archive');
var async = require('async');
var fs = require('fs');
var PNG = require('pngjs').PNG;

var saveSky = function (dest, data) {
	var newfile = new PNG({ width: 256, height: 2048 });
	var b = data;
	var f = new Uint8Array(data.length)
	for (var d = data.length, e = d / 4, g = 0, h = 0; g < d; ++h) {
		f[g++] = b[h + 2 * e];
		f[g++] = b[h + e];
		f[g++] = b[h];
		f[g++] = b[h + 3 * e];
	}
	newfile.data = f;
	newfile.pack()
		.pipe(fs.createWriteStream(dest))
		.on('finish', function () {
			console.log(dest, 'Written!');
		});
};

var extract = {
	process: function (fn) {
		var dir = __dirname + '/../public/mview/';
		var extr = function (file, fn) {
			var saveThumbnail = function (err, data) {
				var arch = new Archive(data);
				var b = arch.extract('thumbnail.jpg');
				var dest = __dirname + '/../public/image/' + file.split('.')[0] + '.thumbnail.jpg';
				fs.writeFileSync(dest, b.data);
				var s = arch.extract('scene.json');
				var sky = arch.extract('sky.dat');
				saveSky(__dirname + '/../public/image/' + file.split('.')[0] + '.sky.png', sky.data);
				var data = JSON.parse(String.fromCharCode.apply(null, s.data));
				var title = data.metaData.title;
				fn(null, {
					name: title || file.split('.')[0],
					img: 'image/' + file.split('.')[0] + '.thumbnail.jpg',
					sky: 'image/' + file.split('.')[0] + '.sky.png',
					scene: 'mview/' + file
				});
			}
			fs.readFile(dir + file, saveThumbnail);
		}

		fs.readdir(dir, function (err, data) {
			async.map(data.filter(function (elem) {
				return elem != '.gitkeep';
			}), extr, fn);

		});
	}
};

exports = module.exports = extract;
