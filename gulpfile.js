/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json')

const clean = require('./gulp-tasks/clean');
const path = require('path');
const preBuild = require('./gulp-tasks/pre-build');
const postBuild = require('./gulp-tasks/post-build');
const buildElements = require('./gulp-tasks/build-elements');
const copyAssets = require('./gulp-tasks/copy-assets');
const copyImages = require('./gulp-tasks/copy-images');
const copyBower = require('./gulp-tasks/copy-bower');
const runTests = require('./gulp-tasks/test');
const jsLinter = require('./gulp-tasks/js-linter');

global.config = {
    appName: 'etoolsApd',
    polymerJsonPath: path.join(process.cwd(), 'polymer.json'),
    buildDirectory: 'build'
};

// const build = require('./gulp-tasks/build');

// gulp.task('watch', function() {
//     gulp.watch(['./src/elements/**'], gulp.series(jsLinter, buildElements));
//     gulp.watch(['./manifest.json', './index.html'], gulp.series(copyAssets));
//     gulp.watch(['./images/**/*.*'], gulp.series(copyImages));
//     gulp.watch(['./node_modules/**'], gulp.series(copyBower()));
// });

// gulp.task('lint', gulp.series(jsLinter));
// gulp.task('test', gulp.series(clean, gulp.parallel(buildElements, copyAssets), runTests));

// gulp.task('startServer', () => {nodemon({script: 'express.js'});});

// gulp.task('devBuild', gulp.series(clean, jsLinter, gulp.parallel(buildElements, copyAssets, copyImages)));
// gulp.task('prodBuild', gulp.series(clean, preBuild, build, postBuild));

// gulp.task('devup', gulp.series('devBuild', gulp.parallel('startServer', 'watch')));

// gulp.task('default', gulp.series(['prodBuild']));
gulp.task('default', function() {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest('dist'));
});


// const gulp = require('gulp');
// const rename = require('gulp-rename');
// const replace = require('gulp-replace');
// const del = require('del');

// /**
//  * Cleans the prpl-server build in the server directory.
//  */
// gulp.task('prpl-server:clean', () => {
//   return del('server/build');
// });

// /**
//  * Copies the prpl-server build to the server directory while renaming the
//  * node_modules directory so services like App Engine will upload it.
//  */
// gulp.task('prpl-server:build', () => {
//   const pattern = 'node_modules';
//   const replacement = 'node_assets';

//   return gulp.src('build/**')
//     .pipe(rename(((path) => {
//       path.basename = path.basename.replace(pattern, replacement);
//       path.dirname = path.dirname.replace(pattern, replacement);
//     })))
//     .pipe(replace(pattern, replacement))
//     .pipe(gulp.dest('server/build'));
// });

// gulp.task('prpl-server', gulp.series(
//   'prpl-server:clean',
//   'prpl-server:build'
// ));