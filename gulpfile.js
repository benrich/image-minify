/****
 **	INSTALL INSTRUCTIONS
 **
 **	1. package.json - if you don't already have a configured package.json file then run: npm init
 **
 **	2. install gulp and all the dependancies for this gulpfile: sudo npm install
 **
 **	USAGE
 **
 **	  To run the 'default' task,       CL: gulp
 **	           To minify images,       CL: gulp minify
 **	       To minify svg images,       CL: gulp minify-svg
 **	    To minify binary images,       CL: gulp minify-binary
***/

// ****  REQUIRED PLUGINS  **** //
try {
	gulp = require('gulp');
	imagemin = require('gulp-imagemin');
	pngquant = require('imagemin-pngquant');
	gutil = require('gulp-util');
	changed = require('gulp-changed');
	convertEncoding = require('gulp-convert-encoding');
	htmlmin = require('gulp-htmlmin');
	debug = require('gulp-debug');
	minimist = require('minimist');
}
catch(e) {
	console.log('IMPORTANT: A Gulp module wasn\'t found. Please run "sudo npm install" to make sure you\'re up to date.');
	return;
}


/********************/
/***** DEFAULTS *****/
/********************/

var paths = minimist(
	process.argv.slice(2),
	{
		string: 'images',
		string: 'target',
		default: {
			images: 'images/',
			target: 'images_target/'
		}
	}
)

/********************/
/****** TASKS *******/
/********************/

//	if you run 'gulp' on the CL this will run
gulp.task('default', function(){});

//	tasks to run when we run 'gulp watch' on the CL
gulp.task('watch', function() {
//	gulp.watch(paths.images + '**/*.svg', ['minify-svg']);
//	gulp.watch(paths.images + '**/*.{png,gif,jpg,jpeg}', ['minify-binary']);
});

//	minify the app images
gulp.task('minify', ['minify-svg', 'minify-binary'], function(){});

// minify svg images
gulp.task('minify-svg', function(){
	gulp
		.src(paths.images + '**/*.svg')					// select all .svg files
		.pipe(changed(paths.target))					// only minify new files
		.pipe(htmlmin({removeComments: true}))			// remove all xm/html comments (because it breaks the minifier)
		.pipe(convertEncoding({to: 'utf8'}))			// some files not necessary encoded as utf8 so we force it
		.pipe(debug({title: 'File:'}))					// displays the file that's being worked on
		.pipe(imagemin())
		.pipe(gulp.dest(paths.target))
})

// minify binary images
gulp.task('minify-binary', function(){
	gulp
		.src(paths.images + '**/*.{png,gif,jpg,jpeg}')		// select all other image file types we're to support
//		.pipe(changed(paths.target))						// only minify new files
		.pipe(imagemin({
			progressive: true,
			use: [pngquant()]
		}))
		.pipe(gulp.dest(paths.target))
})