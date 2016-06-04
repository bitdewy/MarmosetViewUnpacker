// bitdewy@gmail.com

'use strict';

var express = require('express');
var app = express();
var preload = require('./preload');

var obj = {}

var setup = function(err, data) {
	obj = {content: data};
}

preload.process(setup);

app.set('view engine', 'pug');

app.get('/', function (req, res) {
	res.render('index', obj, function(err, html) {
		console.error(err, obj)
		res.send(html);
	});
});

app.use(express.static(__dirname + '/../public'));

app.listen(8000);
