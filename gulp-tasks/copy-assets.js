'use strict';
var gulp = require('gulp');

function copyAssets() {
    return gulp.src(['./src/*.*', './src/assets/**/*.*'], {since: gulp.lastRun(copyAssets)})
        .pipe(gulp.dest('./build/'));
}

module.exports = copyAssets;