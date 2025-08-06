const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Seller = require("../models/Seller");     // Create model file using your seller schema
const jwt = require("jsonwebtoken");

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

// SELLER SIGNUP
router.post("/signup", async (req, res) => {
  const { name, email, phone, password } = req.body;
  try {
    const exists = await Seller.findOne({ email });
    if (exists) return res.status(409).json({ error: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const seller = new Seller({
      name, email, phone, password: hashed
    });
    await seller.save();
    res.status(201).json({ message: "Seller account created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
// ADD THIS under sellerRoutes.js (below your /signup route)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const seller = await Seller.findOne({ email });
    if (!seller) return res.status(404).json({ error: "Account not found" });

    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const accessToken = jwt.sign({ id: seller._id, email: seller.email }, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ id: seller._id, email: seller.email }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

    seller.refresh_token = refreshToken;
    await seller.save();

    res.json({
      message: "Seller logged in successfully",
      accessToken,
      refreshToken,
      user: seller
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
module.exports = router;
