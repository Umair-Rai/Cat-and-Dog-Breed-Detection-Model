const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  petType: {
    type: String,
    enum: ['cat', 'dog'],
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  variants: [
    {
      size: String,
      weight: String,
      price: Number,
    },
  ],
  images: [String],
  description: String,
}, {
  timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);
