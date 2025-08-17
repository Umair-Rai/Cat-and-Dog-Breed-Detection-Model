const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

router.post("/", categoryController.createCategory);
router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);
router.put("/:id", categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);
router.post("/:id/subcategories", categoryController.addSubcategory);

// Add these new routes for UpdateCategory.jsx
router.put("/pet/:id", categoryController.updatePetCategory);
router.patch("/product/:id/subcategory", categoryController.updateSubcategory);

module.exports = router;
