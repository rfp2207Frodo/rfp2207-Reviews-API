const { reviews } = require('../models');

const validatePost = ({
  product_id,
  rating,
  summary,
  body,
  recommend,
  name, email,
  photos,
  characteristics,
}) => {
  console.log(photos.length);
  if (!product_id || typeof product_id !== 'number' || product_id < 1) {
    return false;
  }

  if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
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

  for (const photo of photos) {
    if (typeof photo !== 'string') {
      return false;
    }
  }

  if (!(typeof characteristics === 'object' && !Array.isArray(characteristics)) || Object.keys(characteristics).length === 0 || Object.keys(characteristics).length > 6) {
    return false;
  }

  for (const characteristic_id of Object.keys(characteristics)) {
    if (typeof characteristic_id !== 'string' || Number.isNaN(parseInt(characteristic_id)) || parseInt(characteristic_id) < 1) {
      return false;
    }
  }

  for (const value of Object.values(characteristics)) {
    if (typeof value !== 'number' || value < 1 || value > 5) {
      return false;
    }
  }

  return true;
};

const get = async (req, res) => {
  const { product_id } = req.query;
  let {
    sort,
    page,
    count,
  } = req.query;

  if (!product_id) {
    return res.sendStatus(404);
  }

  sort = sort || 'relevant';
  page = page || 1;
  count = count || 5;
  // consider finding a way to reconnect after some time
  // if an error occurs(maybe during bottlenecking?)

  const result = await reviews.get(product_id, sort, page, count);

  if (result) {
    return res.send(result);
  }

  return res.sendStatus(500);
};

const post = async (req, res) => {
  if (!validatePost(req.body)) {
    return res.sendStatus(422);
  }

  const result = await reviews.post(req.body);

  if (!result) {
    return res.sendStatus(201);
  }

  return res.sendStatus(500);
};

exports.get = get;
exports.post = post;
