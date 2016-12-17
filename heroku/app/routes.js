module.exports = function(app, passport) {

var express  = require("express");
var path          = require('path');
var bcrypt = require("bcrypt-nodejs")
var models = require('./models/models.js');


// normal routes ===============================================================

	// show the home page (will also have our login links)
	app.get('/', function(req, res) {
		res.render('index');
	});
	
	app.get('/home', function(req, res) {
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
    
    
	app.get('/invitado', (req, res) => {
		app.get('/gh-pages',express.static('gh-pages'))
		res.sendFile(path.join(__dirname, '..','gh-pages', 'index.html'));
	})
    
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
				var pass = req.body.password;
				var hash = usuario.password;
				var iguales = bcrypt.compareSync(pass, hash);
				console.log("hash: "+hash);
				console.log("pass: "+pass);
				console.log("iguales: "+ iguales);
				
				if (usuario && iguales)
				    res.render('home',{user: usuario});
				else 
				  res.render('login', { message: req.flash('loginMessage') });
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
			// Comprobar si el usuario ya existe!
			console.log(req.query.email)
			models.User.find({where: {email: req.query.email}})
			.then((user) =>
			{
				if (user) 
				    return (user);
				else 
				  return (null);
			});
			
			// Si no existe registrarlo!
			models.User.create(
			{
				name:		req.query.nombre,
			    username:	req.query.username,
			    email:		req.query.email,
			    password:	req.query.password,
			    edad:		req.query.edad
			    
			}).then((user)=> {
				console.log(user)
				res.render('home',{user: user});
			})
			.catch((err)=>
			    {
			      if(err)
					{
					console.log("Err:" + err);
					err = "No se ha creado el usuario: "+ err ;
					res.redirect('/error');
					}
			});
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
		app.get('/auth/facebook', passport.authenticate('facebook'));

		app.get('/auth/facebook/callback', 
			passport.authenticate('facebook', { 
				successRedirect: '/home', 
		    	failureRedirect: '/login' 
		}));



// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================
	
	// locally --------------------------------
		app.get('/connect/local', function(req, res) {
			res.render('connect-local.ejs', { message: req.flash('loginMessage') });
		});
		app.post('/connect/local', passport.authenticate('local', {
			successRedirect : '/home', // redirect to the secure profile section
			failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));



	// google ---------------------------------

		// send to google to do the authentication
		app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

		// the callback after google has authorized the user
		app.get('/connect/google/callback',
			passport.authorize('google', {
				successRedirect : '/profile',
				failureRedirect : '/fail'
		}));



// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

	// local -----------------------------------
	/*app.get('/unlink/local', function(req, res) {
		var user            = req.user;
		user.local.email    = undefined;
		user.local.password = undefined;
		user.save(function(err) {
			res.redirect('/home');
		});
	});*/
	
	// google ---------------------------------
	app.get('/unlink/google', function(req, res) {
		var user          = req.user;
		user.google.token = undefined;
		user.save(function(err) {
			res.redirect('/profile');
		});
	});
	


// =============================================================================
// MODIFICACION FICHEROS DROPBOX ===============================================
// =============================================================================

	app.get('/modificacion', (req,res) =>{
	  res.render('modificacion')
	})
	
	app.get('/modificacion/password', function(req,res){
		models.User.find({where: {email: req.query.email}})
			.then((user) =>
			{
				if (user) {

					var pass = req.query.pass;
					var hash = user.password;
					var iguales = bcrypt.compareSync(pass, hash);
					console.log("\nUser: "+user.password)
					console.log("\niguales: "+ iguales)
					console.log("\n\n")
					
					if(iguales){
				    	user.updateAttributes({
				          password: req.query.pass2
				    	})
				        
				    res.redirect('/login');
					}
				}
				else 
				  return (null);
		});
	
	});



};


// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/');
}