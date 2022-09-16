const { reviews } = require('./controllers');
const router = require('express').Router();

router.get('', reviews.get);

// router.post('', get);

// router.get('/meta', get);

// router.put('/:review_id/helpful', get);

// router.put('/:review_id/report', get);

module.exports = router;