// routes/accountRouteW05.js - UPDATED VERSION
const express = require("express");
const router = express.Router();
const accountControllerW05 = require("../controllers/accountControllerW05");
const utilities = require("../utilities");

// Check if original accountController exists
let accountController;
try {
  accountController = require("../controllers/accountController");
} catch (error) {
  console.log("⚠️ Original accountController not found, using W05 version only");
  // Create simple fallback functions
  accountController = {
    buildLogin: async (req, res, next) => {
      let nav = await utilities.getNavWithAuth(null, res.locals.loggedin, res.locals.accountData);
      res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
      });
    },
    buildRegister: async (req, res, next) => {
      let nav = await utilities.getNavWithAuth(null, res.locals.loggedin, res.locals.accountData);
      res.render("account/register", {
        title: "Register",
        nav,
        errors: null,
      });
    },
    registerAccount: async (req, res) => {
      req.session.messages = ["Registration not implemented."];
      res.redirect("/account/register");
    }
  };
}

// Use existing login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Use W05 login processing (with JWT)
router.post("/login", utilities.handleErrors(accountControllerW05.accountLogin));

// Use existing registration
router.get("/register", utilities.handleErrors(accountController.buildRegister));
router.post("/register", utilities.handleErrors(accountController.registerAccount));

// W05 Account management routes
router.get("/", utilities.handleErrors(accountControllerW05.buildAccountManagement));

// Update account routes
router.get("/update/:account_id", utilities.handleErrors(accountControllerW05.buildUpdateAccount));
router.post("/update", utilities.handleErrors(accountControllerW05.updateAccount));
router.post("/change-password", utilities.handleErrors(accountControllerW05.changePassword));

// Logout route
router.get("/logout", utilities.handleErrors(accountControllerW05.logout));

module.exports = router;