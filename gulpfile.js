'use strict';

var gulp = require('gulp');
	var $ = require('gulp-load-plugins')();
	var compass = require('gulp-compass');
	var concatCss = require('gulp-concat-css');
gulp.task('connect', function () {
	var connect = require('connect');
	var app = connect()
		.use(require('connect-livereload')({ port: 35729 }))
		.use(connect.static('app'))
		.use(connect.directory('app'));

	require('http').createServer(app)
		.listen(9000)
		.on('listening', function () {
			console.log('Started connect web server on http://localhost:9000');
		});
});

gulp.task('serve', ['connect'], function () {
	require('opn')('http://localhost:9000');
});

gulp.task('compass', function(){
	gulp.src('./app/styles/scss/**/*.scss')
		.pipe(compass({
			config_file: 'config.rb',
			sass: './app/styles/scss',
			css: './app/styles/css'
		}))
		.pipe(concatCss('bundle.css'))
		.pipe(gulp.dest('./app/styles/'));
});

gulp.task('watch', ['compass','connect', 'serve'], function () {
	var server = $.livereload();

	gulp.watch('app/styles/scss/**/*.scss', ['compass']);

	gulp.watch([
		'app/*.html',
		'app/styles/css/**/*.css',
		'app/scripts/**/*.js',
		'app/styles/scss/**/*.scss'
	]).on('change', function (file) {
		server.changed(file.path);
	});
});

