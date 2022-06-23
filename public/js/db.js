require('dotenv').config();
// Use the MariaDB Node.js Connector
var mariadb = require('mariadb');
 
// Create a connection pool
var pool = mariadb.createPool({
    connectionLimit: 10,
    host: "mysql-npr24x.alwaysdata.net",//process.env.DB_HOST,
    user: "npr24x_usuario",//process.env.DB_USER,
    password: "proyectos2",//process.env.DB_PASS,
    database: "npr24x_proyectos",//process.env.DB_NAME,
    multipleStatements: true
});

// Expose a method to establish connection with MariaDB SkySQL
module.exports = Object.freeze({
  pool: pool
});