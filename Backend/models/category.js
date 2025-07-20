// /models/categoryModel.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  pet_type: {
    type: String,
    required: true,
  },
  product_categories: {
    type: [String],
    required: true,
  },
});

module.exports = mongoose.model('Category', categorySchema);
