const express = require("express");
const router = express.Router();
const staticController = require("../controllers/staticController");

// Home page route
router.get("/", staticController.buildHome);

module.exports = router;