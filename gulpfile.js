var gulp = require('gulp');
var concat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var cssmin = require('gulp-cssmin');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var webserver = require('gulp-webserver');
var sass = require('gulp-sass');

gulp.task('webserver', function() {
  gulp.src('./build/')
  .pipe(webserver({
    port: 3212,
    livereload: true,
    open: true,
    fallback: './build/index.html'
  }));
});

gulp.task('cssConcat', function() {
  return gulp.src(require('./stylesheets-dependencies.json').dependencies)
  .pipe(plumber())
  .pipe(autoprefixer())
  .pipe(concat('all.css'))
  .pipe(gulp.dest('./build/css'));
});

gulp.task('cssMin', function() {
  return gulp.src(require('./stylesheets-dependencies.json').dependencies)
  .pipe(plumber())
  .pipe(cssmin())
  .pipe(concat('all.min.css'))
  .pipe(gulp.dest('./build/css'));
});
    
gulp.task('jsUglify', function() {
  return gulp.src('./app/js/**/*.js')
  .pipe(plumber())
  .pipe(concat('all.js'))
  .pipe(uglify())
  .pipe(gulp.dest('./build/js'));
});

gulp.task('imageMin', function() {
  return gulp.src(['./app/img/**/*.*'])
  .pipe(imagemin({
    optimizationLevel: 7
  }))
  .pipe(gulp.dest('./build/img'));
});

gulp.task('sass', function () {
  return gulp.src('./app/pre-proc/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest('./app/css'));
});

gulp.task('templates', function() {
  return gulp.src('./app/index.html')
  .pipe(gulp.dest('./build'));
});

gulp.task('templatesDirect', function() {
  return gulp.src(['./app/templates/**/*.html'])
  .pipe(gulp.dest('./build/templates'));
});

gulp.task('buildLib', function() {
  gulp.src(require('./dependencies.json').dependencies)
  .pipe(concat('vendor.js'))
  .pipe(gulp.dest('./build/js'));
});


gulp.task('watch', ['cssConcat'], function () {
  gulp.watch('./app/css/**/*.css', ['cssConcat']);
  gulp.watch('./app/pre_proc/scss/**/*.scss', ['sass']);
  gulp.watch('./app/js/**/*.js', ['jsUglify']);
  gulp.watch('./app/templates/**/*.html', ['templatesDirect']);
  gulp.watch('./app/index.html', ['templates']);
});

gulp.task('default', ['jsUglify', 'imageMin', 'templates', 'sass', 'templatesDirect', 'webserver', 'buildLib', 'cssMin', 'cssConcat', 'watch']);
