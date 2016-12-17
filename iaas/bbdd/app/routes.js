module.exports = function(app, passport) {

var express  = require("express");
var path          = require('path');
    
/* Traemos los esquemas para trabajar con ellos */
const User  = require('./models/user');

var usuario_global;

// normal routes ===============================================================

	// show the home page (will also have our login links)
	app.get('/', function(req, res) {
		res.render('index1.ejs');
	});


	// PROFILE SECTION =========================
	app.get('/home', isLoggedIn, function(req, res) {
		res.render('home.ejs', {
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

	
	
	//Mostrar datos del usuario
	/*app.get('/datos', function(req, res, next) {
		res.render('datos.ejs', {
			user : req.user
		});
		
		User.find({}, function(err, user) {
		    if(err)
		    	return err;
		    if(user)
				for(var i=0;i<user.length;i++){
					
					console.log("Email: "+user[i].local.email);
					
					if(user[i].local.email === req.query.email )
						
						if(req.query.pass == req.query.pass2){
							aux =true;
							var bcrypt   = require('bcrypt-nodejs');
							user[i].local.password = bcrypt.hashSync(req.query.pass, bcrypt.genSaltSync(8), null);
				            //user.local.password = req.query.pass;  
				
				            // save user
				            user[i].save(function(err) {
				                if (err)
				                    return(err);
				            });	
						}
						
						
				}
		})
	});*/
	
// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

	// locally --------------------------------
		// LOGIN ===============================
		// show the login form
		app.get('/login', function(req, res) {
			res.render('login.ejs', { message: req.flash('loginMessage') });
		});

		// process the login form
		app.post('/login', passport.authenticate('local-login', {
			successRedirect : '/home', // redirect to the secure profile section
			failureRedirect : '/login', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));

		// SIGNUP =================================
		// show the signup form
		app.get('/signup', function(req, res) {
			res.render('signup.ejs', { message: req.flash('loginMessage') });
		});

		// process the signup form
		app.post('/signup', passport.authenticate('local-signup', {
			successRedirect : '/home', // redirect to the secure profile section
			failureRedirect : '/signup', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));
		
		
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

	// locally --------------------------------
		app.get('/connect/local', function(req, res) {
			res.render('connect-local.ejs', { message: req.flash('loginMessage') });
		});
		app.post('/connect/local', passport.authenticate('local-signup', {
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
	app.get('/unlink/local', function(req, res) {
		var user            = req.user;
		user.local.email    = undefined;
		user.local.password = undefined;
		user.save(function(err) {
			res.redirect('/home');
		});
	});
	
	
	// google ---------------------------------
	app.get('/unlink/google', function(req, res) {
		var user          = req.user;
		user.google.token = undefined;
		user.save(function(err) {
			res.redirect('/profile');
		});
	});


// =============================================================================
// TRABAJANDO CON LA BBDD ======================================================
// =============================================================================

	app.get('/modificacion', function(req, res) {
		res.render('modificacion.ejs');
	});


	app.get('/modificacion/password', function(req, res, next) {
		

		console.log("email: " +req.query.email);
		
		User.find({}, function(err, user) {
			var aux;
            if (err)
                return(err);
			
			
			if(user)
				for(var i=0;i<user.length;i++){
					
					console.log("Email: "+user[i].local.email);
					
					if(user[i].local.email === req.query.email )
						
						if(req.query.pass == req.query.pass2){
							aux =true;
							var bcrypt   = require('bcrypt-nodejs');
							user[i].local.password = bcrypt.hashSync(req.query.pass, bcrypt.genSaltSync(8), null);
				            //user.local.password = req.query.pass;  
				
				            // save user
				            user[i].save(function(err) {
				                if (err)
				                    return(err);
				            });	
						}
						
						
				}
				if(!aux)
					res.redirect('/modificacion')
				else
					res.redirect('/home');
        });

	});
	
	app.get('/informacion',function(req, res) {
		res.render('datos.ejs', {
			user : req.user
		});
    });
	
	app.get('/loginadmin',function(req, res) {
	    res.render('loginadmin.ejs');
	})

	app.post('/loginadmin', passport.authenticate('local-login-admin', {
		successRedirect : '/admin', // redirect to the secure profile section
		failureRedirect : '/loginadmin', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	app.get('/admin',function(req, res) {
	    res.render('admin.ejs');
	})
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/');
}