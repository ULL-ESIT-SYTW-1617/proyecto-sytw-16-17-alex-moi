# Sistemas y Tecnologías Web. Proyecto Final

## Introducción

El proyecto final de la asignatura, consistirá en realizar un nuevo paquete. Con él, se conseguirá desplegar tanto en el Iaas como en Heroku, un book. Además
se podrán registrar usuarios en el servicio web.

##Instalación

```shell
npm install -g proyecto-sytw-alex-moi 
```

## Tutorial para su ejecución

Para ejecutar, ponemos el siguiente comando:

`proyecto-alex-moi [opciones]`

[opciones] serían:
*    -a: Especificar el autor del gitbook
*    -n: Especificar el nombre del gitbook
*    -c: Especificar el nombre del directorio donde crear el gitbook
*    -u: Especificar la url del repositorio git
*    -h: Help (ayuda)
*    -v: Versión del paquete
*    --ip: Especificar ip en caso de despliegue en Iaas
*    --path: Especificar ruta en caso de despliegue en Iaas

A continuación explicaremos como podemos desplegar el paquete y que es necesario exactamente.

## Paquete para el despligue en IAAS

Lo primero es configurar las SSH Keys.

#### SSH  keys
Para conectarnos a la máquina del iaas, tenenmos que tener configurado la [vpn de la ULL](http://www.ull.es/stic/tag/vpn/), y poder configurar un alias para conectarnos más rápidamente por **ssh**.
Para ello crearemos en `~/.ssh` un fichero `config` con el siguiente contenido:

```
Host sytw
	HostName dir_ip_máquina
	User usuario
```

Introduzca el siguiente comando `ssh-copy-id usuario@direccion-servidor-iaas`
Con esto podremos conectarnos sin ningún problema a la máquina.
También es necesario tener generado en la máquina del iaas las claves para utilizar repositorios Github. Puede encontrar la documentación apropiada [en este link](https://help.github.com/articles/generating-an-ssh-key/).

#### Creación de la estructura

Para crear la estructura de directorios del Gitbook ejecutamos:
```shell
gitbook-start-alex-moi-nitesh -c nombre_directorio -u https://github.com/usuario/ejemplo.git --ip 10.6.128.1 --path /home/usuario (sin '/' al final de la ruta)
```
Elija la **opcion 1**.
Una vez instalado y ejecutado, en la carpeta que se ha creado hacemos:

```shell
npm install
gulp build
git init
git remote add origin url(del repositorio que ha puesto en la opcion -u)
git add .
git commit -m "haciendo cambios"
git push origin master
gulp deploy-iaas
```

Lo siguiente es acudir a nuestra máquina del IAAS y donde se ha creado la nueva carpeta ejecutar:

```shell
npm install
mongod --smallfiles
node server.js (en otra terminal)
```

Su servicio estrá desplegada en **http://ip:8080**

#### Uso de la aplicación

Podrá disponer de un servicio web donde se registren, muestren los datos del usuario, acceda al **book** o en el caso de ser administrador, borrar cuentas de usuario.
Para esto último es importante que registre una cuenta con el siguiente email: **admin@admin.es**, puesto que es la única cuenta que tiene esa posibilidad. 




## Paquete para el despligue en Heroku

Para crear la estructura de directorios del Gitbook ejecutamos:
```shell
gitbook-start-alex-moi-nitesh -c nombre_directorio -u https://github.com/usuario/ejemplo.git 
```
Elija la **opcion 2**.



 




## Versión del paquete
* Este paquete está actualizado. Utilice la última versión


## Enlaces importantes
*  [Página en NPM proyecto-sytw-alex-moi](https://www.npmjs.com/package/proyecto-sytw-alex-moi)
*  [Repositorio GitHub](https://github.com/ULL-ESIT-SYTW-1617/proyecto-sytw-16-17-alex-moi.git)
*  [Descripción de la práctica](https://casianorodriguezleon.gitbooks.io/ull-esit-1617/content/proyectos/sytw/)
*  [Campus Virtual](https://campusvirtual.ull.es/1617/course/view.php?id=1175)

## Autores

* Alexander Cole Mora | [Página Personal](http://alu0100767421.github.io/)
* Moisés Yanes Carballo | [Página Personal](http://alu0100782851.github.io/)