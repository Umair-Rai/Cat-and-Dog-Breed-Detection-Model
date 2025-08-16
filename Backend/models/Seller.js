// models/Seller.js
const mongoose = require("mongoose");

const registeredPetSchema = new mongoose.Schema(
  {
    pet_type: { type: String, required: true },
    breed: { type: String, required: true },
    gender: { type: String, enum: ["male", "female"], required: true },
    age: { type: Number, min: 0 },
    descriptions: { type: String, default: "" },
    images: { type: [String], default: [] },
    medical_report: { type: String, default: "" },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    admin_comment: { type: String, default: "" }
  },
  { _id: false }
);

const sellerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    cnic: { type: String, default: "" },
    address: { type: String, default: "" },
    profile_image: { type: String, default: "" },
    register_pet: { type: [registeredPetSchema], default: [] },
    services_offered: { type: [String], default: ["breeding"] },
    isVerified: { type: Boolean, default: false },
    refresh_token: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Seller", sellerSchema);
