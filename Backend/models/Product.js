const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema({
  weight: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    brand: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    pet_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    discount: { type: Number, default: 0 },
    tags: [{ type: String }],
    description: { type: String },
    images: [{ type: String }],
    is_active: { type: Boolean, default: true },
    season: { type: String },
    avg_rating: { type: Number, default: 0 },
    total_reviews: { type: Number, default: 0 },
    added_by_admin_id: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    variants: [variantSchema],
    is_deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
