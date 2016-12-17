var LocalStrategy    = require('passport-local').Strategy;
var GoogleStrategy   = require( 'passport-google-oauth2' ).Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

var bcrypt = require('bcrypt-nodejs');
var Model       = require('../app/models/models.js');

// load the auth variables
var configAuth = require('./auth'); // use this one for testing


module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
      done(null, user);
    });
    
    passport.deserializeUser(function(obj, done) {
      done(null, obj);
    });


    // =========================================================================
    // LOCALLY =================================================================
    // =========================================================================
    passport.use(new LocalStrategy(
        function(email, password, cb) {
            Model.User.find({where: {
                email: email
            }})
            .then((user) => {
                if(user) {
                    if(bcrypt.compareSync(password, user.password))
                    {
                      return cb(null,user);
                    }
                    else
                    {
                      console.log("Oops! Wrong password.");
                      return cb("Oops! Wrong password.",false);
                    }
                }
                else
                {
                  console.log("No user found.");
                  return cb("No user found.",false);
                }
            });
        }
    ));



   
    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    passport.use(new GoogleStrategy({

        clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL,
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
        
      },
      function(req, token, refreshToken, profile, done) {
        
        process.nextTick(function () {
          
            // check if the user is already logged in
            if (!req.user) {
                console.log("entrooo")
                
                // Comprobar si el usuario ya existe!
                Model.User.find({where: {
                    email: profile.emails[0].value
                }})
                .then((user) => {
                    if(user) {
                        if (!user.token) {// if there is a user id already but no token (user was linked at one point and then removed)
                            user.updateAttributes({
                                token   : token,
                                name    : profile.displayName,
                                email   : profile.emails[0].value // pull the first email
				    	    })
                        }
				    	return done(null, user);
                    }
                    else
                    {
                        Model.User.create(
            			{
            				id:		profile.id,
            			    token:	token,
            			    email:	profile.emails[0].value,
            			    name:	profile.displayName
            			    
            			}).then((user)=> {
            				console.log("User new: "+user)
            				return done(null, user);
            			})
                    }
                });
    			
            } else {
                console.log("error")
                // user already exists and is logged in, we have to link accounts
                var user               = req.user; // pull the user out of the session

                user.id    = profile.id;
                user.token = token;
                user.name  = profile.displayName;
                user.email = profile.emails[0].value; // pull the first email
            }
        
          //return done(null, profile);
        });
      }
    ));
    
    
    
    
    passport.use(new FacebookStrategy({
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL,
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
        
    }, function(accessToken, refreshToken, profile, done) {
        
        Model.User.find({id: profile.id}, function(err, user) {
            if(err) throw(err);
            
            if(!err && user) return done(null, user);

                Model.User.create(
    			{
    				id:		profile.id,
    			    name :  profile.displayName
    			    
    			}).then((user)=> {
    				console.log("User new: "+user)
    				return done(null, user);
    			})
                            
            });
    })); 
    
};