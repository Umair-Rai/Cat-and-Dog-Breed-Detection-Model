const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  pet_type: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true // 🔥 ensures "Cat" === "cat"
  },
  product_categories: {
    type: [String],
    required: true,
    default: [],
  },
});

module.exports = mongoose.model("Category", categorySchema);
