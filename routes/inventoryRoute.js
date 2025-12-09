const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");
const invValidate = require("../utilities/inventory-validation");

// Public routes
router.get("/", utilities.handleErrors(invController.buildManagement));
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInventoryId));

// Management routes
router.get("/management", utilities.handleErrors(invController.buildManagement));

// Add classification routes
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));
router.post("/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

// Add inventory routes
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));
router.post("/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);

// Error route
router.get("/trigger-error", utilities.handleErrors(invController.triggerError));

module.exports = router;