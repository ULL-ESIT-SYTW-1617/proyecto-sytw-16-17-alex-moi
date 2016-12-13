#! /usr/bin/env node


var fs = require('fs');
var path = require('path');
var child = require("child_process");
var fs2 = require('fs-extended');
var prompt = require("prompt");
var heroku = require('heroku-client');
var Dropbox = require('dropbox');
const inquirer = require('inquirer');
var dbx;
var bcrypt = require("bcrypt-nodejs")


function initialize(directorio) {
   
   
    console.log("\n============ INSTALANDO DEPENDENCIAS ============")
    console.log("\nEspere mientras el proceso termina ...")

    var contenido='\ngulp.task("deploy-heroku-local", function () {'+ 
        '\n\tvar heroku = require("gitbook-start-heroku-localstrategy-alex-moi");'+
        '\n\tvar url = paquete.repository.url;'+
        
        '\n\n\ heroku.deploy();'+
        '\n});\n\n';


    //Copia el server.js
    fs2.copyFile(path.join(process.cwd(),'node_modules','gitbook-start-heroku-localstrategy-alex-moi','server.js'),path.join(process.cwd(), 'server.js'),function(err){
        if(err)
        console.log(err);
     });

      fs.copyDir(path.join(process.cwd(),'node_modules','gitbook-start-heroku-localstrategy-alex-moi','views'),path.join(process.cwd(), 'views'),function(err){
        if(err)
        console.log(err);
     });
     
     fs.copyDir(path.join(process.cwd(),'node_modules','gitbook-start-heroku-localstrategy-alex-moi','public'),path.join(process.cwd(), 'public'),function(err){
        if(err)
        console.log(err);
     });
     
    //añadimos la tarea
    fs.writeFileSync(path.resolve(process.cwd(),'gulpfile.js'), contenido,  {'flag':'a'},  function(err) {
        if (err) {
            return console.error(err);
        }
        
           
    });
    
    datos(directorio);
  
    
};



  




function datos(directorio){
     //pedimos por pantall el nombre de la app y el token
      var git = require('simple-git')(path.join(process.cwd()));
      //console.log("hfhfhfhfhf   " + path.join(process.cwd()));
       prompt.get([{
              name: 'nombre_app',
              required: true
            },{
              name: 'token_app',
              required: true
            },{
                name: 'token_dropbox',
                required: true
            },{
               name: 'ruta_dropbox',
               required: true
            }], function (err, result) {
            // 
            // Log the results. 
            // 
            console.log('Sus datos son:');
            console.log('  nombre: ' + result.nombre_app);
            console.log('  token: ' + result.token_app);
            console.log('  token_dropbox: ' + result.token_dropbox);
            console.log('  ruta_dropbox: ' + result.ruta_dropbox);
           
            //variable con el contenido de config.json
            var json = '{\n "Heroku":{\n\t"nombre_app": "'+result.nombre_app+'",\n\t "token_app": "'+result.token_app+'"\n\t}\n}';
            var dropb='{\n\t"token_dropbox": "'+result.token_dropbox+'",\n\t "ruta_dropbox": "'+result.ruta_dropbox+'"\n}';
            
            var usuario1 ="usuario1";
            var usuario2 = "usuario2";
            var hash1 = bcrypt.hashSync(usuario1);
            var hash2 = bcrypt.hashSync(usuario2);
            var configuracion ='['+
            '\n\t{'+
            '\n\t\t"usuario": "usuario1",'+
            '\n\t\t"pass": "'+hash1+'"'+
            '\n\t},'+
            '\n\t{'+
            '\n\t\t"usuario": "usuario2",'+
            '\n\t\t   "pass": "'+hash2+'"'+
            '\n\t}'+
            '\n]'
            
            fs.mkdirSync(path.join(process.cwd(), ".token_heroku"));
            fs.writeFileSync(path.join(process.cwd(),".token_heroku","token.json"),json);
            fs.writeFileSync(path.join(process.cwd(),"usuarios.json"),configuracion);
            fs.writeFileSync(path.join(process.cwd(),".datos_dropbox.json"),dropb);
            
            var token = require(path.join(process.cwd(), ".token_heroku","token.json"));
            var pack= require(path.join(process.cwd(), 'package.json'));
           
            var her = new heroku({ token : token.Heroku.token_app });
        
                her.post('/apps', {body: {name: token.Heroku.nombre_app}} ).then(app => {
                
                    //git.init().addRemote('heroku', result.repositorio).add('.').commit('Primer commit').push('heroku','master');
                      
                      
                      
                });
                
            fs.readFile(path.join(process.cwd(),'usuarios.json'), (err, data) => {
                if(err) throw err;
                var datos_dropbox= require(path.resolve(process.cwd(),".datos_dropbox.json"));
                dbx = new Dropbox({ accessToken: datos_dropbox.token_dropbox });
                dbx.filesUpload({path: '/'+datos_dropbox.ruta_dropbox+'.json', contents: data})
        		.then(function(response){
        		    
        			return response;
        		})
        		.catch(function(err){
        			console.log("No se ha subido correctamente la bd al dropbox. Error:"+err);
        			throw err;
        		})
            });
          });
          
         

    
          
}

function deploy() {

    

    console.log("Comenzando el deploy en HEROKU");
   
    
    
    child.exec('git add . ; git commit -m "subiendo a heroku"; git push heroku master;', function(error, stdout, stderr){
        if(error)
          console.log(error)
        
        console.log(stderr);
        console.log(stdout);
      });


   
};

module.exports = {
  initialize,
  deploy
}