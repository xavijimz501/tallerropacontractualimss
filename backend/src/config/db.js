
const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
dotenv.config();

const mysqlConnect = mysql.createPool({
  user: process.env.MYSQL_USER || "sabg2025",
  host: process.env.MYSQL_HOST || "172.25.30.65",
  database: process.env.MYSQL_DB || "mindbuengob",
  password: process.env.MYSQL_PASS || "sabg2025admin",
  port: Number(process.env.MYSQL_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = mysqlConnect;
