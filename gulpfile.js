"use strict"

var config = require('./envconfig/myconfig');

var sourcedir = config.sourcedir +  "/src/**/**.ts";
var testdir = config.testdir + "/test/**/**.ts";
var destdir = config.destdir;

console.log("source dir:  " + sourcedir);
console.log("test dir:    " + testdir);
console.log("dest dir:    " + destdir);

//******************************************************************************
//* DEPENDENCIES
//******************************************************************************
var gulp        = require("gulp"),
    browserify  = require("browserify"),
    source      = require("vinyl-source-stream"),
    buffer      = require("vinyl-buffer"),
    tslint      = require("gulp-tslint"),
    tsc         = require("gulp-typescript"),
    sourcemaps  = require("gulp-sourcemaps"),
    uglify      = require("gulp-uglify"),
    runSequence = require("run-sequence"),
    mocha       = require("gulp-mocha"),
    istanbul    = require("gulp-istanbul"),
    browserSync = require('browser-sync').create();
    

//******************************************************************************
//* LINT
//******************************************************************************
gulp.task("lint", function() {
    return gulp.src([
        sourcedir,
        testdir
    ])
    .pipe(tslint({ }))
    .pipe(tslint.report("verbose"));
});


//******************************************************************************
//* BUILD
//******************************************************************************
var tsProject = tsc.createProject("tsconfig.json");

gulp.task("build-app", function() {
    return gulp.src([
            sourcedir,
            "typings/main.d.ts/",
        ])
        .pipe(tsc(tsProject))
        .js.pipe(gulp.dest(destdir));
});