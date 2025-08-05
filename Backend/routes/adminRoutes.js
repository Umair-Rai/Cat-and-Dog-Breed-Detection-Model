const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");

// ✅ GET all admins
router.get("/", async (req, res) => {
  try {
    const admins = await Admin.find().select("-admin_pass"); // hide passwords
    res.status(200).json(admins);
  } catch (err) {
    console.error("❌ Failed to fetch admins:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Get admin profile
router.get("/:id", async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select("-admin_pass");
    if (!admin) return res.status(404).json({ error: "Admin not found" });
    res.json(admin);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


// ✅ Update name/email
router.put("/:id", async (req, res) => {
  const { admin_name, admin_email } = req.body;
  if (!admin_name || !admin_email) {
    return res.status(400).json({ error: "Both name and email are required" });
  }

  try {
    const admin = await Admin.findByIdAndUpdate(
      req.params.id,
      { admin_name, admin_email },
      { new: true }
    ).select("-admin_pass");

    res.json({ message: "✅ Profile updated", admin });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Change password
router.patch("/password/:id", async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ error: "Old and new password required" });
  }

  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ error: "Admin not found" });

    const match = await bcrypt.compare(oldPassword, admin.admin_pass);
    if (!match) return res.status(401).json({ error: "Incorrect old password" });

    admin.admin_pass = newPassword; // will be hashed by pre-save
    await admin.save();

    res.json({ message: "✅ Password updated" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Delete admin
router.delete("/:id", async (req, res) => {
  try {
    await Admin.findByIdAndDelete(req.params.id);
    res.json({ message: "✅ Account deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
