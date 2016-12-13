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

var Dropbox = require('dropbox');
var bcrypt = require("bcrypt-nodejs")
var Dropbox2 = require("node-dropbox")

var config = require(path.resolve(process.cwd(),".datos_dropbox.json"));

var api = Dropbox2.api(config.token_dropbox);



passport.use(new Strategy(
  function(username,password,cb,err){
    var existe= false;
    var j;
    var hash;
   
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

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(user, cb) {
    cb(null, user);
});






// Configure view engine to render EJS templates.
app.set('view engine', 'ejs'); 
app.use(express.static(__dirname + '/public'));


app.use(logger('combined'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));


app.use(passport.initialize());
app.use(passport.session());


app.use(passport.initialize());
app.use(passport.session());





app.get('/login',  (req, res) => {
  if (req.isAuthenticated()) return res.redirect('/error')
  res.render('index')
})


app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/error' }),
  function(req, res) {
   
    res.redirect('/home');
  });

app.get('/error',
  function(req, res) {
      res.render('error', {error: 'Usuario y contraseña incorrecta'})
  }
  

);

app.get('/home', (req,res) =>{
  res.render('home', { user: req.user })
})

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
app.get('/respuesta',
  (req, res) => {
    res.redirect('/');
  });


app.get('/salir',
  (req,res)=>{
    req.logout();
    res.redirect('login')
  });


app.get('/invitado', (req, res) => {
  app.get('/gh-pages',express.static('gh-pages'))
  res.sendFile(path.join(__dirname, 'gh-pages', 'index.html'));
})


app.get('/assets/*',express.static('assets'));
app.get('*', loginin('/login'), express.static('gh-pages'));
app.use((req, res) => res.render('error', {error: 'No te olvides de publicar el libro!!!!'}));






app.listen(port);

console.log('The magic happens on port localhost:' + port);








