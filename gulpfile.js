'use strict';

const gulp = require('gulp')
const sass = require('gulp-sass')
const gutil = require('gulp-util')
const autoprefixer = require('gulp-autoprefixer')
const combiner = require('stream-combiner2')
const rename = require("gulp-rename")

let colors = gutil.colors;

const handleError = function(err) {
  console.log('\n')
  gutil.log(colors.red('Error!'))
  gutil.log('fileName: ' + colors.red(err.fileName))
  gutil.log('lineNumber: ' + colors.red(err.lineNumber))
  gutil.log('message: ' + err.message)
  gutil.log('plugin: ' + colors.yellow(err.plugin))
};

gulp.task('sass', function () {
  var combined = combiner.obj([
    gulp.src(['**/*.scss', '!node_modules/**/*']),
    sass().on('error', sass.logError),
    autoprefixer([
      'iOS >= 8',
      'Android >= 4.1'
    ]),
    rename((path) => path.extname = '.wxss'),
    gulp.dest('./')
  ]);

  combined.on('error', handleError);
});

gulp.task('default', function () {
  gulp.watch('**/*.scss', ['sass']);
});