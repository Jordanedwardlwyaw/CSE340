const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");

// GET routes
router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.get("/register", utilities.handleErrors(accountController.buildRegister));
router.get("/", utilities.handleErrors(accountController.buildManagement));
router.get("/update/:accountId", utilities.handleErrors(accountController.buildUpdate));
router.get("/logout", utilities.handleErrors(accountController.logout));

// POST routes
router.post("/login", utilities.handleErrors(accountController.accountLogin));
router.post("/register", utilities.handleErrors(accountController.registerAccount));
router.post("/update", utilities.handleErrors(accountController.updateAccount));
router.post("/update-password", utilities.handleErrors(accountController.updatePassword));

module.exports = router;