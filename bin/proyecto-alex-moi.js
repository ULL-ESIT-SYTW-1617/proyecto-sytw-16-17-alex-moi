#! /usr/bin/env node

var argv = require('minimist')(process.argv.slice(2));
var fs = require('fs-extended');
var ejs = require("ejs");
var path = require("path");
var child = require("child_process");
var gitconfig = require('git-config');
var prompt = require('prompt');
 

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

      //copiamos gulpfile
      fs.copyFile(path.join(__dirname,'..','gulpfile.js'), path.join(process.cwd(), dir , 'gulpfile.js'),function(err){
        if(err)
          console.log(err);
      });
    
      //copiamos el book
      fs.copyFile(path.join(__dirname,'..','template','book.json'),path.join(process.cwd(), dir , 'book.json'),function(err){
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
      
      fs.copyDir(path.join(__dirname, '..', 'iaas'), path.join(process.cwd(), dir , 'iaas'), function (err) {
      	if (err)
          console.error(err)
    	});

    } 
    
    if( serv == 2 )       //COPIA FICHEROS DESPLIEGUE HEROKU
    {  
      
      fs.copyDir(path.join(__dirname, '..', 'heroku'), path.join(process.cwd(), dir , 'heroku'), function (err) {
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
          ejs.renderFile(path.join(__dirname,'..','template','package.ejs'),{ autor: author, autor: email, nombre: name, repourl: repo_url, ip_iaas_ull: ip_iaas , path_iaas_ull: path_iaas}, 
            function(err,data){
                if(err) {
                    console.error(err);
                }
                if(data) {
                    fs.writeFile(path.join(process.cwd(),dir,'package.json'), data);
                }
            });
      });
      
      console.log("Estructura de directorios creada!")
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
    
    if(dir && !repo_url  && !ip_iaas && !path_iaas)
      return console.log("\n\nEs obligatorio que especifique las opciones -c -u --ip y --path"
                         +"\n Ejemplo: proyecto-sytw-alex-moi -c pepito -u https://github.com/usuario/pepito.git --ip 10.6.128.1 --path /home/usuario"
      )
    
    var serv;
    prompt.start();

    prompt.get([
      { name: 'pregunta', required: true, description: "¿Desea realizar un despliegue en iaas o en heroku? Debe escoger una de las dos opciones.\n1 = IaaS  2 = Heroku"}
      ], function (err, result) {
          if(err)
              return err;
          if( result.pregunta == 1 || result.pregunta == 2)
            serv = result.pregunta;
          else
            return console.log("El valor introducido es incorrecto pruebe a realizar la ejecucion de nuevo")
      });
    
    crear_estructura(dir, serv)
  } 
  

}


/*
else{
  
  
  if(!name && !repo_url && !directorio && !ip_iaas && !path_iaas && !deploy && !help)
    return console.log("Debe especificar -c para generar la estructura o -d para realizar el despliegue si ya esta creada la estructura")
    
  if(directorio)
  {
    var existe
    fs.existsSync(path.join(process.cwd(), directorio)) ? existe=true : existe=false;
    console.log(path.join(process.cwd(), directorio))
    
    
      var nombre_dir;
      if(!existe) 
      {
          nombre_dir = directorio
    
          if(!deploy)
            crear_estructura(nombre_dir);
          else
            return console.log("No es posible hacer un deploy sin antes generar la estructura de directorios")
      }
      else
        console.log("Ya esta creada")
  }
  
  if(!directorio)
  {
    if(deploy)
    {
      var carpeta;
      prompt.start();
      prompt.get([
        { name: 'carpeta', required: true, description: "Introduzca el nombre de la carpeta en la que esta el GitBook" }, 
        ], function (err, result) {
            if(err)
                return err;
            carpeta = result.carpeta
            var pwd = process.cwd().split("/");
      
      
            if( pwd[pwd.length-1] == carpeta ) 
            {  
              if( Array.isArray( deploy ) == false)
              {
                
                switch (deploy) {
                  case 'iaas-ull-es':
                        desplegar(nombre_dir, 'iaas-ull-es');   
                      break;
                      
                  case 'heroku':
                      desplegar(nombre_dir, 'heroku')  
                      break;
                      
                  case 'heroku-token':
                      desplegar(nombre_dir, 'heroku-token')   
                      break;
                  
                  case 'heroku-token-oauth':
                      desplegar(nombre_dir, 'heroku-token-oauth')   
                      break;
                  
                  case 'heroku-localstrategy':
                      desplegar(nombre_dir, 'heroku-localstrategy')   
                      break;
                  
                  case 'iaas-bbdd':
                      desplegar(nombre_dir, 'iaas-bbdd')   
                      break;
                      
                  case 'github':
                      desplegar(nombre_dir, 'github') 
                      break;
                  
                  case 'https':
                      desplegar(nombre_dir, 'https') 
                      break;
                      
                  default:
                    console.log("La opcion " + deploy + " no es valida");
                }
              }
              
              else if( Array.isArray( deploy ) == true)
              {
                  //OPCION 5: deploy en mas de un servicio
                  var leng = deploy.length
          
                  if(leng >1){
                    
                    //Comprobar que los valores del array son los correctos
                    var valido=true;
                    for (var i=0; i<leng;i++){
                      if(deploy[i]!='iaas-ull-es' && deploy[i]!='heroku' && deploy[i]!='github' ){
                              console.log("Al menos uno de los argumentos pasados es incorrecto revise la documentacion")
                              valido=false;
                      }
                    }
                    
                    //Desplegar si se han introducido diferentes despliegues
                    var array=[]
                    if(valido == true)
                      for (var i = 0; i < leng; i++) {
                          if( !(deploy[i] in array ) ){
                              array.push(deploy[i])
                              array[deploy[i]]++;
                              desplegar(nombre_dir, deploy[i])
                          }
                          else
                          {
                              console.log("Error se han introducido despliegues repetidos")
                          }
                      }
                  }
              }
            }
            else
            {
              return console.log("No puede hacer un despliegue fuera de la carpeta del book")
            }
            
        });
    }
    else
      return console.log("Se debe especificar el deploy -d sin la opcion -c")
  }
}*/