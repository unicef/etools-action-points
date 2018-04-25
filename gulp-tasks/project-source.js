'use strict';

const sass = require('gulp-sass');
const babel = require("gulp-babel");
const builder = require('polytempl');
const compileHtmlTags = require('gulp-compile-html-tags');
const gulpif = require('gulp-if');
const uglify = require('gulp-uglify');
const htmlmin = require('gulp-htmlmin');
const cssSlam = require('css-slam').gulp;
const project = require('./project.js');
const path = require('path');
const combine = require('stream-combiner2').obj;
const through2 = require('through2').obj;

function minifyJs() {
    return uglify({
        preserveComments: false
    });
}

function minifyCss() {
    return cssSlam();
}

function minifyHtml() {
    return htmlmin({
        // options
        caseSensitive: true,
        collapseWhitespace: true
    });
}

module.exports = function() {
    return project.splitSource()
        .pipe(gulpif('**/*.js', babel({presets: ['es2015']})))
        .pipe(gulpif('**/*.html', builder([{path: `${process.cwd()}/bower_components/`, new_base: `${process.cwd()}/src/bower_components/`}])))
        .pipe(gulpif(function(file) {
            return file.extname === '.html' && file.stem !== 'index';
        }, combine(
            compileHtmlTags('style', function (tag, data) { return data.pipe(sass()).pipe(minifyCss()) }),
            compileHtmlTags('script', function (tag, data) { return data.pipe(babel({presets: ["es2015-without-strict"]})).pipe(minifyJs()); }),
            minifyHtml()
        )))

        .pipe(through2(function(file, enc, callback) {
            let addToBase = '';
            if (file.path.indexOf('/src/assets') > -1) addToBase = '/src/assets';
            else addToBase = '/src';
            file.base = path.join(file.base, addToBase);

            callback(null, file);
        }))

        .pipe(project.rejoin()); // Call rejoin when you're finished
};