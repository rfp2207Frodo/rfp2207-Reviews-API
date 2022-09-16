require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT;
// const { get } = require('./controllers/index.js');
const router = require('./router.js');
/* IMPORT MODELS AND CONTROLLERS */

/* SET UP MIDDLEWARE */

app.use(express.json());

/* SET UP ROUTES */

app.use('/reviews', router);

/*

app.get('/reviews', (req, res) => {
  // console.log(req);
  // let { product_id, sort, page, count } = req.query;
  // console.log(product_id);
  // console.log(sort);
  // console.log(page);
  // console.log(count);
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

*/

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});