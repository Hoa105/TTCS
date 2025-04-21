require("dotenv").config();
const mysql = require("mysql2/promise");
// const connection = mysql.createConnection({
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     user: process.env.DB_USER,
//     password:process.env.DB_PASSWORD,
//     database:process.env.DB_DATA
// })

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATA,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: "utf8mb4",
  timezone: "+07:00",
  // jwt: process.env.JWT_SECRET,
});

module.exports = connection;
