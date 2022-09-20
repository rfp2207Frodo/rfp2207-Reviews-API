/* eslint-disable no-param-reassign */
const db = require('../db');

function mapPhotos(review) {
  const queryPhotos = `SELECT id, url FROM review_photo WHERE review_id = ${review.review_id} LIMIT 5`;
  const date = new Date(0);
  date.setUTCSeconds(parseInt(review.date));
  review.date = date;
  review.photos = [];

  return db
    .query(queryPhotos)
    .then((res) => {
      review.photos = res.rows;
    })
    .catch((err) => console.log(err));
}

const get = async (product_id, sort, page, count) => {
  let sortQuery;
  switch (sort) {
    case 'relevant':
      sortQuery = 'ORDER BY helpfulness DESC, id ASC';
      break;
    case 'newest':
      sortQuery = 'ORDER BY id ASC';
      break;
    default:
      sortQuery = 'ORDER BY helpfulness ASC';
      break;
  }

  const queryReviews = `SELECT id AS review_id, rating, summary, body, recommend, response, body, date, reviewer_name, helpfulness
  FROM review WHERE product_id = ${product_id} AND reported = false
  ${sortQuery}
  OFFSET ${(page - 1) * count} LIMIT ${count}`;

  const client = await db.connect();
  const results = await client
    .query(queryReviews)
    .then(async (res) => {
      await Promise.all(res.rows.map(mapPhotos));
      client.release();
      return res.rows;
    })
    .catch((err) => {
      client.release();
      console.log(err);
    });

  return {
    product: product_id.toString(),
    page: page - 1,
    count,
    results,
  };
};

const post = async ({
  product_id,
  rating,
  summary,
  body,
  recommend,
  name,
  email,
  photos,
  characteristics,
}) => {
  const queryReview = `INSERT INTO review (product_id, rating, summary, body, recommend, reviewer_name, reviewer_email)
  VALUES (${product_id}, ${rating}, '${summary}', '${body}', ${recommend}, '${name}', '${email}')
  RETURNING id`;
  const queryProduct = `UPDATE product SET "${rating}" = "${rating}" + 1, "${recommend}" = "${recommend}" + 1
  WHERE id = ${product_id}`;

  const client = await db.connect();

  //  Room to optimize by inserting review, retrieving review id,
  //  then calling all other inserts/updates at the same time instead of
  //  doing awaits one at a time
  let error = false;

  const review_id = await client
    .query(queryReview)
    .then((res) => res.rows[0].id)
    .catch((err) => console.log(err));

  await client
    .query(queryProduct)
    .catch((err) => {
      error = true;
      return console.log(err);
    });

  Promise.all(photos.map(async (photo) => {
    const queryPhoto = `INSERT INTO review_photo (review_id, url)
    VALUES (${review_id}, '${photo}')`;
    await client
      .query(queryPhoto)
      .catch((err) => {
        error = true;
        return console.log(err);
      });
  }));

  Promise.all(Object.entries(characteristics).map(async (characteristic) => {
    const queryProductCharacteristic = `UPDATE product_characteristic SET "${characteristic[1]}" = "${characteristic[1]}" + 1
    WHERE id = ${characteristic[0]} AND product_id = ${product_id}`;
    const queryReviewCharacteristic = `INSERT INTO review_characteristic (characteristic_id, review_id, value)
    VALUES (${characteristic[0]}, ${review_id}, ${characteristic[1]})`;

    await client
      .query(queryProductCharacteristic)
      .then(() => client.query(queryReviewCharacteristic))
      .catch((err) => {
        error = true;
        return console.log(err);
      });
  }));

  client.release();
  return error;
};

exports.get = get;
exports.post = post;
