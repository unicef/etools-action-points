'use strict';
const gulp = require('gulp');
const gulpif = require('gulp-if');
const removeCode = require('gulp-remove-code');

function copyAssets() {
    return gulp.src(['./manifest.json', './index.html'], {since: gulp.lastRun(copyAssets)})
        .pipe(gulpif(/index\.html/, removeCode({prod: true})))
        .pipe(gulp.dest('./build'));
}

module.exports = copyAssets;
