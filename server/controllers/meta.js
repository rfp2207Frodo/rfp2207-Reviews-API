const { meta } = require('../models');

const get = async(req, res) => {
  let { product_id } = req.query;

  if (!product_id) {
    return res.sendStatus(404);
  }

  let result = await meta.get(product_id);

  if (result) {
    return res.send(result);
  } else {
    return res.sendStatus(500);
  }
};

exports.get = get;