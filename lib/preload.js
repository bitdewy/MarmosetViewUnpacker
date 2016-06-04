// bitdewy@gmail.com

'use strict';

var Archive = require('./archive');
var async = require('async');
var fs = require('fs');

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
				var data = JSON.parse(String.fromCharCode.apply(null, s.data));
        		var title = data.metaData.title;
				fn(null, {
					name: title || file.split('.')[0],
					img: 'image/' + file.split('.')[0] + '.thumbnail.jpg',
					scene: 'mview/' + file
				});
			}
			fs.readFile(dir + file, saveThumbnail);
		}

		fs.readdir(dir, function (err, data) {
			async.map(data, extr, fn);
		});
	}
};

exports = module.exports = extract;
