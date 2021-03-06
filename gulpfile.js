var gulp  = require('gulp');
var shell = require('gulp-shell');
var child = require("child_process");
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
gulp.task("run-server", function () {
    child.exec('node server.js', function(error, stdout, stderr){
        if(error)
          console.log(error)
        
        console.log(stderr);
        console.log(stdout);
    });
});


//añadir tareas de deploy en iaas
gulp.task("deploy-iaas", function () {
    var iaas = require("proyecto-sytw-alex-moi/bin/deploy");
    var url = paquete.repository.url;
    var iaas_ip = paquete.iaas.IP;
    var iaas_path = paquete.iaas.PATH;
    
    iaas.deploy_iaas(iaas_ip, iaas_path, url);
});


//añadir tarea para añadir ip y path del iaas al json


//añadir tarea para despliegue en heroku
gulp.task("deploy-heroku", function () {
    var heroku = require("proyecto-sytw-alex-moi/bin/deploy");
    heroku.deploy_heroku();
});
