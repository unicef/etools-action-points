'use strict';

const gulp = require('gulp');
const gulpif = require('gulp-if');
const mergeStream = require('merge-stream');
const polymerBuild = require('polymer-build');
// Here we add tools that will be used to process our source files.
// const imagemin = require('gulp-imagemin');
const babel = require('gulp-babel');
const externalHelpers = require('@babel/plugin-external-helpers');
const uglify = require('gulp-uglify-es').default;
const cssSlam = require('css-slam').gulp;
const htmlMinifier = require('gulp-html-minifier');
require('babel-preset-env');

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
            .pipe(gulpif(/\.js$/, babel({
                presets: [['env', {
                    modules: false
                }]],
                plugins: [externalHelpers]
            })))
            .pipe(gulpif(/\.js$/, uglify()))
            .pipe(gulpif(/\.css$/, cssSlam()))
            .pipe(gulpif(/\.html$/, cssSlam()))
            .pipe(gulpif(/\.html$/, htmlMinifier({
                caseSensitive: true,
                collapseWhitespace: true
            })))
            .pipe(sourcesStreamSplitter.rejoin());

        let dependenciesStream = polymerProject.dependencies()
            .pipe(dependenciesStreamSplitter.split())
            .pipe(gulpif(/^((?!custom-elements-es5-adapter|webcomponents-loader).)*\.js$/, babel({
                presets: [['env', {
                    modules: false
                }]],
                plugins: [externalHelpers]
            })))
            .pipe(gulpif(/^((?!custom-elements-es5-adapter|webcomponents-loader).)*\.js$/, uglify()))
            .pipe(gulpif(/\.css$/, cssSlam()))
            .pipe(gulpif(/\.html$/, htmlMinifier({
                caseSensitive: true,
                collapseWhitespace: true
            })))
            .pipe(dependenciesStreamSplitter.rejoin());

        let buildStream = mergeStream(sourcesStream, dependenciesStream)
            .pipe(polymerProject.addBabelHelpersInEntrypoint())
            .pipe(polymerProject.bundler({
                stripComments: true
            }))
            .pipe(gulp.dest(global.config.buildDirectory));

        return waitFor(buildStream).then(() => {
            resolve();
        });
    });
}

module.exports = build;

