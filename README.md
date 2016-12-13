# Sistemas y Tecnologías Web. Crear repositorio en github

## Introducción

El objetivo de esta práctica es extender el package NodeJS publicado en npm en una práctica anterior con una nueva funcionalidad que permita que los usuarios con conocimientos de NodeJS puedan extender la conducta del ejecutable para que este cree un repositorio en **GitHub**.

Para ello, el plugin utilizado se puede encontrar en [gitbook-start-github-alex-moi](https://www.npmjs.com/package/gitbook-start-github-alex-moi).

##Instalación

```shell
npm install -g gitbook-start-alex-moi-nitesh
```

##Tutorial para su ejecución

Para ejecutar, ponemos el siguiente comando:

`gitbook-start-alex-moi-nitesh [opciones]`

[opciones] serían:
*    -a: Especificar el autor del gitbook
*    -n: Especificar el nombre del gitbook
*    -c: Especificar el nombre del directorio donde crear el gitbook
*    -u: Especificar la url del repositorio git
*    -h: Help (ayuda)
*    -d: Realizar un deploy a (IaaS, Heroku o Github)

**Nota:** Primero debe crearse la estructura de directorios del gitbook con el argumento '-c' y luego, situado dentro del gitbook, realizar un deploy con el argumento '-d'. Ambos argumentos **NO** pueden ser ejecutados conjuntamente.

Para crear la estructura de directorios del Gitbook ejecutamos:
```shell
gitbook-start-alex-moi-nitesh -c Book
```

Una vez instalado y ejecutado, hacemos:

```shell
npm install
gitbook install
```

Una vez completado los "ficheros.md" de nuestro GitBook, para construirlo y publicarlo en github (gh-pages) hacemos:

```shell
gulp build
gulp deploy
```

Un ejemplo de la versión final del gitbook sería: [Ejemplo](https://alu0100782851.github.io/prueba/)

##Funcionamiento del argumento "-d"

Este argumento se corresponde con la opción del deploy en el iaas, heroku o github y **sólo** puede ejecutarse para cada caso como se especifica a continuación.


**IaaS**
 : Para hacer el despliegue en el IaaS es necesario proporcionar dos argumentos mas que deben ser especificados obligatoriamente, ademas de los restantes de los que dispone el paquete.

 Por tanto, se ejecutaría el siguiente comando desde el directorio que contiene nuestro gitbook:
`gitbook-start-alex-moi-nitesh -d iaas-ull-es [Obligatorias]`

 [Obligatorias] serían:
 ```
--iaas_ip: Especificar la IP del IaaS
			Ejemplo: 10.2.1.128
--iaas_path: Especificar la PATH de IaaS(sin '/' al final de la ruta)
			Ejemplo: /home/nombre_usuario/ruta
 ```

**Heroku**
 : Para hacer el despliegue en heroku bastará con especificar la opcion -d seguido de 'heroku'.

 Por tanto, se ejecutaría el siguiente comando desde el directorio que contiene nuestro gitbook:
`gitbook-start-alex-moi-nitesh -d heroku`
 

**Github**
 : Para hacer el despliegue en Github bastará con especificar la opción -d seguido de 'github'.

 Por tanto, se ejecutaría el siguiente comando desde el directorio que contiene nuestro gitbook:
`gitbook-start-alex-moi-nitesh -d github`


## Versiones de paquetes a descargar para esta practica
* Paquete principal: **v1.2.66**
* Paquete IAAS: **v1.2.12**
* Paquete Heroku-token: **v0.1.28**
* Paquete Heroku-token-oauth: **v0.0.12**
* Paquete Heroku-localstrategy **v0.0.24**
* Paquete github: **v0.1.8**
* Paquete https: **v0.0.8**

## Enlaces importantes
*  [Página en NPM gitbook-start-alex-moi-nitesh](https://www.npmjs.com/package/gitbook-start-alex-moi-nitesh)
*  [Página en NPM gitbook-start-iaas-ull-es-alex-moi Plugin](https://www.npmjs.com/package/gitbook-start-iaas-ull-es-alex-moi)
*  [Página en NPM gitbook-start-heroku-alex-moi Plugin](https://www.npmjs.com/package/gitbook-start-heroku-alex-moi)
*  [Página en NPM gitbook-start-heroku-token-alex-moi Plugin](https://www.npmjs.com/package/gitbook-start-heroku-token-alex-moi)
*  [Página en NPM gitbook-start-heroku-token-oauth-alex-moi Plugin](https://www.npmjs.com/package/gitbook-start-heroku-token-oauth-alex-moi)
*  [Página en NPM gitbook-start-heroku-localstrategy-alex-moi Plugin](https://www.npmjs.com/package/gitbook-start-heroku-localstrategy-alex-moi)
*  [Página en NPM gitbook-start-github-alex-moi Plugin](https://www.npmjs.com/package/gitbook-start-github-alex-moi)
*  [Página en NPM gitbook-start-https-alex-moi Plugin](https://www.npmjs.com/package/gitbook-start-https-alex-moi)
*  [Repositorio GitHub](https://github.com/ULL-ESIT-SYTW-1617/crear-repositorio-en-github-alex-moi)
*  [Descripción de la práctica](https://casianorodriguezleon.gitbooks.io/ull-esit-1617/content/practicas/practicagithubapi.html)
*  [Campus Virtual](https://campusvirtual.ull.es/1617/course/view.php?id=1175)

## Autores

* Alexander Cole Mora | [Página Personal](http://alu0100767421.github.io/)
* Moisés Yanes Carballo | [Página Personal](http://alu0100782851.github.io/)