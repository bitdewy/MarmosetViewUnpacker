// bitdewy@gmail.com

'use strict';

var express = require('express');
var app = express();
var extract = require('./extract');

extract.thumbnails(function (err, data) {
	console.log(err, data);
});

app.set('view engine', 'pug');

app.get('/', function (req, res) {
	var data;
	res.render('index', data, function(err, html) {
		res.send(html);
	});
});

app.use(express.static(__dirname + '/../public'));

app.listen(8000);
