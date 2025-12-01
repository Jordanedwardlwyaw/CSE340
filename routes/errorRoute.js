const express = require("express");
const router = new express.Router();
const errorController = require("../controllers/errorController");

// Intentional error route for Assignment 3
router.get("/trigger-error", utilities.handleErrors(errorController.triggerError));

module.exports = router;