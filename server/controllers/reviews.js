// const { getReviews, getMetadata, post, updateHelpful, updateReport } = require('../models');
const { reviews } = require('../models');


module.exports = {
  get: async(req, res) => {
  let { product_id, sort, page, count } = req.query;

  sort = sort || 'newest';  //change to relevant later
  page = page || 1;
  count = count || 5;

  let result = await reviews.get(product_id, sort, page, count);

  res.send(result);
  // let result =
  // console.log(product_id);
  // console.log(sort);
  // console.log(page);
  // console.log(count);
  // res.send('hi')
  },


};