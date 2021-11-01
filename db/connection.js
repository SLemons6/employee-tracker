require('dotenv').config();

const mysql = require('mysql2');

const createConnection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: 'employees'
});

module.exports = createConnection;