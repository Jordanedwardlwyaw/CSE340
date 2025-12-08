const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");
const auth = require("../utilities/auth"); // NEW: Import auth

// Public routes (no authentication required)
router.get("/", utilities.handleErrors(invController.buildManagement)); // Changed from buildInventoryManagement to buildManagement
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInventoryId)); // Changed from buildVehicleDetail to buildByInventoryId

// Management routes - PROTECTED with authorization (Task 5)
router.get("/management", 
  auth.authorizeRoles("Employee", "Admin"),
  utilities.handleErrors(invController.buildManagement) // Changed from buildInventoryManagement to buildManagement
);

router.get("/add-classification", 
  auth.authorizeRoles("Employee", "Admin"),
  utilities.handleErrors(invController.buildAddClassification)
);

router.get("/add-inventory", 
  auth.authorizeRoles("Employee", "Admin"),
  utilities.handleErrors(invController.buildAddInventory)
);

// Add other routes (keep existing)
router.post("/add-classification", utilities.handleErrors(invController.addClassification));
router.post("/add-inventory", utilities.handleErrors(invController.addInventory));

// Add trigger error route if it doesn't exist
router.get("/trigger-error", utilities.handleErrors(invController.triggerError));

module.exports = router;