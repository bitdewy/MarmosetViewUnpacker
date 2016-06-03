// bitdewy@gmail.com

'use strict';

var Archive = require('./archive');
var async = require('async');
var fs = require('fs');

var extract = {
	thumbnails: function (fn) {
		var dir = __dirname + '/../public/mview';
		var extr = function (file) {
			if (file[0] != '.') {
			}
		}

		fs.readdir(dir, function (err, data) {
			async.map(data, extr, function (err, results) {
				fn(err, results);
			});
		});
	}
};

exports = module.exports = extract;
