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

const gulp = require('gulp');
// const gulpif = require('gulp-if');
const mergeStream = require('merge-stream');
const polymerBuild = require('polymer-build');
// Here we add tools that will be used to process our source files.
// const imagemin = require('gulp-imagemin');
const through2 = require('through2').obj;
const path = require('path');

// Additional plugins can be used to optimize your source files after splitting.
// Before using each plugin, install with `npm i --save-dev <package-name>`
// const uglify = require('gulp-uglify');
// const cssSlam = require('css-slam').gulp;
// const htmlMinifier = require('gulp-html-minifier');

const polymerJson = require(global.config.polymerJsonPath);
const polymerProject = new polymerBuild.PolymerProject(polymerJson);
/**
 * Waits for the given ReadableStream
 */
function waitFor(stream) {
    return new Promise((resolve, reject) => {
        stream.on('end', resolve);
        stream.on('error', reject);
    });
}

function build() {
    let sourcesStreamSplitter = new polymerBuild.HtmlSplitter();
    let dependenciesStreamSplitter = new polymerBuild.HtmlSplitter();
    return new Promise((resolve, reject) => { // eslint-disable-line no-unused-vars
        let sourcesStream = polymerProject.sources()
            // .pipe(gulpif(/\.(png|gif|jpg|svg)$/, imagemin()))

            .pipe(sourcesStreamSplitter.split())
            .pipe(sourcesStreamSplitter.rejoin());

        // .pipe(gulpif(/\.js$/, uglify())) // Install gulp-uglify to use
        // .pipe(gulpif(/\.css$/, cssSlam())) // Install css-slam to use
        // .pipe(gulpif(/\.html$/, htmlMinifier())) // Install gulp-html-minifier to use
        let dependenciesStream = polymerProject.dependencies()
            .pipe(dependenciesStreamSplitter.split())
            .pipe(dependenciesStreamSplitter.rejoin());

        let buildStream = mergeStream(sourcesStream, dependenciesStream)
            .pipe(polymerProject.addCustomElementsEs5Adapter())
            .pipe(polymerProject.bundler())
            .pipe(through2(function(file, enc, callback) {
                let addToBase = '';
                if (file.path.indexOf('/assets') > -1) addToBase = '/assets';
                else addToBase = '/';
                file.base = path.join(file.base, addToBase);

                callback(null, file);
            }))
            .pipe(gulp.dest(global.config.buildDirectory));

        return waitFor(buildStream).then(() => {
            resolve();
        });
    });
}

module.exports = build;

