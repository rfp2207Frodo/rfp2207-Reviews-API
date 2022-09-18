const db = require('../db.js');

const get = async(product_id, sort, page, count) => {
  let sortQuery;
  switch (sort) {
    case 'newest':
      sortQuery = `ORDER BY id ASC`;
      break;
    case 'helpful':
      sortQuery = `ORDER BY helpfulness ASC`;
      break;
    case 'relevant':
      sortQuery = `ORDER BY helpfulness DESC, id ASC`;
      break;
  }

  let queryReviews =
  `SELECT id AS review_id, rating, summary, body, recommend, response, body, date, reviewer_name, helpfulness
  FROM review WHERE product_id = ${product_id} AND reported = false
  ${sortQuery}
  OFFSET ${(page - 1) * count} LIMIT ${count}`;

  const client = await db.connect();
  let results = await client
    .query(queryReviews)
    .then(async(res) => {
      await Promise.all(res.rows.map(mapPhotos));
      client.release();
      return res.rows;
    })
    .catch((err) => {
      client.release();
      console.log(err);
    })

  function mapPhotos(review) {
    let queryPhotos = `SELECT id, url FROM review_photo WHERE review_id = ${review.review_id} LIMIT 5`
    let date = new Date(0);
    date.setUTCSeconds(parseInt(review.date));
    review.date = date;
    review.photos = [];

    return db
    .query(queryPhotos)
    .then((res) => {
      return review.photos = res.rows;
    })
    .catch((err) => console.log(err));
  };

  return {
    'product': product_id.toString(),
    'page': page - 1,
    'count': count,
    'results': results
  };
};

const post = async({ product_id, rating, summary, body, recommend, name, email, photos, characteristics }) => {
  let queryReview =
  `INSERT INTO review (product_id, rating, summary, body, recommend, reviewer_name, reviewer_email)
  VALUES (${product_id}, ${rating}, '${summary}', '${body}', ${recommend}, '${name}', '${email}')
  RETURNING id`;
  let queryProduct =
  `UPDATE product SET "${rating}" = "${rating}" + 1, "${recommend}" = "${recommend}" + 1
  WHERE id = ${product_id}`;

  const client = await db.connect();

  //Room to optimize by inserting review, retrieving review id, then calling all other inserts/updates at the same time instead of
  //  doing awaits one at a time
  let error = false;

  let review_id = await client
  .query(queryReview)
  .then((res) => {
    return res.rows[0].id;
  })
  .catch((err) => console.log(err));

  await client
  .query(queryProduct)
  .catch((err) => {
    console.log(err)
    return error = true;
  });

  for (let photo of photos) {
    let queryPhoto =
    `INSERT INTO review_photo (review_id, url)
    VALUES (${review_id}, '${photo}')`;

    await client
    .query(queryPhoto)
    .catch((err) => {
      console.log(err)
      return error = true;
    });
  }

  for (let characteristic of Object.entries(characteristics)) {
    let queryProductCharacteristic =
    `UPDATE product_characteristic SET "${characteristic[1]}" = "${characteristic[1]}" + 1
    WHERE id = ${characteristic[0]} AND product_id = ${product_id}`;
    let queryReviewCharacteristic =
    `INSERT INTO review_characteristic (characteristic_id, review_id, value)
    VALUES (${characteristic[0]}, ${review_id}, ${characteristic[1]})`;

    await client
    .query(queryProductCharacteristic)
    .then(() => client.query(queryReviewCharacteristic))
    .catch((err) => {
      console.log(err)
      return error = true;
    });
  }

  client.release();
  return error;
};

exports.get = get;
exports.post = post;