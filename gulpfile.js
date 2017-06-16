/**
 * Created by zura on 6/16/17.
 */
var gulp = require('gulp');
var ts = require('gulp-typescript');

gulp.task('default', function () {
    return gulp.src('src/**/*.ts')
        .pipe(ts({
            noImplicitAny: true,
            outFile: 'united-logs.js'
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', ['default'], function () {
    // Endless stream mode
    gulp.watch(['src/**/*.ts'], ['default']);
});