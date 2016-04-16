"use strict"

var config = require('./envconfig/myconfig');

var sourcedir = config.sourcedir +  "/**/**.ts";
var testdir = config.testdir + "/**/**.ts";
var assetsdir = config.assetsdir = "/**/**";
var builddir = config.builddir || null;
var destdir = config.destdir || null;
var deploydir = config.deploydir || null;
var entryJsFile = builddir + "/HelloWorld.js";
var libraryName = "lodumdare";

console.log("source dir:  " + sourcedir);
console.log("test dir:    " + testdir);
console.log("dest dir:    " + builddir);

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

gulp.task("build", function() {
    return gulp.src([
            sourcedir,
            "typings/main.d.ts/",
        ])
        .pipe(tsc(tsProject))
        .js.pipe(gulp.dest(builddir));
});

gulp.task("bundle", function() {

    var mainTsFilePath = entryJsFile;
    var outputFolder   = destdir;
    var outputFileName = libraryName + ".min.js";

    var bundler = browserify({
        debug: true,
        standalone : libraryName
    });

    return bundler.add(mainTsFilePath)
        .bundle()
        .pipe(source(outputFileName))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(outputFolder));
});

gulp.task("deploy", function() {
    
    if (deployDir === undefined)
    {
        console.log("Can't deploy, no target deploy folder 'deploydir' in config");
        return;
    }
    
    return gulp.src([destdir + "/**/**", assetsdir])
        .pipe(gulp.dest(deploydir));
});


gulp.task('default', ['lint', 'build', 'bundle', 'deploy']);
gulp.task('release', ['default', 'deploy']);
