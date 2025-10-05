// In the routes/inventoryRoute.js file
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const inventoryController = require("../controllers/inventoryController")

// Route to build inventory by classification view
router.get("/type/:classificationId", inventoryController.buildByClassificationId);

// Vehicle Detail Route
router.get("/detail/:id", utilities.handleErrors(inventoryController.buildDetail))

// Broken route
router.get("/broken", utilities.handleErrors(inventoryController.throwError))

module.exports = router;