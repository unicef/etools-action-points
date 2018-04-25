'use strict';

const gulp = require('gulp');
const jshint = require('gulp-jshint');
const jscs = require('gulp-jscs');
const through2 = require('through2').obj;
const fs = require('fs');
const gulpIf = require('gulp-if');
const combine = require('stream-combiner2').obj;
const argv = require('yargs').argv;

function lint() {
    let eslintResults = {};
    let cacheFilePath = process.cwd() + '/build/lintCache.json';

    try {
        eslintResults = JSON.parse(fs.readFileSync(cacheFilePath));
    } catch (e) {
    }

    return gulp.src('./src/elements/**/*.js', {read: false})
        .pipe(gulpIf(
            function(file) {
                let cached = eslintResults[file.path];
                return !(cached && cached.mtime == file.stat.mtime.toJSON() && cached.jshint && cached.jscs);
            },
            combine(
                through2(function(file, enc, callback) {
                    file.contents = fs.readFileSync(file.path);
                    callback(null, file);
                }),
                jshint(),
                jscs(),
                through2(function(file, enc, callback) {
                    eslintResults[file.path] = {
                        jshint: file.jshint.success,
                        jscs: file.jscs.success,
                        mtime: file.stat.mtime
                    };
                    callback(null, file);
                })
            )
        ))
        .pipe(jshint.reporter('default'))
        .pipe(jscs.reporter())
        .pipe(gulpIf(argv.pc, jshint.reporter('fail')))
        .pipe(gulpIf(argv.pc, jscs.reporter('fail')))
        .on('end', function() {
            if (!fs.existsSync('build')) {
                fs.mkdirSync('build');
            }
            fs.writeFileSync(cacheFilePath, JSON.stringify(eslintResults));
        });
}

module.exports = lint;
