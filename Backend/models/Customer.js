const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String },
  address: {type: String},
  password: { type: String, required: true },
  account_type: { // 👈 only allow "customer"
    type: String,
    enum: ["customer"],
    required: true
  },
  refresh_token: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Customer", customerSchema);
