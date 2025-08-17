const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");

// Auth
router.post("/register", customerController.registerCustomer);
router.post("/login", customerController.loginCustomer);

// CRUD
router.get("/", customerController.getAllCustomers);
router.get("/:id", customerController.getCustomerById);
router.put("/:id", customerController.updateCustomer);
router.delete("/:id", customerController.deleteCustomer);

// Cart
router.post("/:id/cart", customerController.addToCart);
router.delete("/:id/cart/:productId", customerController.removeFromCart);

// Orders
router.get("/:id/orders", customerController.getCustomerOrders);

module.exports = router;