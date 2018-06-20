'use strict';
const gulp = require('gulp');

function copyAssets() {
    return gulp.src(['./manifest.json', './index.html'], {since: gulp.lastRun(copyAssets)})
        .pipe(gulp.dest('./build'));
}

module.exports = copyAssets;
