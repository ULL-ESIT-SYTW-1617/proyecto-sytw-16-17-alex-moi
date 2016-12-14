var LocalStrategy    = require('passport-local').Strategy;
var GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy;

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
    passport.serializeUser(function(user, cb) {
      cb(null, user);
    });
    
    passport.deserializeUser(function(user, cb) {
        cb(null, user);
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



    //              REVISAR
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

        // asynchronous
        process.nextTick(function() {

            // check if the user is already logged in
            if (!req.user) {

                Model.User.findOne({where: {
                    'google.id' : profile.id
                }}, function(err, user) {
                    if (err)
                        return done(err);

                    if (user) {

                        // if there is a user id already but no token (user was linked at one point and then removed)
                        if (!user.google.token) {
                            user.google.token = token;
                            user.google.name  = profile.displayName;
                            user.google.email = profile.emails[0].value; // pull the first email

                            user.save(function(err) {
                                if (err)
                                    throw err;
                                return done(null, user);
                            });
                        }

                        return done(null, user);
                    } else {
                        var newUser          = new User();

                        newUser.google.id    = profile.id;
                        newUser.google.token = token;
                        newUser.google.name  = profile.displayName;
                        newUser.google.email = profile.emails[0].value; // pull the first email

                        newUser.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });

            } else {
                // user already exists and is logged in, we have to link accounts
                var user               = req.user; // pull the user out of the session

                user.google.id    = profile.id;
                user.google.token = token;
                user.google.name  = profile.displayName;
                user.google.email = profile.emails[0].value; // pull the first email

                user.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, user);
                });

            }

        });

    }));   
    
    
    
    
    
    
    
    
    
    
    
    
};