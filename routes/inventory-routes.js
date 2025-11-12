const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController");

// Detail page for a vehicle
router.get("/detail/:inv_id", inventoryController.buildVehicleDetail);

// Classification page
router.get("/type/:classificationId", inventoryController.buildClassificationView);

// Intentional 500 error test
router.get("/error-test", (req, res, next) => {
  try {
    throw new Error("Intentional server error for testing");
  } catch (err) {
    next(err);
  }
});

module.exports = router;