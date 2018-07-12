var gulp = require('gulp'),
    browserify = require('browserify'),
    tslint = require('gulp-tslint'),
    tsc = require('gulp-typescript'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    runSequence = require('run-sequence');

gulp.task('default', ['watch', 'build-ts']);

var tsProject = tsc.createProject('tsconfig.json');

gulp.task('build-ts', function () {
    var tsResult = tsProject
        .src()
        .pipe(sourcemaps.init())
        .pipe(tsProject());

    return tsResult.js
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest('bin'));
});

gulp.task('lint', function () {
    return gulp.src([
        'src/**/*.ts',
        'test/**/*.ts'
    ])
        .pipe(tslint({}))
        .pipe(tslint.report('verbose'));
});

gulp.task('watch', ['build-ts'], function () {
    gulp.watch(['src/**/*.ts', 'test/**/*.ts'], ['build-ts']);
});