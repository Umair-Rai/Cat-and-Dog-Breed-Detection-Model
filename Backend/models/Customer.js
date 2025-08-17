// models/Customer.js
const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    quantity: { type: Number, default: 1, min: 1 }
  },
  { _id: false }
);

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String },
    address: { type: String, default: "" },
    password: { type: String, required: true },
    refresh_token: { type: String },
    cart: { type: [cartItemSchema], default: [] },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", customerSchema);
