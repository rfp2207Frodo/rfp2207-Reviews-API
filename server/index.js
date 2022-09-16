require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT;
/* IMPORT MODELS AND CONTROLLERS */

/* SET UP MIDDLEWARE */

app.use(express.json());

/* SET UP ROUTES */

app.get('/reviews', (req, res) => {
  res.sendStatus(501);
});

app.get('/reviews/meta', (req, res) => {
  res.sendStatus(501);
});

app.post('/reviews', (req, res) => {
  res.sendStatus(501);
});

app.put('/reviews/:review_id/helpful', (req, res) => {
  res.sendStatus(501);
});

app.put('/reviews/:review_id/report', (req, res) => {
  res.sendStatus(501);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});