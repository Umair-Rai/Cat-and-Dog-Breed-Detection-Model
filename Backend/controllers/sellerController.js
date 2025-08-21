// controllers/sellerController.js
const Seller = require("../models/Seller");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ✅ Use environment variables
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

// Generate Access Token
const generateAccessToken = (seller) => {
  return jwt.sign(
    { id: seller._id, role: "seller" },
    ACCESS_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
};

// Generate Refresh Token
const generateRefreshToken = (seller) => {
  return jwt.sign(
    { id: seller._id, role: "seller" },
    REFRESH_TOKEN_SECRET,
    { expiresIn: "30d" }
  );
};

// ------------------------- REGISTER SELLER -------------------------
exports.registerSeller = async (req, res) => {
  try {
    const { name, email, password, phone, address, cnic } = req.body; // default empty string

    const existing = await Seller.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const seller = new Seller({ name, email, password: hashed, phone, address, cnic });
    await seller.save();

    res.status(201).json({ message: "Seller registered", seller });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: error.message });
  }
};


// ------------------------- LOGIN SELLER -------------------------
exports.loginSeller = async (req, res) => {
  try {
    const { email, password } = req.body;
    const seller = await Seller.findOne({ email });
    if (!seller) return res.status(404).json({ message: "Seller not found" });

    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    // Generate tokens
    const accessToken = generateAccessToken(seller);
    const refreshToken = generateRefreshToken(seller);

    // Save refresh token to seller document (optional)
    seller.refresh_token = refreshToken;
    await seller.save();

    res.json({
      message: "Login successful",
      seller,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ------------------------- GET ALL SELLERS -------------------------
exports.getAllSellers = async (req, res) => {
  try {
    const sellers = await Seller.find();
    res.json(sellers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// ------------------------- GET SELLER BY ID -------------------------
exports.getSellerById = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);
    if (!seller) return res.status(404).json({ message: "Seller not found" });
    res.json(seller);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// ------------------------- UPDATE SELLER -------------------------
exports.updateSeller = async (req, res) => {
  try {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }
    const seller = await Seller.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!seller) return res.status(404).json({ message: "Seller not found" });
    res.json(seller);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


// ------------------------- VERIFY SELLER -------------------------
exports.verifySeller = async (req, res) => {
  try {
    const { status, adminComment } = req.body; // status = "approved" | "rejected"
    const seller = await Seller.findById(req.params.id);

    if (!seller) return res.status(404).json({ message: "Seller not found" });

    seller.isVerified = status;
    seller.admin_comment = adminComment || "";
    await seller.save();

    res.json({ message: `Seller ${status}`, seller });
  } catch (error) {
    console.error("Verify Seller Error:", error);
    res.status(500).json({ message: error.message });
  }
};


// ------------------------- DELETE SELLER -------------------------
exports.deleteSeller = async (req, res) => {
  try {
    const seller = await Seller.findByIdAndDelete(req.params.id);
    if (!seller) return res.status(404).json({ message: "Seller not found" });
    res.json({ message: "Seller deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// ------------------------- PET REGISTRATION -------------------------
exports.registerPet = async (req, res) => {
  try {
    const { pet_type, breed, gender, age, descriptions, images, medical_report } = req.body;
    const seller = await Seller.findById(req.params.id);
    if (!seller) return res.status(404).json({ message: "Seller not found" });

    seller.register_pet.push({ pet_type, breed, gender, age, descriptions, images, medical_report });
    await seller.save();
    res.json({ message: "Pet registered", pets: seller.register_pet });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.updatePet = async (req, res) => {
  try {
    const { petIndex } = req.params;
    const seller = await Seller.findById(req.params.id);
    if (!seller || !seller.register_pet[petIndex]) return res.status(404).json({ message: "Pet not found" });

    seller.register_pet[petIndex] = { ...seller.register_pet[petIndex]._doc, ...req.body };
    await seller.save();
    res.json({ message: "Pet updated", pets: seller.register_pet });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.deletePet = async (req, res) => {
  try {
    const { petIndex } = req.params;
    const seller = await Seller.findById(req.params.id);
    if (!seller || !seller.register_pet[petIndex]) return res.status(404).json({ message: "Pet not found" });

    seller.register_pet.splice(petIndex, 1);
    await seller.save();
    res.json({ message: "Pet deleted", pets: seller.register_pet });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
