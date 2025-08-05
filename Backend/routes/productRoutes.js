const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// ✅ Create new product
router.post("/", async (req, res) => {
  try {
    const product = new Product(req.body);
    const saved = await product.save();
    res.status(201).json({ message: "✅ Product created", data: saved });
  } catch (err) {
    console.error("❌ Create failed:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// ✅ Get all products (optionally filter by pet or category)
router.get("/", async (req, res) => {
  try {
    const { pet_id, category_id } = req.query;
    const filter = { is_deleted: false };

    if (pet_id) filter.pet_id = pet_id;
    if (category_id) filter.category_id = category_id;

    const products = await Product.find(filter).populate("pet_id category_id", "pet_type name");
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// ✅ Get single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("pet_id category_id", "pet_type name");
    if (!product || product.is_deleted) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// ✅ Update product
router.put("/:id", async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "✅ Product updated", data: updated });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// ✅ Soft delete product
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndUpdate(req.params.id, { is_deleted: true });
    if (!deleted) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "✅ Product soft-deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

module.exports = router;
