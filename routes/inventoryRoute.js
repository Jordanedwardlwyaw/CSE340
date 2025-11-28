const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const { requireAuth } = require("../middleware/auth");

// Apply auth middleware to ALL inventory management routes
router.get("/", requireAuth, invController.buildManagement);
router.get("/add-classification", requireAuth, invController.buildAddClassification);
router.get("/add-inventory", requireAuth, invController.buildAddInventory);
router.post("/add-classification", requireAuth, invController.addClassification);
router.post("/add-inventory", requireAuth, invController.addInventory);

// Public routes (no auth required) - these should remain accessible to all visitors
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:inventoryId", invController.buildByInventoryId);

module.exports = router;