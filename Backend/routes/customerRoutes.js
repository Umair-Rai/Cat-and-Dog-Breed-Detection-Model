const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Customer = require("../models/Customer");

const ACCESS_TOKEN_SECRET  = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;


// =========================== SIGN-UP ===========================
router.post("/signup", async (req, res) => {
  const { name, email, phone, address, password, account_type } = req.body;

  if (account_type !== "customer") {
    return res.status(400).json({ error: "Only customer account type is allowed" });
  }

  try {
    const already = await Customer.findOne({ email });
    if (already) return res.status(409).json({ error: "Email already registered" });

    const hashedPass = await bcrypt.hash(password, 10);

    const newCustomer = new Customer({
      name,
      email,
      phone,
      address,
      password: hashedPass,
      account_type,       // ➕ must be "customer"
    });

    await newCustomer.save();
    res.status(201).json({ message: "Customer registered successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// =========================== LOGIN ===========================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Customer.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Account not found" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const accessToken = jwt.sign(
      { id: user._id, email: user.email },
      ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user._id, email: user.email },
      REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    user.refresh_token = refreshToken;
    await user.save();

    res.json({
      message: "Logged in successfully",
      accessToken,
      refreshToken,
      user
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
// temporary test
router.get("/", async (req, res) => {
  const all = await Customer.find();
  res.json(all);
});

module.exports = router;
