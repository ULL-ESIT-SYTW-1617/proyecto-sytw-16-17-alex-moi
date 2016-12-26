module.exports = function(app, passport) {

var express = require("express");
var path	= require('path');
var bcrypt	= require("bcrypt-nodejs")
var models	= require('./models/models.js');
var fs		= require('fs');
var pdf 	= require('pdfcrowd');

// normal routes ===============================================================

	// show the home page (will also have our login links)
	app.get('/', function(req, res) {
		res.render('index');
	});
	
	app.get('/home', isLoggedIn,function(req, res) {
		res.render('home',{user: req.user});
	});

	// LOGOUT ==============================
    app.get('/salir',
        (req,res)=>{
            req.logout();
            res.redirect('login')
    });
    
    app.get('/respuesta',
      (req, res) => {
		app.get('/gh-pages',express.static('gh-pages'))
		res.sendFile(path.join(__dirname, '..','gh-pages', 'index.html'));
    });
    
    app.get('/error',
        function(req, res) {
            res.render('error', {error: 'Usuario y contraseña incorrecta'})
    });


// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

	//locally
		// LOGIN =================================
		app.get('/login', function(req, res) {
			res.render('login.ejs', { message: req.flash('loginMessage') });
		});
		
		
		app.post('/login',function(req, res)
		{
			// Comprobar si el usuario ya existe!
			console.log(req.body.email)
			models.User.find({where: {email: req.body.email}})
			.then((usuario) =>
			{
				if(usuario){
					var pass = req.body.password;
					var hash = usuario.password;
					
					if(usuario.password === 'admin'){						//por si eres el usuario con contraseña admin sin encriptar osea el que crea la app
						if(usuario.name === 'admin' && usuario.admin==1){	//para comprobar que efectivamente es el usuario admin
							if (usuario.password == pass)
							    res.render('home',{user: usuario});
							else
								res.render('error', { error: 'No coinciden las contraseñas. Vuelva a intentarlo' });
						}
						else{
							res.render('error', { error: 'Los credenciales no coinciden. ¿Eres el usuario admin?' });	
						}
					}
					else{
						var iguales = bcrypt.compareSync(pass, hash);
						console.log("hash: "+hash);
						console.log("pass: "+pass);
						console.log("iguales: "+ iguales);
						
						if (usuario && iguales)
						    res.render('home',{user: usuario});
						else
							res.render('error', { error: 'No coinciden las contraseñas. Vuelva a intentarlo' });
					}	
				}
				else 
				  res.render('error', { error: 'El usuario indicado no existe. Vuelva a intentarlo' });
			});
		});


		// SIGNUP =================================
		// show the signup form
		app.get('/signup', function(req, res) {
			res.render('signup.ejs', { message: req.flash('loginMessage') });
		});

		// signup user
		app.get('/signuppost',  function(req, res)
		{
			var boole = false;
			// Comprobar si el usuario ya existe!
			console.log(req.query.email)
			models.User.find({where: {email: req.query.email}})
			.then((user) =>
			{
				if (user) {
					boole = true;
				    //return (user);
				    console.log(user)
				    res.render('error',{error: 'El email ya está cogido'})
				}
				else 
				{
					console.log(user)
					res.render('error',{error: 'El username ya está cogido'})
				}
				  
			});
			
			if(boole ==false){			// Si no existe registrarlo!
				models.User.create(
				{
					name:		req.query.nombre,
				    username:	req.query.username,
				    email:		req.query.email,
				    password:	req.query.password,
				    edad:		req.query.edad,
				    auth:		0,
				    admin:		0,
				    avatar:		"./images/avatar.jpg"
				    
				}).then((user)=> {
					console.log(user)
					res.render('home',{user: user});
				});
			}
		});


		// google ---------------------------------
		// send to google to do the authentication
		app.get('/auth/google',
		  passport.authenticate('google', { scope: 
		    [ 'https://www.googleapis.com/auth/plus.login',
		    , 'https://www.googleapis.com/auth/plus.profile.emails.read' ] }
		));
		
		app.get( '/auth/google/callback', 
		    	passport.authenticate( 'google', { 
		    		successRedirect: '/home',
		    		failureRedirect: '/login'
		}));
		
		

		// Facebook ---------------------------------
		app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'user_about_me'] }));

		app.get('/auth/facebook/callback', 
			passport.authenticate('facebook', { 
				successRedirect: '/home', 
		    	failureRedirect: '/login'
		}));


