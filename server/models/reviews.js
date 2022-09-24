/* eslint-disable no-param-reassign */
const db = require('../db');

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

  const client = await db.connect();

  const queryReviews = `SELECT r.id AS review_id, r.rating, r.summary, r.body, r.recommend, r.response, r.body, r.date, r.reviewer_name, r.helpfulness,
  COALESCE((SELECT json_agg(json_build_object('id', id, 'url', url)) from review_photo AS rp WHERE rp.review_id = r.id), '[]') AS photos
  FROM review AS r WHERE r.product_id = ${product_id} AND r.reported = false
  ${sortQuery}
  OFFSET ${(page - 1) * count} LIMIT ${count}`;

  const results = await client
    .query(queryReviews)
    .then((result) => result.rows)
    .catch((err) => {
      console.log(err);
    });

  await client.release();

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

  await client.release();
  return error;
};

exports.get = get;
exports.post = post;
