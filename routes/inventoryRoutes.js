const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventory-controller");

// Home page
router.get("/", inventoryController.showHome);

// Custom upgrades page
router.get("/custom", inventoryController.showCustom);

// Classification pages (Sedan, SUV, Truck)
router.get("/classification/:type", inventoryController.showClassification);

// Vehicle detail pages
router.get("/vehicle/:id", inventoryController.showDetails);

module.exports = router;
