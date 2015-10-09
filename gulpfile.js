var	gulp           = require('gulp'),
	nodemon        = require('gulp-nodemon'),
	concat         = require('gulp-concat'),
	jade           = require('gulp-jade'),
	browserSync    = require('browser-sync').create(),
	sourcemaps     = require('gulp-sourcemaps'),
	sass           = require('gulp-sass'),
    ngTemplates    = require('gulp-angular-templatecache'),
	ngAnnotate     = require('gulp-ng-annotate'),
	clean          = require('gulp-clean');
var runSequence    = require('run-sequence');

var paths = {
	server  : ['server/**/*'],
	app     : ['src/**/*.js', '!src/config.js', '!src/loader.js'],
	templates: ['src/**/*.jade', '!src/index.jade'],
	home    : ['src/index.jade'],
	scss    : ['src/**/*.scss'],
	copy    : ['src/a*/**/*.{png,jpg}',
			  'src/favicon.ico'
			  ],
	compiled: ['src/styles.css', 'src/index.html', 'src/templates.js']
};

var dist = "./.tmp/";

gulp.task('jade', function(done) {
	return gulp.src(paths.templates)
	.pipe(jade({pretty: true}))
	.pipe(ngTemplates({standalone:true}))
	.pipe(gulp.dest(dist));

	done();
});

// runs jade on index.jade
gulp.task('home', function() {
	return gulp.src(paths.home)
	.pipe(jade({pretty: true}))
	.pipe(gulp.dest(dist));
});

gulp.task('sass', function() {
	return gulp.src(paths.scss)
	.pipe(sass().on('error', sass.logError))
	.pipe(concat('styles.css'))
	.pipe(gulp.dest(dist))
	.pipe(browserSync.stream()); 			// injects new styles with page reload!
});

// run server using nodemon
// use_strict is for let/const?
var config = require('./ignore/settings');
gulp.task('serve', function(){
	console.log(config);
	return nodemon({
		script: 'server/bin/www',
	    watch: 'server/*',
		env: config
	})
	.on('start', function () {
		// done();
	});
});

gulp.task('watch', ['serve'], function() {
    browserSync.init({
    	proxy: 'localhost:5000',
    });

    gulp.watch(paths.scss, ['sass']);
    gulp.watch(paths.templates, ['jade']);
    gulp.watch(paths.home, ['home']);
    gulp.watch(["./src/**/*.js"]).on('change', browserSync.reload);
});

gulp.task('compilation', ['jade', 'sass', 'home']);
gulp.task('default', ['compilation', 'watch']);

/*
 * PRODUCTION
 * still need to edit script tags in index.jade
 */

var Builder = require('systemjs-builder');
var builder = new Builder('./src', './src/config.js');
gulp.task('bundle', function (cb) {

    builder.buildStatic('./src/app.js', './dist/build.js')
    .then(function() {
        cb();
    })
    .catch( console.error );
});

gulp.task('copy', function () {
	return gulp.src(paths.copy)
	.pipe(gulp.dest('./dist'));
});

gulp.task('copy-compiled', function () {
	return gulp.src(paths.compiled)
	.pipe(gulp.dest('./dist'));
});

gulp.task('clean-compiled', function() {
	return gulp.src(paths.compiled)
	.pipe(clean());
});

gulp.task('clean-dist', function() {
	return gulp.src('./dist/*')
	.pipe(clean());
});

gulp.task('set-production', function() {
    dist = './src';
});

gulp.task('production', function() {
	runSequence(
		'clean-dist',
		'set-production',
		'compilation',
		['bundle'],
		['copy-compiled', 'copy'],
		'clean-compiled'
	);
});
