var	gulp           = require('gulp'),
	nodemon        = require('gulp-nodemon'),
	concat         = require('gulp-concat'),
	jade           = require('gulp-jade'),
	browserSync    = require('browser-sync').create(),
	sourcemaps     = require('gulp-sourcemaps'),
	sass           = require('gulp-sass'),
    ngTemplates    = require('gulp-angular-templatecache'),
	ngAnnotate     = require('gulp-ng-annotate');

var Builder = require('systemjs-builder');
var builder = new Builder();

var paths = {
	server  : ['server/**/*'],
	app     : ['angular/**/*.js', '!angular/config.js', '!angular/loader.js'],
	partials: ['angular/**/*.jade', '!angular/index.jade'],
	home    : ['angular/index.jade'],
	scss    : ['angular/**/*.scss'],
	copy    : ['angular/assets/**/*.{png,jpg}',
			  'angular/favicon.ico'
		      ]
};

var dist = './dist/';

gulp.task('jade', function(done) {
	return gulp.src(paths.partials)
	.pipe(jade({pretty: true}))
	.pipe(ngTemplates({standalone:true}))
	.pipe(gulp.dest('./angular'));

	done();
});

// runs jade on index.jade
gulp.task('home', function() {
	return gulp.src(paths.home)
	.pipe(jade({pretty: true}))
	.pipe(gulp.dest(dist));
});

gulp.task('systemjsbundle', function () {
    builder.reset();

    return builder.loadConfig('./angular/config.js')
    .then(function() {
		var options = {
			sourceMaps: true
		};
        // return builder.build('./angular/app.js', 'dist/build.js');
		return builder.buildSFX('./angular/app.js', 'dist/build.js', options);
    })
    .catch( console.error );
});

gulp.task('sass', function() {
	return gulp.src(paths.scss)
	.pipe(sass().on('error', sass.logError))
	.pipe(concat('styles.css'))
	.pipe(gulp.dest(dist))
	.pipe(browserSync.stream()); 			// injects new styles with page reload!
});

gulp.task('copy', function () {
	return gulp.src(paths.copy)
	.pipe(gulp.dest('./dist'));
});

// run server using nodemon
// use_strict is for let/const?
var config = require('./ignore/settings');
gulp.task('serve', function(){
	return nodemon({
		script: 'server/bin/www',
		// script: 'index.js',
		execMap: {
	      js: "node --use_strict"
	    },
	    watch: 'server/*',
		env: config
	})
	.on('start', function () {
		// done();
	});
});

gulp.task('production', function() {
	gulp.start('systemjsbundle');
});

gulp.task('watch', ['serve'], function() {
    browserSync.init({
    	proxy: 'localhost:5000',
    });

    gulp.watch(paths.scss, ['sass']);
    // gulp.watch(paths.app, ['systemjsbundle']);
    gulp.watch(paths.partials, ['jade']);
    gulp.watch(paths.home, ['home']);
    gulp.watch(paths.copy, ['copy']);
    gulp.watch([dist+"**/*.{html,js}"]).on('change', browserSync.reload);
});


gulp.task('default', ['build', 'watch']);
gulp.task('build', ['jade', 'copy', 'systemjsbundle', 'sass', 'home']);
