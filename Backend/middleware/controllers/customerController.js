// controllers/customerController.js
const Customer = require("../models/Customer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ✅ Use environment variables
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

// Generate Access Token
const generateAccessToken = (customer) => {
  return jwt.sign(
    { id: customer._id, role: "customer" },
    ACCESS_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
};

// Generate Refresh Token
const generateRefreshToken = (customer) => {
  return jwt.sign(
    { id: customer._id, role: "customer" },
    REFRESH_TOKEN_SECRET,
    { expiresIn: "30d" }
  );
};

// ------------------------- REGISTER CUSTOMER -------------------------
exports.registerCustomer = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    // Check if email exists
    const existing = await Customer.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    const customer = new Customer({ name, email, password: hashed, phone, address });
    await customer.save();

    res.status(201).json({ message: "Customer registered", customer });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ------------------------- LOGIN CUSTOMER -------------------------
exports.loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;

    const customer = await Customer.findOne({ email });
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    // Generate tokens
    const accessToken = generateAccessToken(customer);
    const refreshToken = generateRefreshToken(customer);

    // Save refresh token to customer document (optional)
    customer.refresh_token = refreshToken;
    await customer.save();

    res.json({
      message: "Login successful",
      customer,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ------------------------- GET ALL CUSTOMERS -------------------------
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().populate("orders");
    res.json(customers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// ------------------------- GET CUSTOMER BY ID -------------------------
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id).populate("orders");
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// ------------------------- UPDATE CUSTOMER -------------------------
exports.updateCustomer = async (req, res) => {
  try {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// ------------------------- DELETE CUSTOMER -------------------------
exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json({ message: "Customer deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// ------------------------- CART OPERATIONS -------------------------
exports.addToCart = async (req, res) => {
  try {
    const { product_id, quantity } = req.body;
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    const itemIndex = customer.cart.findIndex(i => i.product_id.toString() === product_id);
    if (itemIndex > -1) {
      customer.cart[itemIndex].quantity += quantity;
    } else {
      customer.cart.push({ product_id, quantity });
    }

    await customer.save();
    res.json({ message: "Cart updated", cart: customer.cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    customer.cart = customer.cart.filter(i => i.product_id.toString() !== productId);
    await customer.save();
    res.json({ message: "Item removed", cart: customer.cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// ------------------------- GET CUSTOMER ORDERS -------------------------
exports.getCustomerOrders = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id).populate("orders");
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json(customer.orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
