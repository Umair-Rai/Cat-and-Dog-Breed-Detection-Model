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


module.exports = router;
