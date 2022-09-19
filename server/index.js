require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT;
const router = require('./router.js');
const db = require('./db.js');

app.use(express.json());

app.use('/reviews', router);

const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

process.on('SIGTERM', () => (
  server.close(async() => {
    await db.end();
    console.log('Server closed SIGTERM')
  })
));

process.on('SIGINT', () => (
  server.close(async() => {
    await db.end();
    console.log('Server closed SIGINT')
  })
));