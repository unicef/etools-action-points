'use strict';

const project = require('./project.js');
const through2 = require('through2').obj;
const path = require('path');

module.exports = function() {
    return project.splitDependencies()
        .pipe(through2(function(file, enc, callback) {
            file.base = path.join(file.base, '/src');
            callback(null, file);
        }))
        .pipe(project.rejoin());
};