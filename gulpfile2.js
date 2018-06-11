/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

'use strict';

const path = require('path');
const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const clean = require('./gulp-tasks/clean.js');

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

const project = require('./gulp-tasks/project.js');
const source = require('./gulp-tasks/project-source');
const dependencies = require('./gulp-tasks/project-dependencies');


gulp.task('watch', function () {
  gulp.watch(['./src/elements/**/*.*'], gulp.series(jsLinter, buildElements));
  gulp.watch(['./src/*.*', './src/assets/**/*.*'], gulp.series(copyAssets));
  gulp.watch(['./bower_components/**/*.*'], gulp.series(copyBower()));
});

gulp.task('lint', gulp.series(jsLinter));
gulp.task('test', gulp.series(clean.build, gulp.parallel(buildElements, copyAssets, copyBower()), runTests));

gulp.task('startServer', function () { nodemon({ script: 'express.js' }) });

gulp.task('devBuild', gulp.series(clean.build, jsLinter, gulp.parallel(buildElements, copyAssets, copyBower())));
gulp.task('prodBuild', gulp.series(clean.build, copyBower('toSrc'), buildElements, project.merge(source, dependencies), clean.bowerInSrc));

//Run dev server and watch changes
gulp.task('devup', gulp.series('prodBuild', gulp.parallel('startServer', 'watch')));

//Minify scripts, run prod server and watch changes
gulp.task('default', gulp.series(['prodBuild']));
