const db = require('../db.js');

const put = async(review_id) => {
  let queryString = `UPDATE review SET helpfulness = helpfulness + 1 WHERE id = ${review_id}`;

  const client = await db.connect();
  return client
  .query(queryString)
  .then((result) => {
    client.release();
    return result;
  })
  .catch((err) => {
    client.release();
    return console.log(err)
  });
};

exports.put = put;