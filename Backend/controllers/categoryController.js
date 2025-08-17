const Category = require("../models/Category");

exports.createCategory = async (req, res) => {
  try {
    const { pet_type, product_categories } = req.body;

    const existing = await Category.findOne({ pet_type });
    if (existing) return res.status(400).json({ message: "Pet type already exists" });

    const category = new Category({ pet_type, product_categories });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// POST /api/categories
exports.createPetCategory = async (req, res) => {
  try {
    const { pet_type } = req.body;

    const category = new Category({
      pet_type,
      product_categories: []   // ✅ allowed
    });

    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { newCategory } = req.body;

    // First find the category
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    // Check if subcategory already exists
    if (newCategory) {
      const exists = category.product_categories.some(
        cat => cat.toLowerCase() === newCategory.toLowerCase()
      );
      if (exists) {
        return res.status(400).json({ message: "Subcategory already exists" });
      }
      
      // Add new subcategory
      category.product_categories.push(newCategory);
      await category.save();
      return res.json(category);
    }

    // Handle other updates if needed
    const updatedCategory = await Category.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add this new function
exports.addSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { subcategory } = req.body;
    
    if (!subcategory) {
      return res.status(400).json({ message: "Subcategory name is required" });
    }
    
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    
    // Check if subcategory already exists
    if (category.product_categories.includes(subcategory)) {
      return res.status(400).json({ message: "Subcategory already exists" });
    }
    
    // Add the subcategory
    category.product_categories.push(subcategory);
    await category.save();
    
    res.status(200).json(category);
  } catch (error) {
    console.error("❌ Add subcategory error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Add this function for updating pet category names
exports.updatePetCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { pet_type } = req.body;
    
    if (!pet_type || !pet_type.trim()) {
      return res.status(400).json({ error: "Pet type name is required" });
    }
    
    // Check if pet type already exists (excluding current category)
    const existing = await Category.findOne({ 
      pet_type: pet_type.trim(), 
      _id: { $ne: id } 
    });
    
    if (existing) {
      return res.status(400).json({ error: "Pet type already exists" });
    }
    
    const category = await Category.findByIdAndUpdate(
      id, 
      { pet_type: pet_type.trim() }, 
      { new: true }
    );
    
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    
    res.json(category);
  } catch (error) {
    console.error("❌ Update pet category error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Add this function for updating subcategories
exports.updateSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { oldSubcategory, newSubcategory, newPetType } = req.body;
    
    if (!oldSubcategory || !newSubcategory) {
      return res.status(400).json({ error: "Old and new subcategory names are required" });
    }
    
    // Find the source category
    const sourceCategory = await Category.findById(id);
    if (!sourceCategory) {
      return res.status(404).json({ error: "Source category not found" });
    }
    
    // Check if old subcategory exists
    if (!sourceCategory.product_categories.includes(oldSubcategory)) {
      return res.status(400).json({ error: "Original subcategory not found" });
    }
    
    // If moving to a different pet type
    if (newPetType && newPetType !== sourceCategory.pet_type) {
      // Find target category
      const targetCategory = await Category.findOne({ pet_type: newPetType });
      if (!targetCategory) {
        return res.status(404).json({ error: "Target pet type not found" });
      }
      
      // Check if subcategory already exists in target
      if (targetCategory.product_categories.includes(newSubcategory)) {
        return res.status(400).json({ error: "Subcategory already exists in target category" });
      }
      
      // Remove from source and add to target
      sourceCategory.product_categories = sourceCategory.product_categories.filter(
        cat => cat !== oldSubcategory
      );
      targetCategory.product_categories.push(newSubcategory);
      
      await sourceCategory.save();
      await targetCategory.save();
      
      res.json({ 
        message: "Subcategory moved successfully", 
        sourceCategory, 
        targetCategory 
      });
    } else {
      // Just rename in the same category
      if (sourceCategory.product_categories.includes(newSubcategory) && newSubcategory !== oldSubcategory) {
        return res.status(400).json({ error: "Subcategory name already exists" });
      }
      
      const index = sourceCategory.product_categories.indexOf(oldSubcategory);
      sourceCategory.product_categories[index] = newSubcategory;
      
      await sourceCategory.save();
      res.json(sourceCategory);
    }
  } catch (error) {
    console.error("❌ Update subcategory error:", error);
    res.status(500).json({ error: error.message });
  }
};
