const gulp = require('gulp');
const nodemon = require('gulp-nodemon');

const clean = require('./gulp-tasks/clean');
const path = require('path');
const build = require('./gulp-tasks/build');
const buildElements = require('./gulp-tasks/build-elements');
const copyAssets = require('./gulp-tasks/copy-assets');
const copyBower = require('./gulp-tasks/copy-bower');
const runTests = require('./gulp-tasks/test');
const jsLinter = require('./gulp-tasks/js-linter');

global.config = {
    appName: 'etoolsApd',
    polymerJsonPath: path.join(process.cwd(), 'polymer.json'),
    build: {
        rootDirectory: 'build',
        bundledDirectory: '',
        unbundledDirectory: 'unbundled',
        bundleType: 'bundled' // We will only be using a bundled build
    },
    sourceCodeDirectory: './src'
};

gulp.task('watch', function() {
    gulp.watch(['./src/elements/**/*.*'], gulp.series(jsLinter, buildElements));
    gulp.watch(['./src/*.*', './src/assets/**/*.*'], gulp.series(copyAssets));
    gulp.watch(['./bower_components/**/*.*'], gulp.series(copyBower()));
});

gulp.task('lint', gulp.series(jsLinter));
gulp.task('test', gulp.series(clean, gulp.parallel(buildElements, copyAssets, copyBower()), runTests));

gulp.task('startServer', () => {nodemon({script: 'express.js'});});

gulp.task('devBuild', gulp.series(clean, jsLinter, gulp.parallel(buildElements, copyAssets, copyBower())));
gulp.task('prodBuild', gulp.series(clean, buildElements, build));

gulp.task('default', gulp.series(['devBuild']));
