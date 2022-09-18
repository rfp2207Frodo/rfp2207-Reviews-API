const { report } = require('../models');

const put = async(req, res) => {
  let { review_id } = req.params;

  if (!review_id) {
    return res.sendStatus(404);
  }

  let result = await report.put(review_id);

  if (result) {
    return res.sendStatus(204);
  } else {
    return res.sendStatus(500);
  }
};

exports.put = put;