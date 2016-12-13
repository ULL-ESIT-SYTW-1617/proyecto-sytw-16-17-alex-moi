var exec = require("ssh-exec");
var fs = require('fs');
var path = require('path');
const GitUrlParse = require("git-url-parse");


function initialize(directorio) {
    console.log("\n============ INSTALANDO DEPENDENCIAS GITBOOK-START-IAAS-ULL-ES ============")
    console.log("\nEspere mientras el proceso termina ...")

    var contenido='\ngulp.task("deploy-iaas", function () {'+ 
        '\n\tvar iaas = require("gitbook-start-iaas-ull-es-alex-moi");'+
        '\n\tvar url = paquete.repository.url;'+
        '\n\tvar iaas_ip = paquete.iaas.IP;'+
        '\n\tvar iaas_path = paquete.iaas.PATH;'+
        
        '\n\n\tiaas.deploy(iaas_ip, iaas_path, url);'+
        '\n});\n\n';


        //añadimos la tarea
            fs.writeFileSync(path.resolve(process.cwd(),'gulpfile.js'), contenido,  {'flag':'a'},  function(err) {
                if (err) {
                    return console.error(err);
                }
                
                   
            });

};

function deploy(ip, ruta, url) {

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
    
};

module.exports = {
  initialize,
  deploy
}