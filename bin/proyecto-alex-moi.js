#! /usr/bin/env node

var argv = require('minimist')(process.argv.slice(2));
var fs = require('fs-extended');
var fs2= require('fs-extra')
var ejs = require("ejs");
var path = require("path");
var gitconfig = require('git-config');
var prompt = require('prompt');
var exec = require("ssh-exec");
const GitUrlParse = require("git-url-parse");

//Variables para el package.json
var author, email;
var name        = argv.n || '';
var autor       = argv.a || '';
var help        = argv.h;
var version     = argv.v;

//Despliegue en iaas
var dir         = argv.c;
var repo_url    = argv.u;
var ip_iaas     = argv.ip;
var path_iaas   = argv.path;


function crear_estructura(dir, serv){
    console.log("\n============ CREANDO ESTRUCTURA ============")
      
      
    //COPIA ARCHIVOS BASE
      //creamos el directorio raiz
      fs.createDir(path.join(process.cwd(), dir), function(err){
        if(err)
          console.log(err);
    	});
      
      //creamos el directorio txt
      fs.createDir(path.join(process.cwd(), dir , 'txt'), function(err){
        if(err)
          console.log(err);
    	});
    	
    	//creamos el directorio scripts
    	fs.createDir(path.join(process.cwd(), dir , 'scripts'), function(err){
        if(err)
          console.log(err);
    	});
    	
    	//copiamos lo que hay en txt y lo ponemos en el txt creado
      fs.copyDir(path.join(__dirname, '..', 'template', 'txt'), path.join(process.cwd(), dir , 'txt'), function (err) {
      	if (err)
          console.error(err)
    	});
      
      //copiamos lo que hay en scripts y lo ponemos en el spripts creado
      fs.copyDir(path.join(__dirname, '..','template', 'scripts'), path.join(process.cwd(), dir , 'scripts'), function (err) {
      	if (err)
          console.error(err)
    	});
    
      //copiamos el book
      fs.copyFile(path.join(__dirname,'..','template','book.json'),path.join(process.cwd(), dir , 'book.json'),function(err){
        if(err)
        console.log(err);
      });
      
      //copiamos gulpfile
      fs.copyFile(path.join(__dirname,'..','gulpfile.js'), path.join(process.cwd(), dir , 'gulpfile.js'),function(err){
        if(err)
          console.log(err);
      });
      
     //copiamos .gitignore
      fs.copyFileSync(path.join(__dirname,'..','template','.npmignore'), path.join(process.cwd(), dir , '.gitignore'),function(err){
        if(err)
          console.log(err);
      });
     
    
    if( serv == 1 )      //COPIA FICHEROS DESPLIEGUE IAAS 
    {
      
      fs2.copy(path.join(__dirname, '..', 'iaas'), path.join(process.cwd(), dir), function (err) {
      	if (err)
          console.error(err)
    	});

    } 
    
    if( serv == 2 )       //COPIA FICHEROS DESPLIEGUE HEROKU
    {  

      fs2.copy(path.join(__dirname, '..', 'heroku'), path.join(process.cwd(), dir), function (err) {
      	if (err)
          console.error(err)
    	});
    	
      //copiamos .env
      fs.copyFileSync(path.join(__dirname,'..','template','.env'), path.join(process.cwd(), dir , '.env'),function(err){
        if(err)
          console.log(err);
      });
      
      //copiamos procfile
      fs.copyFileSync(path.join(__dirname,'..','template','Procfile'), path.join(process.cwd(), dir , 'Procfile'),function(err){
        if(err)
          console.log(err);
      });
    } 
      

      //Coger usuario y email de git
      gitconfig(function(err,config){
          if(err) console.log(err);
          
          author  = config.user.name  || argv.n;
          email   = config.user.email || '';

          
          //renderizando package.json
          ejs.renderFile(path.join(__dirname,'..','template','package.ejs'),{ autor: author, autore: email, nombre: name, repourl: repo_url, ip_iaas_ull: ip_iaas , path_iaas_ull: path_iaas}, 
            function(err,data){
                if(err) {
                    console.error(err);
                }
                if(data) {
                    fs.writeFile(path.join(process.cwd(),dir,'package.json'), data);
                }
            });
      });
      
      console.log("Estructura de directorios creada!");
}


function deploy_iaas(ip, ruta, url) {

    var carpeta = GitUrlParse(url);

    console.log("Comenzando el deploy en Iaas");
    console.log('Direccion IP Destino: '+ip);
    console.log('Ruta de destino: '+ruta+'/'+carpeta.name);
    console.log('Repositorio origen: '+url);
  

    exec('cd '+ruta+';git clone '+url+'',{
          user: 'usuario',
          host: ip,
          key: 'fs.readFileSync(`${process.env.HOME}/.ssh/id_rsa`)'
    
      },function(err){
       if(err){
      	console.log('Haciendo pull del repositorio!');
        exec('cd '+ruta+'/'+carpeta.name+'; git pull',{
            user: 'usuario',
            host: ip,
            key: 'fs.readFileSync(`${process.env.HOME}/.ssh/id_rsa`)'
          },function(err){ 
            if(err)
                console.log("Ha habido un error con el pull");
            else
                console.log("Actualizacion carpeta confirmada");
            });
        }
        else {
            console.log("Clonación del repositorio confirmada");
        }
    });
    
}


if(help){
  console.log("\nAyuda proyecto-sytw-alex-moi:"
              +"\n\nLos argumentos aceptados son:"
              +"\n -a: Especificar el autor del gitbook"
              +"\n -n: Especificar el nombre del gitbook"
              +"\n -c: Especificar el nombre del directorio"
              +"\n -u: Especificar la url del repositorio git"
              +"\n -h: Ayuda"
              +"\n -v: version del paquete"
              +"\n --ip: Especificar la IP del IaaS"
              +"\n --path: Especificar la PATH de IaaS\n");

}

else{
  if(version){
    var configuracion = require('../package.json');
    var ver = configuracion.version;
    console.log("Version: "+ ver);
  }
  else{
    if(!dir && !repo_url && !version && !help && !autor && !repo_url && !name )
      return console.log("\nEspecifique alguna opcion")
    
    if(dir && !repo_url)
      return console.log("\nEs obligatorio que especifique las opciones -c y -u"
                         +"\nEjemplo: proyecto-sytw-alex-moi -c pepito -u https://github.com/usuario/pepito.git"
                         +"\n"
      )
    
    var serv;
    prompt.start();

    prompt.get([
      { name: 'pregunta', required: true, description: "¿Desea realizar un despliegue en iaas o en heroku? Debe escoger una de las dos opciones.\n1 = IaaS  2 = Heroku"}
      ], function (err, result) {
          if(err)
              return err;
          if( result.pregunta == 1 || result.pregunta == 2){
            serv = result.pregunta;
            if(serv == 1 && (!ip_iaas || !path_iaas) )
              return console.log("\nPara desplegar en el iaas debe especificar la ip y el path"
                                 +"\nEjemplo: proyecto-sytw-alex-moi -c pepito -u https://github.com/usuario/pepito.git --ip 10.6.128.1 --path /home/usuario"
                                 +"\n"
              );
            crear_estructura(dir, serv);
          }
            
          else
            return console.log("El valor introducido es incorrecto pruebe a realizar la ejecucion de nuevo")
      });
    
    
    
    
  } 
  

}


module.exports = {
  deploy_iaas
}