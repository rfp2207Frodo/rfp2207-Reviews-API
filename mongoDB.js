/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable spaced-comment */
/* eslint-disable new-cap */
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/reviews', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

const reviewSchema = new mongoose.schema({
  //_id: Number,
  product_id: { type: Number, required: true },
  review_id: { type: Number, required: true },
  rating: { type: Number, required: true },
  summary: { type: String, required: true },
  recommend: { type: Boolean, required: true },
  response: String,
  body: { type: String, required: true },
  date: { type: String, required: true },
  reviewer_name: { type: String, required: true },
  reviewer_email: { type: String, required: true },
  helpfulness: { type: Number, default: 0 },
  reported: { type: Boolean, default: false },
  photos: [{ photo_id: Number, url: String }],
  characteristics: [{ characteristic_id: Number, value: Number }],
});