// =============================================================================
// MODIFICACION BASE DE DATOS ==================================================
// =============================================================================

	app.get('/modificacion', (req,res) =>{
	  res.render('modificacion')
	})
	
	app.get('/modificacion/password', function(req,res){
		models.User.find({where: {email: req.query.email}})
			.then((usuario) =>
			{
				
				if(usuario){
					var pass = req.query.pass;
					var hash = usuario.password;
					
					if(usuario.password === 'admin'){						//por si eres el usuario con contraseña admin sin encriptar osea el que crea la app
						if(usuario.name === 'admin' && usuario.admin==1){		//para comprobar que efectivamente es el usuario admin
							if (usuario.password == pass){
								usuario.updateAttributes({
						          password: req.query.pass2
						    	})
						    	res.redirect('/login');
							}
							else
								res.render('error', { error: 'No coinciden las contraseñas. Vuelva a intentarlo' });
						}
						else{
							res.render('error', { error: 'Los credenciales no coinciden. ¿Eres el usuario admin?' });	
						}
					}
					else{
						var iguales = bcrypt.compareSync(pass, hash);
						console.log("hash: "+hash);
						console.log("pass: "+pass);
						console.log("iguales: "+ iguales);
						
						if (usuario && iguales){
					    	usuario.updateAttributes({
					          password: req.query.pass2
					    	})
					    	
					    	res.redirect('/login');
						}
						else
							res.render('error', { error: 'No coinciden las contraseñas. Vuelva a intentarlo' });
					}	
				}
				else 
				  res.render('error', { error: 'El usuario indicado no existe. Vuelva a intentarlo' });
		});
	
	});


	app.get('/administrar', (req,res) =>{
				
		models.User.findAll({})
		.then((users) =>
		{
			res.render('administrador.ejs',{
				usuarios: users
			});
			
	    });
	})

	app.get('/administrar/return', (req,res) =>{
		
		models.User.find({where: {email: req.query.email}})
			.then((user) =>
			{	
				if (user) {
					if(req.query.del){					// si se selecciona la opcion eliminar usuario
						
						user.destroy({
						    where: {
						    	email: req.query.email   
						    }
						})
					    res.redirect('/login');
						
					}
					else if(req.query.ad){					// si se seleccion convertir en admin
					    user.updateAttributes({
					    	admin : 1
					    });
					    res.redirect('/login');
					    
					}
					else if(req.query.delad){				// si se seleccion quitar posibilidad de administrar usuarios
					    user.updateAttributes({
					    	admin : 0
					    });
					    res.redirect('/login');				//redireccionamos a login por si el usuario al que se le quitan los privilegios es el propio usuario que ejecuta la accion
					}										//aunque este caso no deberia darse dado que parece absurdo, mejor prevenir =).
					else
						return (null);
				}
				else {
					
					if(req.query.add){					// si se selecciona la opcion añadir usuario nuevo
						var bol;
						if(req.query.si)
							bol = 1;
						else
							bol = 0;
						
						console.log("Entrar entra")
						console.log("Admin? "+ bol)
						models.User.create(
						{
							name:		req.query.nombre,
						    username:	req.query.username,
						    email:		req.query.email,
						    password:	req.query.password,
						    edad:		req.query.edad,
						    auth:		0,
						    admin:		bol,
				    		avatar:		"./images/avatar.jpg"
						    
						}).then((user)=> {
							console.log(user);
							res.redirect('/login');
						});
					}	
					
					res.redirect('/login');
				}
			});
	});
	

	app.get('/descargar', (req,res) =>{
		var bool;
		fs.existsSync(path.join(__dirname,'..','gh-pages','index.html')) ? bool=true : bool=false 
		
		if(bool){
			var saveToFile = function(fname) {
			    return {
			        pdf: function(rstream) { 
			            var wstream = fs.createWriteStream(fname);
			            rstream.pipe(wstream);
			        },
			        error: function(errMessage, statusCode) { console.log("ERROR: " + errMessage); },
			        end: function() { 
			        	res.download(path.join(__dirname, '..','gitbook.pdf'), function(err){
						if (err) {
							console.log("ERROR: "+err)
							res.redirect('/error')
						} else {
							res.render('home',{user: req.user});
						}
						});
			        },
			    };
			}
			
			var client = new pdf.Pdfcrowd("alu0100782851", "4d6fa69e599df42d747d8ca9e0157457");
			client.convertFile('./gh-pages/index.html', saveToFile('gitbook.pdf'));
		}
		else{
			res.render('error',{error: 'No existe el fichero html'});	
		}
	})


};


// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/');
}