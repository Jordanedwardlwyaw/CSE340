const accountModel = require("../models/account-model");
const utilities = require("../utilities/");

const accountController = {};

/* ***************************
 *  Build main account view
 * ************************** */
accountController.buildManagement = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("account/management", {
      title: "Account Management",
      nav,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Build login view
 * ************************** */
accountController.buildLogin = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Process login
 * ************************** */
accountController.accountLogin = async function (req, res, next) {
  try {
    // Add your login logic here
    req.flash("notice", "Login functionality not implemented yet");
    res.redirect("/account/");
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Build registration view
 * ************************** */
accountController.buildRegister = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Process registration
 * ************************** */
accountController.registerAccount = async function (req, res, next) {
  try {
    // Add your registration logic here
    req.flash("notice", "Registration functionality not implemented yet");
    res.redirect("/account/");
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Build account update view
 * ************************** */
accountController.buildUpdate = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Process account update
 * ************************** */
accountController.updateAccount = async function (req, res, next) {
  try {
    // Add your update logic here
    req.flash("notice", "Account update functionality not implemented yet");
    res.redirect("/account/");
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Process password change
 * ************************** */
accountController.changePassword = async function (req, res, next) {
  try {
    // Add your password change logic here
    req.flash("notice", "Password change functionality not implemented yet");
    res.redirect("/account/");
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Process logout
 * ************************** */
accountController.accountLogout = async function (req, res, next) {
  try {
    // Add your logout logic here
    req.flash("notice", "Logout functionality not implemented yet");
    res.redirect("/");
  } catch (error) {
    next(error);
  }
};

module.exports = accountController;