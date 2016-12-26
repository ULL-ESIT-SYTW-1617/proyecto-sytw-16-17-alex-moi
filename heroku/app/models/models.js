var Sequelize = require('sequelize');
var path = require('path');

var sequelize = new Sequelize(null, null, null, {
  host: 'localhost',
  dialect: 'sqlite',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },

  // SQLite only
  storage: 'bbdd.sqlite' //ruta hasta la base de datos
});


var User = sequelize.import(path.join(__dirname,'usuarios.js'));
exports.User = User;