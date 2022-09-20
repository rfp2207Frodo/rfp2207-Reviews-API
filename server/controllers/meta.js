const { meta } = require('../models');

const get = async (req, res) => {
  const { product_id } = req.query;

  if (!product_id) {
    return res.sendStatus(404);
  }

  const result = await meta.get(product_id);

  if (result) {
    return res.send(result);
  }
  return res.sendStatus(500);
};

exports.get = get;
