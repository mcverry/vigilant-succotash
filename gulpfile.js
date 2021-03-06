"use strict"

var config = require('./envconfig/myconfig');


var sourcedir = config.sourcedir +  "/**/**.ts";
var testdir = config.testdir + "/**/**.ts";
var assetsdir = config.assetsdir + "/**/*";
var libsdir = config.libsdir + "/**/*";
var builddir = config.builddir || null;
var destdir = config.destdir || null;
var deploydir = config.deploydir || null;
var entryJsFile = builddir + "/app.js";
var libraryName = "ludumdare";

console.log(config);

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
    watch       = require("gulp-watch"),
    browserSync = require('browser-sync').create();


function swallowError (error) {

  // If you want details of the error in the console
  console.log(error.toString());
  //this.emit('error');
}


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
            "definitions/**/*.d.ts"
        ])
        .pipe(tsc(tsProject))
        .js.pipe(gulp.dest(builddir));
});

gulp.task("bundle-libs", function() {
    return gulp.src(libsdir).pipe(gulp.dest(destdir + "/libs/"));
});

gulp.task("bundle-assets", function() {
    return gulp.src(assetsdir).pipe(gulp.dest(destdir + "/assets/"));
});

gulp.task("bundle", function() {

    var mainTsFilePath = entryJsFile;
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
        .pipe(gulp.dest(destdir));
});

gulp.task("deploy", function() {

    if (deploydir === null)
    {
        console.log("Can't deploy, no target deploy folder 'deploydir' in config");
        return;
    }

    return gulp.src(destdir + "/**/**")
        .pipe(gulp.dest(deploydir))
});

gulp.task("watch", function(){
    return watch([sourcedir, assetsdir], function(){
        gulp.start("default");
    });
});

gulp.task('default', function() {
    console.log("Starting build!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    runSequence('build', 'bundle-assets', 'bundle-libs', 'bundle');
});

gulp.task('release', function() {
    runSequence('default', 'deploy')
});
