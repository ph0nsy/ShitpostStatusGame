require('dotenv').config();
const mysql = require('mysql');

const connection = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

connection.connect((error)=>{
    if(error){
        console.log('Error on database connection: ' + error);
        return;
    }
    console.log('Connected to database');
});
module.exports = connection;