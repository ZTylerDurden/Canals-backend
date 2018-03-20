const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const User = require('./user-model')

const reviewSchema = new Schema({
  content: String,
  stars: Number,
  author: String
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;