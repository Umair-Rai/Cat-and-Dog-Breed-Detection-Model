const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  rate: { type: Number, default: 0 },
  review: { type: String, default: "" }
}, { _id: false });

const registeredPetSchema = new mongoose.Schema({
  pet_type: { type: String, default: "" },        // to be selected later (cat/dog)
  breed: { type: String, default: "" },           // breed name
  gender: { type: String, default: "" },          // "male"/"female"
  age: { type: Number, default: 0 },
  descriptions: { type: String, default: "" },
  images: { type: [String], default: [] },        // URLs or filenames
  medical_report: { type: String, default: "" },  // PDF/img filename
  status: { type: String, default: "pending" },   // "pending","approved","rejected"
  admin_comment: { type: String, default: "" },
  rating: { type: [ratingSchema], default: [] }
}, { _id: false });

const sellerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },

    cnic: { type: String, default: "" },
    address: { type: String, default: "" },
    profile_image: { type: String, default: "" },

    register_pet: {
      type: [registeredPetSchema],
      default: []
    },

    isVerified: { type: Boolean, default: false },
    refresh_token: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Seller", sellerSchema);
