const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const AdminSchema = new mongoose.Schema({
  admin_name: {
    type: String,
    required: true,
  },
  admin_email: {
    type: String,
    required: true,
    unique: true,
  },
  admin_pass: {
    type: String,
    required: true,
  },
}, { timestamps: true });

// 🔐 Pre-save hook to hash password
AdminSchema.pre("save", async function (next) {
  if (!this.isModified("admin_pass")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.admin_pass = await bcrypt.hash(this.admin_pass, salt);

    next();
  } catch (err) {
    next(err);
  }
});

// 🔐 Method to compare password
AdminSchema.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.admin_pass);
};

module.exports = mongoose.model("Admin", AdminSchema);
