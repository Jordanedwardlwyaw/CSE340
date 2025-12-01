const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController");
const utilities = require("../utilities/");

// Route to build inventory by classification view - accepts both ID and name
router.get("/type/:classification", utilities.handleErrors(inventoryController.buildByClassification));

// Route to build vehicle detail view
router.get("/detail/:invId", utilities.handleErrors(inventoryController.buildByInventoryId));

// Route to trigger 500 error for assignment
router.get("/trigger-error", (req, res, next) => {
  const error = new Error("Intentional 500 Error - Testing Error Handling");
  error.status = 500;
  next(error);
});

module.exports = router;