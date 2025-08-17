const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const upload = require('../middleware/upload');

// Use multer for product creation (multiple image uploads)
router.post("/", upload.array('images', 10), productController.createProduct);
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.put("/:id", upload.array('images', 10), productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

// Additional
router.get("/category/:categoryId", productController.getProductsByCategory);
router.get("/search/:query", productController.searchProducts);

module.exports = router;
