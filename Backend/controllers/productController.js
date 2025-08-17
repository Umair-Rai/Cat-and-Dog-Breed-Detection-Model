const Product = require("../models/Product");
const Category = require("../models/Category");

exports.createProduct = async (req, res) => {
  try {
    // Parse form data
    const {
      name,
      brand,
      price,
      stock,
      pet_type_id,
      product_category,
      discount,
      description,
      season,
      is_active,
      added_by_admin_id
    } = req.body;

    // Parse JSON fields
    const tags = req.body.tags ? JSON.parse(req.body.tags) : [];
    const variants = req.body.variants ? JSON.parse(req.body.variants) : [];

    // Handle uploaded images
    const images = req.files ? req.files.map(file => file.filename) : [];

    // Validate required fields
    if (!name || !price || !stock || !pet_type_id || !product_category) {
      return res.status(400).json({ message: "Please fill in all required fields" });
    }

    // Validate category
    const category = await Category.findById(pet_type_id);
    if (!category) return res.status(400).json({ message: "Invalid pet type" });
    if (!category.product_categories.includes(product_category)) {
      return res.status(400).json({ message: "Invalid product category" });
    }

    // Create product object
    const productData = {
      name,
      brand,
      price: parseFloat(price),
      stock: parseInt(stock),
      pet_type_id,
      product_category,
      discount: discount ? parseFloat(discount) : 0,
      tags,
      description,
      season,
      images,
      is_active: is_active === 'true',
      variants,
      added_by_admin_id
    };

    const product = new Product(productData);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Product creation error:', error);
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
    // Parse form data similar to createProduct
    const {
      name,
      brand,
      price,
      stock,
      pet_type_id,
      product_category,
      discount,
      description,
      season,
      is_active
    } = req.body;

    // Parse JSON fields
    const tags = req.body.tags ? JSON.parse(req.body.tags) : undefined;
    const variants = req.body.variants ? JSON.parse(req.body.variants) : undefined;
    const existingImages = req.body.existingImages ? JSON.parse(req.body.existingImages) : undefined;

    // Handle uploaded images
    const newImages = req.files ? req.files.map(file => file.filename) : [];
    
    // Combine existing and new images
    const images = existingImages ? [...existingImages, ...newImages] : newImages;

    // Validate category if provided
    if (pet_type_id) {
      const category = await Category.findById(pet_type_id);
      if (!category) return res.status(400).json({ message: "Invalid pet type" });
      if (product_category && !category.product_categories.includes(product_category)) {
        return res.status(400).json({ message: "Invalid product category" });
      }
    }

    // Build update object with only provided fields
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (brand !== undefined) updateData.brand = brand;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (stock !== undefined) updateData.stock = parseInt(stock);
    if (pet_type_id !== undefined) updateData.pet_type_id = pet_type_id;
    if (product_category !== undefined) updateData.product_category = product_category;
    if (discount !== undefined) updateData.discount = parseFloat(discount);
    if (tags !== undefined) updateData.tags = tags;
    if (description !== undefined) updateData.description = description;
    if (season !== undefined) updateData.season = season;
    if (is_active !== undefined) updateData.is_active = is_active === 'true';
    if (variants !== undefined) updateData.variants = variants;
    if (images.length > 0) updateData.images = images;

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    console.error('Product update error:', error);
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
