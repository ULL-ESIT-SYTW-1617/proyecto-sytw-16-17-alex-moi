var exec = require("ssh-exec");
const GitUrlParse = require("git-url-parse");
var child = require("child_process");

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

function deploy_heroku() {
    console.log("Comenzando el deploy en HEROKU");

    child.exec('git add .; git commit -m "subiendo a heroku"; git push heroku master;', function(error, stdout, stderr){
        if(error)
          console.log(error)
        
        console.log(stderr);
        
    });
}


module.exports = {
  deploy_iaas,
  deploy_heroku
};