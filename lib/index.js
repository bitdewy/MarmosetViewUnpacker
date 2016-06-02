// bitdewy@gmail.com

'use strict';

var express = require('express');
var app = express();

app.set('view engine', 'pug');

app.get('/', function(req, res) {
  res.render('index', function(err, html) {
	console.log(err);
	res.send(html);
  });
});

app.use(express.static(__dirname + '/../public'));

app.listen(8000);

