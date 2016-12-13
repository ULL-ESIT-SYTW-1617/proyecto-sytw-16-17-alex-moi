var express = require("express");
var app = express();
var path = require('path');



app.set('port', (process.env.PORT || 8080));
app.use(express.static(__dirname + '/gh-pages/'));
//app.use(express.static(path.join(__dirname,'gh-pages')));


app.get('/', function(request, response){
  response.sendFile('index.html');
});

app.listen(app.get('port'), function() {
  console.log('Servidor en funcionamiento en el puerto 8080');
});