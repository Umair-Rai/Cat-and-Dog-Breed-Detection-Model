// models/Admin.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const adminSchema = new mongoose.Schema(
  {
    admin_name: { type: String, required: true },
    admin_email: { type: String, required: true, unique: true },
    admin_pass: { type: String, required: true },
    role: { type: String, enum: ["superadmin", "admin"], default: "admin" }
  },
  { timestamps: true }
);

adminSchema.pre("save", async function (next) {
  if (!this.isModified("admin_pass")) return next();
  const salt = await bcrypt.genSalt(10);
  this.admin_pass = await bcrypt.hash(this.admin_pass, salt);
  next();
});

adminSchema.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.admin_pass);
};

module.exports = mongoose.model("Admin", adminSchema);
