module.exports = function(app, passport) {

var express  = require("express");
var path          = require('path');
var Dropbox = require('dropbox');
var bcrypt = require("bcrypt-nodejs")
var Dropbox2 = require("node-dropbox")
var config = require(path.resolve(process.cwd(),".datos_dropbox.json"));
var api = Dropbox2.api(config.token_dropbox);

// normal routes ===============================================================

	// show the home page (will also have our login links)
	app.get('/', function(req, res) {
		res.render('index1.ejs');
	});


	// PROFILE SECTION =========================
	app.get('/home', isLoggedIn, function(req, res) {
		res.render('home', {
			user : req.user
		});
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

		//dropbox file ---------------------------
		app.get('/login',  (req, res) => {
			if (req.isAuthenticated()) return res.redirect('/error')
			res.render('index')
		})
		
		
		app.post('/login', 
			passport.authenticate('local', { failureRedirect: '/error' }),
			function(req, res) {
				res.redirect('/home');
		});


		// google ---------------------------------
		// send to google to do the authentication
		app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

		// the callback after google has authenticated the user
		app.get('/auth/google/callback',
			passport.authenticate('google', {
				successRedirect : '/home',
				failureRedirect : '/fail'
			}));


// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

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
	  
	  var existe= false;
	  var j;
	  
	  var user = req.query.username;
	  var pass = req.query.password;
	  var contenido;
	  
	  var hash = bcrypt.hashSync(pass);
	  //var pass_encritada = bcrypt.compareSync(pass, hash);
	  //console.log("Usuario!!!!!!!!!!!!!!!  "+ user );
	 // console.log("Contraseñaa!!!!!!!!!!  "+ hash);
	  
	  api.getFile('/'+config.ruta_dropbox+'.json', (err,response,body) => {
	       
	        for(var i=0; i<body.length;i++){
	           if(user === body[i].usuario){
	              body[i].pass = hash;
	           }
	         }
	        console.log(body)
	        contenido= JSON.stringify(body,null,' ');
	        console.log(contenido)
	     
	      api.removeFile('/'+config.ruta_dropbox+'.json', function(err, response, body){
	      
	        var  dbx = new Dropbox({ accessToken: config.token_dropbox });
	        dbx.filesUpload({path: '/'+config.ruta_dropbox+'.json', contents: contenido});
	        res.redirect('/home')
	      })
	    });
	  
	
	});



};


// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/');
}