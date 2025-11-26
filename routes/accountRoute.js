const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");

// Account management routes
router.get("/", accountController.buildManagement);  // This handles "/account"

// Login routes
router.get("/login", accountController.buildLogin);
router.post("/login", accountController.accountLogin);

// Registration routes
router.get("/register", accountController.buildRegister);
router.post("/register", accountController.registerAccount);

// Account update routes
router.get("/update", accountController.buildUpdate);
router.post("/update", accountController.updateAccount);
router.post("/change-password", accountController.changePassword);

// Logout route
router.get("/logout", accountController.accountLogout);

module.exports = router;