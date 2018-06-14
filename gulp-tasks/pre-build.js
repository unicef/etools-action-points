const gulp = require('gulp');
const polytempl = require('polytempl');

function preBuild(done) {
    return gulp.src(['./src/elements/**/*.html'])
        .pipe(polytempl([{
            path: `${process.cwd()}/bower_components/`, new_base: `${process.cwd()}/src/bower_components/`
        }]))
        .pipe(gulp.dest('./elements'))
        .on('end', () => done());
}

module.exports = preBuild;
