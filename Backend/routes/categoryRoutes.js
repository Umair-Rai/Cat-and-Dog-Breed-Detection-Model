const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Category = require("../models/Category");

// ✅ 1. GET all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// ✅ 2. POST create or update a pet_type with product_categories
router.post("/", async (req, res) => {
  let { pet_type, product_categories } = req.body;

  if (!pet_type || !Array.isArray(product_categories)) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  pet_type = pet_type.trim().toLowerCase();

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

// ✅ 3. PUT: update pet_type name
router.put("/pet/:id", async (req, res) => {
  const { pet_type } = req.body;

  if (!pet_type || typeof pet_type !== "string") {
    return res.status(400).json({ error: "Invalid pet type" });
  }

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Invalid category ID" });
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

// ✅ 4. PATCH: Rename & move subcategory to another pet_type
router.patch("/product/:catId/subcategory", async (req, res) => {
  const { oldSubcategory, newSubcategory, newPetType } = req.body;

  if (!oldSubcategory || !newSubcategory || !newPetType) {
    return res.status(400).json({
      error: "Missing fields: oldSubcategory, newSubcategory, and newPetType are required",
    });
  }

  try {
    const sourceCategory = await Category.findById(req.params.catId);
    if (!sourceCategory) {
      return res.status(404).json({ error: "Original category (source pet_type) not found" });
    }

    const subIndex = sourceCategory.product_categories.findIndex(
      (cat) => cat.toLowerCase() === oldSubcategory.trim().toLowerCase()
    );

    if (subIndex === -1) {
      return res.status(404).json({
        error: `Subcategory '${oldSubcategory}' not found in original pet_type '${sourceCategory.pet_type}'`,
      });
    }

    sourceCategory.product_categories.splice(subIndex, 1);
    await sourceCategory.save();

    const targetCategory = await Category.findOne({
      pet_type: newPetType.trim().toLowerCase(),
    });

    if (!targetCategory) {
      return res.status(404).json({ error: `Target pet_type '${newPetType}' not found` });
    }

    const alreadyExists = targetCategory.product_categories.some(
      (cat) => cat.toLowerCase() === newSubcategory.trim().toLowerCase()
    );

    if (!alreadyExists) {
      targetCategory.product_categories.push(newSubcategory.trim());
      await targetCategory.save();

      return res.status(200).json({
        message: `✅ '${oldSubcategory}' renamed to '${newSubcategory}' and moved to '${newPetType}'`,
        from: sourceCategory,
        to: targetCategory,
      });
    } else {
      return res.status(200).json({
        message: `⚠️ '${newSubcategory}' already exists in '${newPetType}'. It was not added again. '${oldSubcategory}' was removed from '${sourceCategory.pet_type}'`,
        from: sourceCategory,
        to: targetCategory,
      });
    }
  } catch (err) {
    console.error("❌ Failed to update subcategory:", err);
    return res.status(500).json({ error: "Server error", details: err.message });
  }
});

// ✅ 5. PUT: Add a new subcategory to an existing pet_type
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

// ✅ 6. PUT: Remove a subcategory from a pet_type
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

// ✅ 7. DELETE: Delete entire pet_type category
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

module.exports = router;
