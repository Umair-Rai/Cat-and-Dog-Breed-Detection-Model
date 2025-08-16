const express = require("express");
const router = express.Router();
const sellerController = require("../controllers/sellerController");

// Auth
router.post("/register", sellerController.registerSeller);
router.post("/login", sellerController.loginSeller);

// CRUD
router.get("/", sellerController.getAllSellers);
router.get("/:id", sellerController.getSellerById);
router.put("/:id", sellerController.updateSeller);
router.delete("/:id", sellerController.deleteSeller);

// Pets
router.post("/:id/pets", sellerController.registerPet);
router.put("/:id/pets/:petIndex", sellerController.updatePet);
router.delete("/:id/pets/:petIndex", sellerController.deletePet);

module.exports = router;
