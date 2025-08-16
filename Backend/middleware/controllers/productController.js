const Product = require("../models/Product");
const Category = require("../models/Category");

exports.createProduct = async (req, res) => {
  try {
    const { name, price, stock, pet_type_id, product_category, added_by_admin_id } = req.body;

    // Validate category
    const category = await Category.findById(pet_type_id);
    if (!category) return res.status(400).json({ message: "Invalid pet type" });
    if (!category.product_categories.includes(product_category)) {
      return res.status(400).json({ message: "Invalid product category" });
    }

    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ is_deleted: false })
      .populate("pet_type_id", "pet_type")
      .populate("added_by_admin_id", "admin_name");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("pet_type_id", "pet_type")
      .populate("added_by_admin_id", "admin_name");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    if (req.body.pet_type_id) {
      const category = await Category.findById(req.body.pet_type_id);
      if (!category) return res.status(400).json({ message: "Invalid pet type" });
      if (!category.product_categories.includes(req.body.product_category)) {
        return res.status(400).json({ message: "Invalid product category" });
      }
    }

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { is_deleted: true },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted (soft delete)" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({
      pet_type_id: req.params.categoryId,
      is_deleted: false
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchProducts = async (req, res) => {
  try {
    const query = req.params.query;
    const products = await Product.find({
      name: { $regex: query, $options: "i" },
      is_deleted: false
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
