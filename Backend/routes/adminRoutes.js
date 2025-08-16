const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const verifyToken = require("../middleware/verifyToken");

// Auth
router.post("/register", adminController.registerAdmin);
router.post("/login", adminController.loginAdmin);
router.get("/create-default", adminController.registerDefaultAdmin);
// adminRoutes.js
router.get("/me", verifyToken("admin"), (req, res) => {
  res.json({ id: req.user.id, role: req.user.role });
});
router.patch(
  "/password/:id",
  verifyToken(),
  adminController.updatePassword
);
// CRUD (admin-only)
router.get("/", verifyToken("admin"), adminController.getAllAdmins);
router.get("/:id", verifyToken("admin"), adminController.getAdminById);
router.put("/:id", verifyToken("admin"), adminController.updateAdmin);
router.delete("/:id", verifyToken("admin"), adminController.deleteAdmin);

module.exports = router;
