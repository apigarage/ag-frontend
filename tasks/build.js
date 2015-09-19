(function(){

  'use strict';

  var gulp = require('gulp');
  var less = require('gulp-less');
  var esperanto = require('esperanto');
  var map = require('vinyl-map');
  var jetpack = require('fs-jetpack');
  var minifycss = require('gulp-minify-css');
  var rename = require('gulp-rename');
  var gutil = require('gulp-util');

  var utils = require('./utils');

  var projectDir = jetpack;
  var srcDir = projectDir.cwd('./app');
  var destDir = projectDir.cwd('./build');

  var paths = {
    // TODO - DO NOT COPY TESTS FOR THE APP.
    toCopy: [
      'app/**/**',
      '!app/package.json' // Otherwise, it will be overwritten for tests.
    ],
    toWatch: [
      'app/**/**',
      '!app/browser/bower_components/**/**'  // Don't watch this, causes errors due to cyclical references https://github.com/gruntjs/grunt-contrib-watch/issues/75
    ]
  };

  // -------------------------------------
  // Tasks
  // -------------------------------------

  gulp.task('clean', function(callback) {
    return destDir.dirAsync('.', { empty: true });
  });


  var copyTask = function () {
    return projectDir.copyAsync('app', destDir.path(), {
      overwrite: true,
      matching: paths.toCopy
    });
  };
  gulp.task('copy', ['clean'], copyTask);

  // var transpileTask = function () {
  //   return gulp.src(paths.jsCodeToTranspile)
  //   .pipe(map(function(code, filename) {
  //     try {
  //       var transpiled = esperanto.toAmd(code.toString(), { strict: true });
  //       return transpiled.code;
  //     } catch (err) {
  //       throw new Error(err.message + ' ' + filename);
  //     }
  //   }))
  //   .pipe(gulp.dest(destDir.path()));
  // };
  // gulp.task('transpile', ['clean'], transpileTask);
  // gulp.task('transpile-watch', transpileTask);


  var lessTask = function () {
    gulp.src('app/browser/less/app.less')
      .pipe(less().on('error', function(e){ gutil.log(gutil.colors.red(e.message)); }))
      .pipe(gulp.dest('app/browser/css'))
      .pipe(rename({suffix: '.min'}))
      .pipe(minifycss())
      .pipe(gulp.dest('app/browser/css'));
  };
  gulp.task('less', ['clean'], lessTask);
  gulp.task('less-watch', lessTask);

  gulp.task('finalize', ['clean'], function () {
    var manifest = srcDir.read('package.json', 'json');
    switch (utils.getEnvName()) {
      case 'staging':
        // Add "dev" suffix to name, so Electron will write all
        // data like cookies and localStorage into separate place.
        manifest.name += '-staging';
        manifest.productName += ' staging';
        break;
      case 'test':
        // Add "dev" suffix to name, so Electron will write all
        // data like cookies and localStorage into separate place.
        manifest.name += '-test';
        manifest.productName += 'Test';
        break;
      case 'development':
        // Add "dev" suffix to name, so Electron will write all
        // data like cookies and localStorage into separate place.
        manifest.name += '-dev';
        manifest.productName += ' Dev';
        break;
      case 'test':
        // Add "test" suffix to name, so Electron will write all
        // data like cookies and localStorage into separate place.
        manifest.name += '-test';
        manifest.productName += ' Test';
        // Change the main entry to spec runner.
        manifest.main = '../tests/spec.js';
        break;
    }
    destDir.write('package.json', manifest);

    var configFilePath = projectDir.path('config/env_' + utils.getEnvName() + '.json');
    destDir.copy(configFilePath, 'env_config.json');
  });


  gulp.task('watch', function () {
    // gulp.watch(paths.jsCodeToTranspile, ['transpile-watch']);
    gulp.watch('app/**/*.less', ['less-watch']);
    gulp.watch(paths.toWatch, function(obj){
      if(obj.type === 'changed'){
        gulp.src( obj.path, { "base": "./app/"})
          .pipe(gulp.dest('./build/'));
        console.log( new Date().toJSON() + ' - ' + obj.path + ' updated.' );
      }
    });
  });


  // gulp.task('build', ['transpile', 'less', 'copy', 'finalize']);
  gulp.task('build', ['less', 'copy', 'finalize']);
})();
