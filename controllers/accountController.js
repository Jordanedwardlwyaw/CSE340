const accountModel = require("../models/account-model");
const utilities = require("../utilities");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const accountController = {};

/* ****************************************
 * Deliver login view
 * *************************************** */
accountController.buildLogin = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email: "",
    });
  } catch (error) {
    next(error);
  }
};

/* ****************************************
 * Process login with validation
 * *************************************** */
accountController.accountLogin = async function (req, res, next) {
  try {
    const { account_email, account_password } = req.body;
    const nav = await utilities.getNav();
    
    // CLIENT-SIDE VALIDATION: Check if fields are empty
    if (!account_email || !account_password) {
      return res.render("account/login", {
        title: "Login",
        nav,
        errors: [{ msg: "Please fill in all fields." }],
        account_email,
      });
    }
    
    // SERVER-SIDE VALIDATION: Check if account exists
    const accountData = await accountModel.getAccountByEmail(account_email);
    
    if (!accountData) {
      return res.render("account/login", {
        title: "Login",
        nav,
        errors: [{ msg: "Invalid email or password." }],
        account_email,
      });
    }
    
    // SERVER-SIDE VALIDATION: Check password
    const passwordMatch = await bcrypt.compare(account_password, accountData.account_password);
    
    if (!passwordMatch) {
      return res.render("account/login", {
        title: "Login",
        nav,
        errors: [{ msg: "Invalid email or password." }],
        account_email,
      });
    }
    
    // Create JWT token (REQUIRED for JWT functionality)
    delete accountData.account_password;
    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 });
    
    // Set cookie
    if (process.env.NODE_ENV === "development") {
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
    } else {
      res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 });
    }
    
    return res.redirect("/account");
  } catch (error) {
    next(error);
  }
};

/* ****************************************
 * Deliver registration view
 * *************************************** */
accountController.buildRegister = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null,
      account_firstname: "",
      account_lastname: "",
      account_email: "",
    });
  } catch (error) {
    next(error);
  }
};

/* ****************************************
 * Process registration with validation
 * *************************************** */
accountController.registerAccount = async function (req, res, next) {
  try {
    const { account_firstname, account_lastname, account_email, account_password } = req.body;
    const nav = await utilities.getNav();
    
    // CLIENT-SIDE VALIDATION: Check if fields are empty
    if (!account_firstname || !account_lastname || !account_email || !account_password) {
      return res.render("account/register", {
        title: "Register",
        nav,
        errors: [{ msg: "Please fill in all fields." }],
        account_firstname,
        account_lastname,
        account_email,
      });
    }
    
    // SERVER-SIDE VALIDATION: Password requirements
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{12,}$/;
    if (!passwordRegex.test(account_password)) {
      return res.render("account/register", {
        title: "Register",
        nav,
        errors: [{ msg: "Password must be at least 12 characters with uppercase, lowercase, number, and special character." }],
        account_firstname,
        account_lastname,
        account_email,
      });
    }
    
    // SERVER-SIDE VALIDATION: Check if email exists
    const existingAccount = await accountModel.getAccountByEmail(account_email);
    
    if (existingAccount) {
      return res.render("account/register", {
        title: "Register",
        nav,
        errors: [{ msg: "Email already exists. Please log in." }],
        account_firstname,
        account_lastname,
        account_email,
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(account_password, 10);
    
    // Register account
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    );
    
    if (regResult) {
      req.session.messages = ["Account created successfully. Please log in."];
      return res.redirect("/account/login");
    } else {
      throw new Error("Registration failed.");
    }
  } catch (error) {
    next(error);
  }
};

/* ****************************************
 * Deliver account management view
 * WITH DIFFERENT GREETINGS BASED ON ACCOUNT TYPE (REQUIRED)
 * *************************************** */
accountController.buildManagement = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    
    if (!res.locals.accountData) {
      req.session.messages = ["Please log in to view account management."];
      return res.redirect("/account/login");
    }
    
    const accountData = res.locals.accountData;
    
    res.render("account/management", {
      title: "Account Management",
      nav,
      errors: null,
      accountData: accountData,
    });
  } catch (error) {
    next(error);
  }
};

