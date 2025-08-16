// models/Rating.js
const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    target_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    target_type: { type: String, enum: ["product", "seller"], required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    review: { type: String, default: "" },
    customer_id: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Rating", ratingSchema);
