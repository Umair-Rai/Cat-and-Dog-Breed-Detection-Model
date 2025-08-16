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
      required: true,
      default: [],
      validate: {
        validator: arr => arr.length > 0,
        message: "At least one product category is required."
      }
    },
    is_active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
