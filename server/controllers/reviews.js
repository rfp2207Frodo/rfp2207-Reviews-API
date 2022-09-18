const { reviews } = require('../models');


const get = async(req, res) => {
  let { product_id, sort, page, count } = req.query;

  if (!product_id) {
    return res.sendStatus(404);
  }

  sort = sort || 'relevant';
  page = page || 1;
  count = count || 5;

  let result = await reviews.get(product_id, sort, page, count);

  if (result) {
    return res.send(result)
  } else {
    return res.sendStatus(500);
  };
};

const post = async(req, res) => {
  if (!validatePost(req.body)) {
    return res.sendStatus(422);
  }

  // let { product_id, rating, summary, body, recommend, name, email, photos, characteristics } = req.body;

  let result = await reviews.post(req.body);

  if (!result) {
    return res.sendStatus(201);
  } else {
    return res.sendStatus(500);
  }
};

const validatePost = ({ product_id, rating, summary, body, recommend, name, email, photos, characteristics }) => {
  if (!product_id || typeof product_id !== 'number') {
    return false;
  }

  if (!rating || typeof rating !== 'number') {
    return false;
  }

  if (!summary || typeof summary !== 'string') {
    return false;
  }

  if (!body || typeof body !== 'string' || body.length < 50 || body.length > 1000) {
    return false;
  }

  if (typeof recommend !== 'boolean') {
    return false;
  }

  if (!name || typeof name !== 'string' || name.length > 60) {
    return false;
  }

  if (!email || typeof email !== 'string' || email.length > 60) {
    return false;
  }

  if (!Array.isArray(photos) || photos.length > 5) {
    return false;
  }

  if (!(typeof characteristics === 'object' && !Array.isArray(characteristics)) || Object.keys(characteristics).length === 0 || Object.keys(characteristics).length > 6) {
    return false;
  }

  return true;
}

exports.get = get;
exports.post = post;