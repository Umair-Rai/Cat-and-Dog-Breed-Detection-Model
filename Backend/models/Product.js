const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema({
  weight: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
    discount: { type: Number, default: 0 }
}, { _id: false });

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    brand: { type: String },

    // 🆕 Link to the main pet type category (cat/dog)
    pet_type_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },

    // 🆕 Store the product category (must exist inside pet_type_id.product_categories)
    product_category: { type: String, required: true },

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
