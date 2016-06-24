// Include gulp
//The require statements tells node to look in to the node_modules
//folder for a package name : gulp/ gulp-connect etc.
var gulp = require('gulp'); 
var connect = require('gulp-connect');
var uglify = require('gulp-uglify');
var ngmin = require('gulp-ngmin');
var minifyHtml = require('gulp-minify-html');
var minifyCss = require('gulp-minify-css');
var usemin = require('gulp-usemin');
var rev = require('gulp-rev');
var clean = require('gulp-clean');

var paths = {
  scripts: [ 'app/**/*.js', '!app/bower_components/**/*.js' ],
  html: [
    './app/**/*.html',
    './app/owm-cities.json',
    './app/bower_components/font-awesome/**/*.svg',
    './app/bower_components/font-awesome/**/*.eot',
    './app/bower_components/font-awesome/**/*.ttf',
    './app/bower_components/font-awesome/**/*.woff',
    './app/bower_components/font-awesome/**/*.otf',
    '!./app/index.html',
    '!./app/bower_components/**/*.html'
  ],
  index: './app/index.html',
  build: './build/'
};
/* 1 */
/*The basic syntax for a gulp task is : 

gulp.task('task-name', function(){
  //code goes here
});

task-name: referes to the name of the task. it will be used whenever you want to run a task in gulp
for example in the CMD : $ gulp task-name

*/
//cleans the build directory.
gulp.task('clean', function(){
  gulp.src( paths.build, { read: false } )
    .pipe(clean()); //Since the task is meant to clean the build, we call this clean()
});
/*
gulp.src tells gulp what files to use for the task. (source / input files)
gulp.dest tells gulp where to output the files once the task is completed (destination / output files)
*/
//copy is triggered by usemin. copy will copy all the html files. this task depends on clean.
// before copying it will clean the build directory
gulp.task('copy', [ 'clean' ], function() {
  gulp.src( paths.html )
    .pipe(gulp.dest('build/'));
});
//build triggers usermin which triggers copy 
gulp.task('usemin', [ 'copy' ], function(){
  gulp.src( paths.index )
    .pipe(usemin({
      css: [ minifyCss(), 'concat' ],
      js: [ ngmin(), uglify() ]
    }))
    .pipe(gulp.dest( paths.build ))
});
//build task starts the build process, it uses usemin that will pick the metadata
//tags from the index.html and combine the CSS and Javascript file 
gulp.task('build', ['usemin']);

/*Conect is the default as it is specified in the last line*/
// connect
gulp.task('connect', function() {
  connect.server({
    root: 'app/'
  });
});
gulp.task('default', ['connect']);
