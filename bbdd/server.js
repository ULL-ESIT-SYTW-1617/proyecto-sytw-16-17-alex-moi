var port     = process.env.PORT || 8080;
var express  = require("express");
var app      = express();

var passport = require('passport');
var mongoose = require('mongoose');
var flash    = require('connect-flash');


var path          = require('path');
var logger        = require('morgan');
var cookieParser  = require('cookie-parser');
var bodyParser    = require('body-parser');
var session       = require('express-session');
var loginin       = require('connect-ensure-login').ensureLoggedIn;


mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/iaas');


// Configure view engine to render EJS templates.
app.set('view engine', 'ejs'); 


app.use(logger('combined'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // get information from html forms
app.use(flash());

app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions


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








