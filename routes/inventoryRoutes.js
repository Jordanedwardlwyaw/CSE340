const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventory-controller");

// Home
router.get("/", inventoryController.showHome);

// Custom
router.get("/custom", inventoryController.showCustom);

// Classification pages
router.get("/classification/:type", inventoryController.showClassification);

// Vehicle details
router.get("/vehicle/:id", inventoryController.showDetails);

module.exports = router;