/* ****************************************
 * Deliver account update view
 * *************************************** */
accountController.buildUpdate = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    const accountId = req.params.accountId;
    
    if (!res.locals.accountData || res.locals.accountData.account_id != accountId) {
      req.session.messages = ["Please log in to update your account."];
      return res.redirect("/account/login");
    }
    
    const accountData = await accountModel.getAccountById(accountId);
    
    if (!accountData) {
      req.session.messages = ["Account not found."];
      return res.redirect("/account");
    }
    
    res.render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      accountData,
    });
  } catch (error) {
    next(error);
  }
};

/* ****************************************
 * Process account update with validation
 * *************************************** */
accountController.updateAccount = async function (req, res, next) {
  try {
    const { account_id, account_firstname, account_lastname, account_email } = req.body;
    const nav = await utilities.getNav();
    
    // SERVER-SIDE VALIDATION: Check if fields are empty
    if (!account_firstname || !account_lastname || !account_email) {
      const accountData = await accountModel.getAccountById(account_id);
      return res.render("account/update", {
        title: "Update Account",
        nav,
        errors: [{ msg: "Please fill in all fields." }],
        accountData: { ...accountData, account_firstname, account_lastname, account_email },
      });
    }
    
    // SERVER-SIDE VALIDATION: Check if email is being changed and exists
    const existingAccount = await accountModel.getAccountByEmail(account_email);
    if (existingAccount && existingAccount.account_id != account_id) {
      const accountData = await accountModel.getAccountById(account_id);
      return res.render("account/update", {
        title: "Update Account",
        nav,
        errors: [{ msg: "Email already exists. Please use a different email." }],
        accountData: { ...accountData, account_firstname, account_lastname, account_email },
      });
    }
    
    // Update account
    const updateResult = await accountModel.updateAccount(
      account_id,
      account_firstname,
      account_lastname,
      account_email
    );
    
    if (updateResult) {
      // Get updated account data
      const updatedAccount = await accountModel.getAccountById(account_id);
      
      // Update JWT token
      delete updatedAccount.account_password;
      const accessToken = jwt.sign(updatedAccount, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 });
      
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 });
      }
      
      req.session.messages = ["Account updated successfully."];
      return res.redirect("/account");
    } else {
      throw new Error("Account update failed.");
    }
  } catch (error) {
    next(error);
  }
};

/* ****************************************
 * Process password update with validation
 * *************************************** */
accountController.updatePassword = async function (req, res, next) {
  try {
    const { account_id, account_password } = req.body;
    const nav = await utilities.getNav();
    
    // SERVER-SIDE VALIDATION: Password requirements
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{12,}$/;
    if (!passwordRegex.test(account_password)) {
      const accountData = await accountModel.getAccountById(account_id);
      return res.render("account/update", {
        title: "Update Account",
        nav,
        errors: [{ msg: "Password must be at least 12 characters with uppercase, lowercase, number, and special character." }],
        accountData,
      });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(account_password, 10);
    
    // Update password
    const updateResult = await accountModel.updatePassword(account_id, hashedPassword);
    
    if (updateResult) {
      req.session.messages = ["Password updated successfully."];
      return res.redirect("/account");
    } else {
      throw new Error("Password update failed.");
    }
  } catch (error) {
    next(error);
  }
};

/* ****************************************
 * Process logout (REQUIRED for logout functionality)
 * *************************************** */
accountController.logout = async function (req, res, next) {
  try {
    // Clear JWT cookie
    res.clearCookie("jwt");
    
    // Clear session data
    if (req.session) {
      req.session.destroy();
    }
    
    req.session.messages = ["You have been logged out."];
    res.redirect("/");
  } catch (error) {
    next(error);
  }
};

module.exports = accountController;