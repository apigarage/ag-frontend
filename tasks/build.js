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
    toCopy: [
      'app/**/**',
      // 'app/spec.js',
      // 'app/windowsManager.js',
      // 'app/node_modules/**',
      // 'app/main/**',
      // 'app/bower_components/**',
      // 'app/img/**',
      // 'app/font/**',
      // 'app/vendor/**',
      // 'app/css/**',
      // 'app/js/**',
      // 'app/**/*.html'
    ],
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
  gulp.task('copy-watch', copyTask);


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
    gulp.src('app/less/app.less')
      .pipe(less().on('error', function(e){ gutil.log(gutil.colors.red(e.message)); }))
      .pipe(gulp.dest('app/css'))
      .pipe(rename({suffix: '.min'}))
      .pipe(minifycss())
      .pipe(gulp.dest('app/css'));
  };
  gulp.task('less', ['clean'], lessTask);
  gulp.task('less-watch', lessTask);

  gulp.task('finalize', ['clean'], function () {
    var manifest = srcDir.read('package.json', 'json');
    switch (utils.getEnvName()) {
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
        manifest.main = 'spec.js';
        break;
    }
    destDir.write('package.json', manifest);

    var configFilePath = projectDir.path('config/env_' + utils.getEnvName() + '.json');
    destDir.copy(configFilePath, 'env_config.json');
  });


  gulp.task('watch', function () {
    // gulp.watch(paths.jsCodeToTranspile, ['transpile-watch']);
    gulp.watch(paths.toCopy, ['copy-watch']);
    gulp.watch('app/**/*.less', ['less-watch']);
  });


  // gulp.task('build', ['transpile', 'less', 'copy', 'finalize']);
  gulp.task('build', ['less', 'copy', 'finalize']);
})();
