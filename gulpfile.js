// Modules :)
// ===========================================
var gulp     = require('gulp'),
    jade     = require('gulp-jade'),
    data     = require('gulp-data'),
    htmlhint = require('gulp-htmlhint'),
    cssnext  = require('gulp-cssnext'),
    uncss    = require('gulp-uncss');
    csslint  = require('gulp-csslint'),
    babel    = require('gulp-babel'),
    jshint   = require('gulp-jshint'),
    connect  = require('gulp-connect'),
    ghPages  = require('gulp-gh-pages');

// Compile Jade
// ===========================================
gulp.task('jade', () => {
	gulp.src('src/**.jade')
		  .pipe(data(file => require('./config.json')))
    	.pipe(jade())
    	.pipe(gulp.dest('out'))
    	.pipe(connect.reload());
});

// HTML hint
// ===========================================
gulp.task('htmlhint', () => {
  gulp.src('./out/*.html')
    .pipe(htmlhint())
    .pipe(htmlhint.reporter())
    .pipe(connect.reload());
});

// cssnext features
// ===========================================
gulp.task('cssnext', () => {
  gulp.src('src/assets/styles/style.css')
    .pipe(cssnext({
      compress: false
    }))
    .pipe(gulp.dest('out/assets/styles/'))
    .pipe(connect.reload());
});

// uncss
// ===========================================
gulp.task('uncss', () => {
  gulp.src('out/assets/styles/style.css')
    .pipe(uncss({
        html: ['out/*.html']
      }))
    .pipe(gulp.dest('out/assets/styles/'))
    .pipe(connect.reload());
});

// CSS Lint
// ===========================================
gulp.task('csslint', () => {
  gulp.src('out/assets/styles/*.css')
    .pipe(csslint())
    .pipe(csslint.reporter())
    .pipe(connect.reload());
});

// Babel
// ===========================================
gulp.task('babel', () => {
  gulp.src('src/assets/scripts/**.js')
    .pipe(babel({
      presets: ['es2015']
     }))
    .pipe(gulp.dest('out/assets/scripts/'))
    .pipe(connect.reload());
});

// JSHint
// ===========================================
gulp.task('hint', () => {
  return gulp.src('out/assets/scripts/**.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(connect.reload());
});

// Watch
// ===========================================
gulp.task('watch', () => {
	gulp.watch(['src/**/**.jade'], ['jade']);
	gulp.watch(['out/*.html'], ['htmlhint']);
	gulp.watch(['src/assets/styles/**/**.css'], ['cssnext']);
  // gulp.watch(['out/assets/styles/**.css'], ['uncss']);
  // gulp.watch(['out/assets/styles/**.css'], ['csslint']);
  gulp.watch(['src/assets/scripts/**.js'], ['babel']);
  gulp.watch(['out/assets/scripts/**.js'], ['hint']);
});

// Static server
// ===========================================
gulp.task('connect', () => {
	connect.server({
		root: 'out',
		livereload: true
	});
});

// Deploy for gh-pages
// ===========================================
gulp.task('deploy', () => {
  return gulp.src('./out/')
    .pipe(ghPages());
});

// More Tasks
// ===========================================
gulp.task('serve', ['build', 'connect', 'watch']);
gulp.task('build', ['jade', 'cssnext', 'babel']);
gulp.task('validate', ['htmlhint', 'hint']);
