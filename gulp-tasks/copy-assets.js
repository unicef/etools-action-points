'use strict';
var gulp = require('gulp');

function copyAssets() {
    return gulp.src(['./manifest.json', './index.html', './images/**/*.*'], {since: gulp.lastRun(copyAssets)})
        .pipe(gulp.dest('./build/'));
}

module.exports = copyAssets;
