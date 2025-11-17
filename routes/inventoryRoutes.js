const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventory-controller");

router.get("/", inventoryController.showHome);
router.get("/custom", inventoryController.showCustom);
router.get("/classification/:type", inventoryController.showClassification);
router.get("/vehicle/:id", inventoryController.showVehicleDetails);

module.exports = router;
