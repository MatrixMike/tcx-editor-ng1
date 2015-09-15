var	gulp           = require('gulp'),
	nodemon        = require('gulp-nodemon'),
	concat         = require('gulp-concat'),
	jade           = require('gulp-jade'),
	browserSync    = require('browser-sync').create(),
	// uglify         = require('gulp-uglify'),
	babel          = require('gulp-babel'),
	sourcemaps     = require('gulp-sourcemaps'),
	sass           = require('gulp-sass'),
    ngTemplates   = require('gulp-angular-templatecache');
var ngAnnotate = require('gulp-ng-annotate');
var Builder = require('systemjs-builder');
var builder = new Builder();

var paths = {
	server  : ['server/**/*'],
	app     : ['angular/**/*.js', '!angular/config.js', '!angular/loader.js'],
	partials: ['angular/**/*.jade', '!angular/index.jade'],
	home    : ['angular/index.jade'],
	scss    : ['angular/**/*.scss'],
	copy    : ['angular/assets/**/*.jpg'
			  ,'angular/jspm_packages/system.js'
			  ,'angular/config.js'
		  	  ,'angular/loader.js'
		      ]
};

var dist = './dist/';

gulp.task('jade', function() {
	return gulp.src(paths.partials)
	.pipe(jade({pretty: true}))
	.pipe(ngTemplates({standalone:true}))
	// .pipe(concat('templates.js'))
	.pipe(gulp.dest('./angular'));
});

gulp.task('home', function() {
	return gulp.src(paths.home)
	.pipe(jade({pretty: true}))
	.pipe(gulp.dest(dist));
});

// gulp.task('app-scripts', function() {
// 	return gulp.src(paths.app)
// 	.pipe(sourcemaps.init())    // needs to be first
// 	.pipe(babel())
// 	.pipe(concat('app.js'))
// 	.pipe(ngAnnotate())
// 	// .pipe(uglify())
// 	.pipe(sourcemaps.write())   // don't need to write them for them be usable
// 	.pipe(gulp.dest(dist));
// });

gulp.task('systemjsbundle', function (cb) {
    builder.reset();

    return builder.loadConfig('./angular/config.js')
    .then(function() {
		var options = {
			sourceMaps: true
		};
        return builder.build('./angular/app.js', 'dist/build.js', options);
        // return builder.buildSFX('./assets/app/app/app.js', 'dist/scripts/build.js');
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

//run server using nodemon
config = require('./ignore/settings');
gulp.task('serve', function(){
	return nodemon({
		script: 'index.js',
		watch: 'server/*',
		// ignore: ['angular/**/*', 'dist/*', 'node_modules/*'],
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
    gulp.watch(paths.app, ['systemjsbundle']);
    gulp.watch(paths.partials, ['jade']);
    gulp.watch(paths.home, ['home']);
    gulp.watch(paths.copy, ['copy']);
    gulp.watch([dist+"**/*.{html,js}"]).on('change', browserSync.reload);
});


gulp.task('default', ['build', 'watch']);
gulp.task('build', ['copy', 'systemjsbundle', 'sass', 'jade', 'home']);
