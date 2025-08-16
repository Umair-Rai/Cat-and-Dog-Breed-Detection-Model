// models/Order.js
const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }, // price at order time
    product_snapshot: {
      name: String,
      image: String
    }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    customer_id: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    products: { type: [orderItemSchema], required: true },
    total_amount: { type: Number, required: true },
    payment_status: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    payment_method: { type: String, enum: ["cod", "card", "paypal"], required: true },
    order_status: { type: String, enum: ["pending", "shipped", "delivered", "cancelled"], default: "pending" },
    refund_requested: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
