const router = require('express').Router();
const {
  reviews,
  meta,
  helpful,
  report,
} = require('./controllers');

router.get('', reviews.get);

router.post('', reviews.post);

router.get('/meta', meta.get);

router.put('/:review_id/helpful', helpful.put);

router.put('/:review_id/report', report.put);

module.exports = router;
