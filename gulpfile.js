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

gulp.task("deploy-iaas", function () {
    var iaas = require("gitbook-start-proyecto-sytw-alex-moi");
    var url = paquete.repository.url;
    var iaas_ip = paquete.iaas.IP;
    var iaas_path = paquete.iaas.PATH;
    
    iaas.deploy_iaas(iaas_ip, iaas_path, url);
});
//añadir tarea para añadir ip y path del iaas al json

//añadir tarea para despliegue en heroku


