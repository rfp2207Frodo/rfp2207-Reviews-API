require('dotenv').config();

const { Pool } = require('pg');
const pool = new Pool({
  host: process.env.HOST,
  port: process.env.SQLPORT,
  database: process.env.DATABASE,
  user: process.env.USER,
  password: process.env.PASSWORD
});
module.exports = pool;

// const { Client } = require('pg');
// const client = new Client({
//   host: process.env.HOST,
//   port: process.env.SQLPORT,
//   database: process.env.DATABASE,
//   user: process.env.USER,
//   password: process.env.PASSWORD
// });

// module.exports = client;