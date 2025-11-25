const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");

// Management view route
router.get("/", invController.buildManagement);

// Classification routes
router.get("/add-classification", invController.buildAddClassification);
router.post("/add-classification", invController.addClassification);

// Inventory routes
router.get("/add-inventory", invController.buildAddInventory);
router.post("/add-inventory", invController.addInventory);

// Existing classification and detail routes
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:invId", invController.buildByInvId);

// JSON route for AJAX
router.get("/getInventory/:classification_id", invController.getInventoryJSON);

module.exports = router;