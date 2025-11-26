const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");

// Management view
router.get("/", invController.buildManagement);

// ADD THESE ROUTES - THEY ARE MISSING!
router.get("/add-classification", invController.buildAddClassification);
router.post("/add-classification", invController.addClassification);

router.get("/add-inventory", invController.buildAddInventory);
router.post("/add-inventory", invController.addInventory);

// Your existing routes...
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:invId", invController.buildByInvId);

module.exports = router;