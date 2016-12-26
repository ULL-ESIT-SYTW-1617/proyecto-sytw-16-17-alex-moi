var Sequelize = require('sequelize');
var bcrypt = require("bcrypt-nodejs");

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('User', { 
            id :{
                type: Sequelize.INTEGER
            },
            token: {
                type: DataTypes.STRING             
            },
            name: {
                type: DataTypes.STRING
            },
            username: {
                type: DataTypes.STRING,
                unique: true
            },
            edad: {
                type: DataTypes.INTEGER
            },
            auth:{
                type: DataTypes.INTEGER
            },
            avatar:{
                type: DataTypes.STRING
            },
            admin: {
                type: DataTypes.INTEGER
            },
            email: { //Clave primaria
                type: Sequelize.STRING,
                unique: true,
                primaryKey: true
            },
            password: {
                type: DataTypes.STRING,
                set: function (password) {
                     var hash = bcrypt.hashSync(password);
                     this.setDataValue('password', hash);
                }
            }
        },{
            tableName: 'USER'
        });
};