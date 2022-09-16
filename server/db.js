require('dotenv').config();
const { Client } = require('pg');
const client = new Client({
  host: process.env.HOST,
  port: process.env.SQLPORT,
  database: process.env.DATABASE,
  user: process.env.USER,
  password: process.env.PASSWORD
})


async function initializeDB() {
  await client.connect();

  client
  .query('SELECT * FROM review LIMIT 5')
  .then((res) => {
    console.log(res.rows)
    client.end();
  })
  .catch((err) => {
    console.log(err)
    client.end();
  });
}

initializeDB();

// await client.query(`SELECT * FROM review LIMIT 5`, (err, res) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(res.data);
//   }
// });