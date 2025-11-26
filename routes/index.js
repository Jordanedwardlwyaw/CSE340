const express = require("express");
const router = express.Router();

// Static routes
router.use("/", require("./static"));

// Inventory routes
router.use("/inv", require("./inventoryRoute"));

// ACCOUNT ROUTES - THIS LINE MUST BE PRESENT
router.use("/account", require("./accountRoute"));

module.exports = router;