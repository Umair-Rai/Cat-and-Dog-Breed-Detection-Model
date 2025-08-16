const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.post("/", productController.createProduct);
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

// Additional
router.get("/category/:categoryId", productController.getProductsByCategory);
router.get("/search/:query", productController.searchProducts);

module.exports = router;
