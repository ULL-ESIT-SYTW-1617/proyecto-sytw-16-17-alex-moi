var gulp  = require('gulp');
var shell = require('gulp-shell');
var git = require('gulp-git');


var fs = require('fs');
var cwd = process.cwd();
var paquete = require(cwd+'/package.json');


//instalar dependencias globales y locales para gitbook,gitbook-cli,child-process

gulp.task('buildeploy', ['build', 'deploy']);

gulp.task('build', function() {
  return gulp.src('').pipe(shell(['gitbook install; ./scripts/generate-gitbook']));
});

gulp.task('deploy', function () {
  return gulp.src('').pipe(shell(["./scripts/deploy-gitbook"]));
});

gulp.task('wikibuild', function() {
   return gulp.src('').pipe(shell(['./scripts/generate-wiki'])); 
});

gulp.task('wikideploy', function() {
   return gulp.src('').pipe(shell(['./scripts/deploy-wiki'])); 
});


//añadir tarea para arrancar o parar el servidor

//añadir tareas de deploy en iaas

//añadir tarea para añadir ip y path del iaas al json

//añadir tarea para despliegue en heroku


