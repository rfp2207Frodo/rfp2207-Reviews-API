const { helpful } = require('../models');

const put = async (req, res) => {
  const { review_id } = req.params;

  if (!review_id) {
    return res.sendStatus(404);
  }

  const result = await helpful.put(review_id);

  if (result) {
    return res.sendStatus(204);
  }
  return res.sendStatus(500);
};

exports.put = put;
