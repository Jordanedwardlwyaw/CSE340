const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");

// Apply JWT check to all account routes
router.use(utilities.checkJWTToken);

// GET Routes
router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.get("/register", utilities.handleErrors(accountController.buildRegister));
router.get("/", utilities.handleErrors(accountController.buildManagement)); // Account management
router.get("/update", utilities.handleErrors(accountController.buildUpdate)); // Update view
router.get("/logout", utilities.handleErrors(accountController.logout)); // Logout

// POST Routes
router.post("/login", utilities.handleErrors(accountController.accountLogin));
router.post("/register", utilities.handleErrors(accountController.registerAccount));
router.post("/update", utilities.handleErrors(accountController.updateAccount)); // Update account
router.post("/update-password", utilities.handleErrors(accountController.updatePassword)); // Update password

module.exports = router;