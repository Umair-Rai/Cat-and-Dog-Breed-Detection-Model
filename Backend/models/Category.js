// models/Category.js
const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    pet_type: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    product_categories: {
      type: [String],
      default: [],
    },
    is_active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
