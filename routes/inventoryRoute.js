const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController"); // FIXED: removed extra dot

router.get("/", invController.buildHome);
router.get("/inv/type/:classificationId", invController.buildByClassificationId);
router.get("/inv/detail/:invId", invController.buildByInventoryId);
router.get("/inv/trigger-error", invController.triggerError);

module.exports = router;