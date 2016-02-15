var packager = require('electron-packager'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    zip = require('gulp-zip'),
    colors = require('colors'),
    useref = require('gulp-useref'),
    concat = require('gulp-concat'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css'),
    htmlmin = require('gulp-htmlmin'),
    fs = require('fs'),
    pkg = require('./package.json');

gulp.task('copy-package', function() {
  gulp.src('package.json')
    .pipe(gulp.dest('minified'));
});

gulp.task('copy-index', function() {
  gulp.src('index.js')
    .pipe(gulp.dest('minified'));
});

gulp.task('copy-fonts', function() {
    gulp.src('vendor/fonts/**.*')
        .pipe(gulp.dest('minified/vendor/fonts'));
});

gulp.task('html', function () {


    return gulp.src('index.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(gulpif('*.html', htmlmin({collapseWhitespace: true})))
        .pipe(gulp.dest('minified'));
});

gulp.task('minify', ['html', 'copy-package', 'copy-fonts', 'copy-index']);

gulp.task('install', function () {
  require('child_process').exec('npm install --production', {cwd: './minified'});
});


gulp.task('dist-win', ['minify', 'install'], function () {
    packager({
      arch: 'x64',
      platform: 'win32',
      icon: 'favicon.ico',
      name: 'Learn-Memory-Static',
      overwrite: true,
      dir: './minified',
      out: './build',
      version: pkg.electronVersion
    }, function done (err, appPath) {
      if (err) throw err;
      console.log(`The app was compiled in ${appPath}.` )
      return gulp.src('build/Learn-Memory-Static-win32-x64/**/**')
          .pipe(zip('Windows.zip'))
          .pipe(gulp.dest('dist/'));
    });
});

gulp.task('default', ['dist-osx64', 'dist-osx32', 'dist-linux64', 'dist-linux32']);
