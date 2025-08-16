const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// Auth
router.post("/register", adminController.registerAdmin);
router.post("/login", adminController.loginAdmin);
router.get("/create-default", adminController.registerDefaultAdmin);

// CRUD
router.get("/", adminController.getAllAdmins);
router.get("/:id", adminController.getAdminById);
router.put("/:id", adminController.updateAdmin);
router.delete("/:id", adminController.deleteAdmin);

module.exports = router;
