const { reviews, meta, helpful, report } = require('./controllers');
const router = require('express').Router();

router.get('', reviews.get);

router.post('', reviews.post);

router.get('/meta', meta.get);

router.put('/:review_id/helpful', helpful.put);

router.put('/:review_id/report', report.put);

module.exports = router;