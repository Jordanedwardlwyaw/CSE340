const express = require("express");
const router = express.Router();

// Static routes
router.use("/", require("./static"));

// INVENTORY ROUTES - Use the simple version
router.use("/inv", require("./inventoryRoute"));

// ACCOUNT ROUTES 
router.use("/account", require("./accountRoute"));

// About route
router.use("/", require("./about"));

// Contact route  
router.use("/", require("./contact"));

module.exports = router;