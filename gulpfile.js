'use strict';

/** ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
 *  DEFINE / REQUIRE GULP PLUGIN VARIABLES
 *  ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– */

var gulp = require('gulp');
var sass = require('gulp-sass');
var panini = require('panini');
var uglify = require('gulp-uglify');
var pump = require('pump');
var browserSync = require('browser-sync').create();

/** ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
 *  GULP TASKS
 *  ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– */

/*  Compile SASS to css files and auto-inject into browsers */
gulp.task('sass', function () {
	return gulp.src('src/assets/scss/**/*.scss')
	           // Run SASS command on the files (specifying the 'scss' format option)
	           .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
	           // Pipe out the results to the /DIST/ASSETS/CSS/ destination directory
	           .pipe(gulp.dest('dist/assets/css'))
	           // Tell BrowserSync to react
	           .pipe(browserSync.stream());
});

/*  Watch for changes in SASS files  */
gulp.task('sass:watch', function () {
	gulp.watch('./sass/**/*.scss', ['sass']);
});

/*  Panini: compile / render html partials, pages, templates into one index.html file   */
gulp.task('panini', function() {
	return gulp.src('src/pages/**/*.{html,hbs,handlebars}')
	    .pipe(panini({
		    root: 'src/pages/',
		    layouts: 'src/layouts/',
		    partials: 'src/partials/',
		    data: 'src/data/',
		    helpers: 'src/helpers/'
	    }))
	    // .pipe(gulp.dest('dist'));
	    .pipe(gulp.dest('dist'))
		// Tell BrowserSync to react
		// .pipe(browserSync.stream());
});

/* Uglify (minify) javascript files     */
gulp.task('compress', function (cb) {
	pump([
			gulp.src('src/assets/js/*.js'),
			uglify(),
			gulp.dest('dist/assets/js')
		],
		cb
	);
});

/* Watch task : watch for changes and perform certain tasks when they occur     */
gulp.task('watch', function () {
	// Process SCSS files into css files
		// gulp.watch('src/assets/scss/**/*.scss', ['sass']);
	// Concat .html, .hb, and .handlebars files into single .html file
		// gulp.watch(['src/{layouts,partials,helpers,data}/**/*'], [panini.refresh]);
	// Minify javascript files
	
	// gulp.watch('src/assets/js/*.js', ['compress']);



	gulp.watch('src/pages/**/*.html', ['panini', panini.refresh]);
	// gulp.watch(['src/{layouts,partials}/**/*.html'], ['panini', 'reload']);
	gulp.watch('src/assets/scss/**/*.scss', ['sass']);
	gulp.watch('src/assets/js/**/*.js', ['compress']);
})


/** --------------------------------------------------------------------------------------------------------------------
 * The default task (called when you run `gulp` from cli)
 * ------------------------------------------------------------------------------------------------------------------ */
// gulp.task('default', ['watch', 'sass', 'panini', 'compress']);





// Static Server + watching scss/js/html files
gulp.task('serve', ['sass', 'panini', 'compress'], function() {

	// Source for browserSync to serve from
	browserSync.init({
		server: "./dist"
	});

	//------------------------------------------------------------------
	// GULP.WATCH() (and tell BrowserSync when to reload the browser//
	//------------------------------------------------------------------

	// Process SCSS files into css files
		// 	gulp.watch('src/assets/scss/**/*.scss', ['sass']);
	// Concat .html, .hb, and .handlebars files into single .html file
		// gulp.watch(['src/{layouts,partials,helpers,data}/**/*'], [panini.refresh]);
	// Minify javascript files
		// gulp.watch('src/assets/js/*.js', ['compress']);

	// Watch for changes to the Panini source files
		// gulp.watch(['src/{layouts,partials,helpers,data}/**/*'], ['panini']);

	// Watch for changes to the (Panini) rendered (output) files in the /DIST/ directory
	gulp.watch("dist/*.html").on('change', browserSync.reload);
});


gulp.task("reload", function () {
	return browserSync.reload;
});

/*  Make the 'serve' task the default Gulp task     */
gulp.task('default', ['serve', 'watch']);
