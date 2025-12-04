const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");

router.get("/", invController.buildHome);
router.get("/inv/type/:classificationId", invController.buildByClassificationId);
router.get("/inv/detail/:invId", invController.buildByInventoryId);
router.get("/inv/trigger-error", invController.triggerError);

// NEW ROUTES FOR ASSIGNMENT 4
router.get("/inv/", invController.buildManagement);
router.get("/inv/add-classification", invController.buildAddClassification);
router.post("/inv/add-classification", invController.addClassification);
router.get("/inv/add-inventory", invController.buildAddInventory);
router.post("/inv/add-inventory", invController.addInventory);

module.exports = router;