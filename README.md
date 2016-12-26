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
proyecto-alex-moi -c nombre_directorio -u https://github.com/usuario/ejemplo.git --ip 10.6.128.1 --path /home/usuario (sin '/' al final de la ruta)
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

#### Creación de la estructura

Para crear la estructura de directorios del Gitbook ejecutamos:
```shell
proyecto-alex-moi -c nombre_directorio -u https://github.com/usuario/ejemplo.git
```
Elija la **opcion 2**.

Una vez instalado y ejecutado, en la carpeta que se ha creado hacemos:

```shell
npm install
gulp build
git init 
heroku git:remote -a nombreapp 
gulp deploy-heroku
```
LLegados a este punto ya tendremos nuestra aplicación en heroku desplegada y funcionando.

#### Uso de la aplicación

Podrá disponer de un servicio web donde se puede:
 1. Registrar y mostrar los datos de un usuario
 2. Acceder al **book** de la aplicación 
 3. Descargar el book en pdf 

En el caso de ser administrador también se permite:
 5. Añadir/borrar cuentas de usuario
 6. Establecer permisos de administrador a un usuario
 7. Eliminar dichos privilegios de un usuario que los posea.

En la base de datos se encuentra creada una cuenta con el siguiente email: **admin@gmail.com**, que es el admin de la aplicación. Es **IMPORTANTE** que entre en la cuenta de este usuario con ese email y password: admin y modifique la password del mismo dado que sino cualquier usuario podrá acceder a ella como admin y manipularla a su antojo.

 
####Google authentication
Los pasos a seguir para conseguir la autenticación mediante google en la aplicación son los descritos en el siguiente tutorial:  [Documentación](https://developers.google.com/identity/sign-in/web/devconsole-project) 

Los formatos de las rutas de origen deben ser similares a estos:

 - c9:         http://nameworkspace.c9users.io:8080
 - localhost:  http://localhost:8080
 - heroku:     https://nameapp.herokuapp.com

Los formatos de las rutas de callback deben ser similares a estos:

 - c9:         http://nameworkspace.c9users.io:8080/auth/google/callback
 - localhost:  http://localhost:8080/auth/google/callback
 - heroku:     https://nameapp.herokuapp.com/auth/google/callback
        
Una vez hecho esto bastará con copiar nuestro id, secret y callback en el fichero auth.js y luego **descargar el json** y meterlo en nuestro directorio. Es importante añadir el json(sección credenciales de la página) a nuestro directorio puesto que sino la autenticación mediante google no funcionará.


####Facebook authentication
Los pasos a seguir para poner en funcionamiento la autenticacion con facebook son los que se exponen a continuación.

Lo primero será dirigirnos a la web [Facebook developers](https://developers.facebook.com/) y registrarnos en la pagina, te pedirá si aun no lo tienes hecho que confirmes tu cuenta mediante el envío de un código de verificación al móvil. 

Una vez estas registrado, creas una nueva aplicación en la sección *mis aplicaciones* y te saldrá un cuadro como este : 
![enter image description here](https://i.gyazo.com/9a06944da5dd01f90eaef829892c0165.png)

    
Rellenamos nuestro tu correo, nombre de aplicación y en categoría seleccionamos 'aplicaciones para paginas'. A continuación introducir el captcha que nos pide.
    
En el menu de la izquierda de la pagina a la que nos redirecciona ir a *Revisión de la Aplicación*. Marcar SI donde se pregunta ¿Quieres que tu aplicación sea pública?.
    
A continuación hacer click en el menu de la izquierda en *Panel*. Luego copiamos nuestro id y nuestro secret en el fichero auth.js de nuestro directorio, cada uno en su correspondiente lugar y añadimos la callback

Los formatos de las rutas de callback deben ser similares a estos:

 -  c9:         http://nameworkspace.c9users.io:8080/auth/facebook/callback
 - localhost:  http://localhost:8080/auth/facebook/callback
 - heroku:     https://nameapp.herokuapp.com/auth/facebook/callback
        
        
Volviendo a la pagina de developers de facebook en la sección de *Panel* hacemos clic en *Elegir plataforma* y luego clic en *Sitio Web*. Esto nos redirecciona a otra pagina, en ésta lo único que debemos hacer es dirigirnos al final del todo, a esta sección: 
![](https://i.gyazo.com/7983d6b7dfd016eb7e8dae061f5d6a5d.png) 

Y colocar la url de nuestra página por ejemplo, continuando con los ejemplos anteriores, la url debería tener la forma siguiente:

 -  c9:         http://nameworkspace.c9users.io:8080
 - localhost:  http://localhost:8080
 - heroku:     https://nameapp.herokuapp.com


## Depliegue
* Heroku: [https://proyecto-sytw-alex-moi.herokuapp.com/](https://proyecto-sytw-alex-moi.herokuapp.com/) 

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