'use strict';
var gulp = require('gulp');

function copyBowerComponents() {
  console.log('hi');
  return gulp.src(['./node_modules/**/*'], {
      since: gulp.lastRun(copyBowerComponents)
    })
    .pipe(gulp.dest('./build/node_modules/'));
}

function copyBowerToSrc() {
  return gulp.src(['./node_modules/**/*'], {
      since: gulp.lastRun(copyBowerToSrc)
    })
    .pipe(gulp.dest('./src/node_modules/'));
}

module.exports = function copyBower(toSrc) {
  return toSrc ? copyBowerToSrc : copyBowerComponents;
};
