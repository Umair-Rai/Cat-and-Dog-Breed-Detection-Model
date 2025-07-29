const express = require("express");
const router = express.Router();
const Category = require("../models/Category");

// GET all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// PUT to add new category to existing pet_type
router.put("/:pet_type", async (req, res) => {
  const { pet_type } = req.params;
  const { newCategory } = req.body;

  if (!newCategory || typeof newCategory !== "string") {
    return res.status(400).json({ error: "Invalid newCategory" });
  }

  try {
    const categoryDoc = await Category.findOne({ pet_type });

    if (!categoryDoc) {
      return res.status(404).json({ error: "Pet type not found" });
    }

    const alreadyExists = categoryDoc.product_categories.some(
      (cat) => cat.toLowerCase() === newCategory.trim().toLowerCase()
    );

    if (alreadyExists) {
      return res.status(409).json({
        error: true,
        message: `Product category '${newCategory}' already exists for pet type '${pet_type}'`,
      });
    }

    // Add to DB if not exists
    categoryDoc.product_categories.push(newCategory.trim());
    await categoryDoc.save();

    return res.status(200).json({
      message: `✅ Product category '${newCategory}' added to '${pet_type}'`,
      data: categoryDoc,
    });
  } catch (err) {
    console.error("❌ Failed to update category:", err);
    return res.status(500).json({ error: "Server error", details: err.message });
  }
});


// POST to create or update a pet category
router.post("/", async (req, res) => {
  let { pet_type, product_categories } = req.body;

  if (!pet_type || !Array.isArray(product_categories)) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  pet_type = pet_type.trim().toLowerCase(); // normalize case

  try {
    const categoryDoc = await Category.findOne({ pet_type });

    if (categoryDoc) {
      const newCategories = product_categories.filter(
        (cat) => !categoryDoc.product_categories.includes(cat)
      );

      if (newCategories.length === 0) {
          return res.status(409).json({
          error: true,
          message: `Product category '${product_categories[0]}' already exists for pet type '${pet_type}'`,
            });
        }

      categoryDoc.product_categories.push(...newCategories);
      await categoryDoc.save();

      return res.status(200).json({
        message: "✅ Category(ies) added to existing pet type",
        data: categoryDoc,
      });
    } else {
      const newCategory = new Category({
        pet_type,
        product_categories,
      });

      const saved = await newCategory.save();

      return res.status(201).json({
        message: "✅ New pet type and categories added",
        data: saved,
      });
    }
  } catch (err) {
    console.error("❌ Server error:", err);
    return res.status(500).json({ error: "Server error", details: err.message });
  }
});

// PUT to remove a product subcategory from a pet type
router.put("/:catId/remove-category", async (req, res) => {
  const { categoryToRemove } = req.body;
  const { catId } = req.params;

  if (!categoryToRemove || typeof categoryToRemove !== "string") {
    return res.status(400).json({ error: "Invalid categoryToRemove" });
  }

  try {
    const categoryDoc = await Category.findById(catId);
    if (!categoryDoc) {
      return res.status(404).json({ error: "Pet category not found" });
    }

    const originalLength = categoryDoc.product_categories.length;

    categoryDoc.product_categories = categoryDoc.product_categories.filter(
      (cat) => cat.toLowerCase() !== categoryToRemove.trim().toLowerCase()
    );

    if (categoryDoc.product_categories.length === originalLength) {
      return res.status(404).json({ error: "Subcategory not found" });
    }

    await categoryDoc.save();

    return res.status(200).json({
      message: `✅ Subcategory '${categoryToRemove}' removed from '${categoryDoc.pet_type}'`,
      data: categoryDoc,
    });
  } catch (err) {
    console.error("❌ Error removing subcategory:", err);
    return res.status(500).json({ error: "Server error", details: err.message });
  }
});
// DELETE a full pet category by ID
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Pet category not found" });
    }

    return res.status(200).json({ message: "✅ Pet category deleted successfully" });
  } catch (err) {
    console.error("❌ Failed to delete pet category:", err);
    return res.status(500).json({ error: "Server error", details: err.message });
  }
});
// Update pet category name
router.put("/pet/:id", async (req, res) => {
  const { pet_type } = req.body;

  if (!pet_type || typeof pet_type !== "string") {
    return res.status(400).json({ error: "Invalid pet type" });
  }

  try {
    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      { pet_type: pet_type.trim().toLowerCase() },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Pet category not found" });

    res.json({ message: "✅ Pet category updated", data: updated });
  } catch (err) {
    console.error("❌ Failed to update pet category:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update a product subcategory
router.patch("/product/:catId/subcategory", async (req, res) => {
  const { oldSubcategory, newSubcategory } = req.body;

  if (!oldSubcategory || !newSubcategory) {
    return res.status(400).json({ error: "Both old and new subcategory names required" });
  }

  try {
    const cat = await Category.findById(req.params.catId);
    if (!cat) return res.status(404).json({ error: "Category not found" });

    const index = cat.product_categories.findIndex(
      (c) => c.toLowerCase() === oldSubcategory.trim().toLowerCase()
    );

    if (index === -1) {
      return res.status(404).json({ error: "Old subcategory not found" });
    }

    // Prevent duplicates
    if (
      cat.product_categories.some(
        (c) => c.toLowerCase() === newSubcategory.trim().toLowerCase()
      )
    ) {
      return res.status(409).json({ error: "Subcategory name already exists" });
    }

    cat.product_categories[index] = newSubcategory.trim();
    await cat.save();

    res.json({ message: "✅ Subcategory updated", data: cat });
  } catch (err) {
    console.error("❌ Failed to update subcategory:", err);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;