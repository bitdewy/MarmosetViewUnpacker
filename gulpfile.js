// bitdewy@gmail.com

'use strict';

var gulp = require('gulp');
var gls = require('gulp-live-server')

gulp.task('default', function() {
	var server = gls.new('lib/index.js');
	server.start();
});

gulp.task('test', function() {

});
