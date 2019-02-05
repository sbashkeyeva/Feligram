'use strict';
// common plugins
var gulp = require('gulp');
var plumber = require('gulp-plumber');
var util = require('gulp-util');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var jsConcat = require('gulp-concat');
var cleanCSS = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');

//Error handling function
var onError = function (error) {
    util.log(util.colors.red('EROR APPEARED'));
    util.log(error.toString());
    util.log(util.colors.red('Error (' + error.plugin + '): ' + error.message));
    this.emit('end');
};

// copy vendor files from node modules

gulp.task('copy', function() {
    gulp.src(['node_modules/jquery/dist/jquery.min.js'])
        .pipe(gulp.dest('./libs'));
    gulp.src(['node_modules/normalize.css/normalize.css'])
        .pipe(gulp.dest('./dest'));
});

// js tasks

gulp.task('lib-js',function(){
    // gulp.src(['./js/libs/*.js'])
    gulp.src(['./libs/jquery.min.js'])
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(jsConcat('libs.js'))
        .pipe(uglify())
        .pipe(rename('libs.min.js'))
        .pipe(gulp.dest('./dest'));
});

gulp.task('js',function(){
    gulp.src('./js/*.js')
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./dest'));
});

// other tasks

gulp.task('sass', function() {
    gulp.src('./sass/style.scss')
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./dest'))
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./dest'));
});

gulp.task('watch', function(){
    gulp.watch('./sass/*.scss',['sass']);
    gulp.watch('./js/*.js',['js']);
});

gulp.task('default',['copy','lib-js','js','sass','watch']);