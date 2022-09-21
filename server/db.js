require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.HOST,
  user: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.SQLPORT,
});
module.exports = pool;
