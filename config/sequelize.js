const sequelize = require('sequelize');


module.exports = new sequelize({
    dialect: 'mysql',
    host: 'localhost',
    username: 'root',
    database: 'jkpgcity',
    password: '',
});