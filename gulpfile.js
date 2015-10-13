var	gulp           = require('gulp'),
	nodemon        = require('gulp-nodemon'),
	concat         = require('gulp-concat'),
	jade           = require('gulp-jade'),
	browserSync    = require('browser-sync').create(),
	sourcemaps     = require('gulp-sourcemaps'),
	sass           = require('gulp-sass'),
    ngTemplates    = require('gulp-angular-templatecache'),
	ngAnnotate     = require('gulp-ng-annotate'),
	clean          = require('gulp-clean'),
	inject         = require('gulp-inject');
var runSequence    = require('run-sequence');

var paths = {
	server  : ['server/**/*'],
	app     : ['src/**/*.js', '!src/config.js', '!src/loader.js'],
	templates: ['src/**/*.jade', '!src/index.jade'],
	home    : ['src/index.jade'],
	scss    : ['src/**/*.scss'],
	copy    : ['src/a*/**/*.{png,jpg}',
			   'src/favicon.ico',
			   'src/fbanalytics.js'
			  ],
	compiled: ['src/templates.js']
};

var compileDestination = "./src";
var injectScripts = ["jspm_packages/system.js", "config.js", "loader.js"];
// var injectScripts = ["jspm_packages/system.js", "config.js", "loader.js"];

gulp.task('templates', function() {
	return gulp.src(paths.templates)
	.pipe(jade({pretty: true}))
	.pipe(ngTemplates({standalone:true}))
	.pipe(gulp.dest('src'));
});

// runs jade on index.jade
gulp.task('home', function() {
	return gulp.src(paths.home)
	.pipe(jade({pretty: true}))
	.pipe(gulp.dest(compileDestination));
});

gulp.task('sass', function() {
	return gulp.src(paths.scss)
	.pipe(sass().on('error', sass.logError))
	.pipe(concat('styles.css'))
	.pipe(gulp.dest(compileDestination))
	.pipe(browserSync.stream()); 			// injects new styles without page reload!
});

gulp.task('compilation', ['templates', 'sass']);

gulp.task('injectjs', ['home'], function() {
	var sources = gulp.src(injectScripts, {read: false, cwd: compileDestination});
	// var sources = gulp.src(injectScripts, {read: false, cwd: compileDestination});

	return gulp.src(compileDestination+'/index.html')
		.pipe(inject(sources))
		.pipe(gulp.dest(compileDestination));
});

// run server using nodemon
// use_strict is for let/const?
var config = require('./ignore/settings');
gulp.task('serve', function(cb){
	var called = false;
	return nodemon({
		script: 'server/bin/www',     // port 5000 bt default
	    watch: 'server/*',
		env: config
	})
	.on('start', function () {
		if (!called) {
	       called = true;
	       cb();
		}
  	})
	.on('restart', function () {
      console.log('restarted!')
    })
});

gulp.task('watch', ['serve'], function() {
	browserSync.init({
		proxy: 'localhost:5000',
	});

    gulp.watch(paths.scss, ['sass']);
    gulp.watch(paths.templates, ['templates']);
    gulp.watch(paths.home, ['injectjs']);
    gulp.watch(["src/**/*.js"]).on('change', browserSync.reload);
});

gulp.task('default', ['compilation', 'injectjs', 'watch']);

/*
 * P R O D U C T I O N
 * still need to edit script tags in index.jade
 */

 gulp.task('clean-dist', function() {
 	return gulp.src(compileDestination)
 	.pipe(clean());
 });

var Builder = require('systemjs-builder');
var builder = new Builder('./src', './src/config.js');
gulp.task('bundle', function (cb) {

    builder.buildStatic('./src/app.js', './dist/build.js')
    // .then( cb )
	.then(function() {
        cb();
    })
    .catch( console.error );
});

gulp.task('copy', function () {
	return gulp.src(paths.copy)
	.pipe(gulp.dest(compileDestination));
});

gulp.task('copy-compiled', function () {
	return gulp.src(paths.compiled)
	.pipe(gulp.dest(compileDestination));
});

// gulp.task('clean-compiled', function() {
// 	return gulp.src(paths.compiled)
// 	.pipe(clean());
// });

gulp.task('set-production', function() {
    compileDestination = './dist';
	injectScripts = ["build.js"];
});

gulp.task('production', function() {
	runSequence(
		'set-production',
		'clean-dist',
		'compilation',
		'bundle',
		['injectjs', 'copy']
	);
});
