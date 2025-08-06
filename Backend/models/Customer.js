const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // should match your product model name
      required: true
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1
    }
  },
  { _id: false } // prevent auto _id for each cart item
);

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true
    },
    phone: {
      type: String
    },
    address: {
      type: String,
      default: ""
    },
    password: {
      type: String,
      required: true
    },
    account_type: {
      type: String,
      enum: ["customer"],
      required: true
    },
    refresh_token: {
      type: String
    },

    // ✅ CART FIELD (array of product + quantity)
    cart: {
      type: [cartItemSchema],
      default: []
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", customerSchema);
