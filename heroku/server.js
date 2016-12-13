var port     = process.env.PORT || 8080;
var express = require("express");
var app      = express();
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var loginin = require('connect-ensure-login').ensureLoggedIn;
var flash    = require('connect-flash');

var bcrypt = require("bcrypt-nodejs");
var Dropbox2 = require("node-dropbox");
var config = require(path.resolve(process.cwd(),".datos_dropbox.json"));
var api = Dropbox2.api(config.token_dropbox);



passport.use(new Strategy(
  function(username,password,cb,err){
    var existe= false;
    var j;
   
    api.getFile('/'+config.ruta_dropbox+'.json', (err,response,body) => {
        
        
        for(var i=0; i<body.length;i++){
            if(username === body[i].usuario){
                existe = true;
                console.log(existe);
                j = i;
                console.log(i)
            }
         }
         
        if(!existe)
            return cb(null,false);
            
        var pass_encritada = bcrypt.compareSync(password, body[j].pass);
          
          
        //if(hash === body[j].pass)
        if(pass_encritada)
            return cb(null, username);
        else
            return cb(null,false);
    });
   
}));


// Configure view engine to render EJS templates.
app.set('view engine', 'ejs'); 
app.use(express.static(__dirname + '/public'));


app.use(logger('combined'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // get information from html forms
app.use(flash());
app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());


app.use(express.static(__dirname + '/app'));
app.use(express.static(__dirname + '/public'));



// routes ======================================================================
require('./app/routes.js')(app, passport);  // load our routes and pass in our app and fully configured passport
require('./config/passport')(passport);     // pass passport for configuration


app.get('/assets/*',express.static('assets'));
app.get('*', loginin('/login'), express.static('gh-pages'));
app.use((req, res) => res.render('error', {error: 'No te olvides de publicar el libro!!!!'}));


app.listen(port);
console.log('The magic happens on port localhost:' + port);








