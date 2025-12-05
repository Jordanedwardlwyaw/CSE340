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
    
    // SERVER-SIDE VALIDATION
    if (!account_email || !account_password) {
      return res.render("account/login", {
        title: "Login",
        nav,
        errors: [{ msg: "Please fill in all fields." }],
        account_email,
      });
    }
    
    const accountData = await accountModel.getAccountByEmail(account_email);
    
    if (!accountData) {
      return res.render("account/login", {
        title: "Login",
        nav,
        errors: [{ msg: "Invalid email or password." }],
        account_email,
      });
    }
    
    const passwordMatch = await bcrypt.compare(account_password, accountData.account_password);
    
    if (!passwordMatch) {
      return res.render("account/login", {
        title: "Login",
        nav,
        errors: [{ msg: "Invalid email or password." }],
        account_email,
      });
    }
    
    // CREATE JWT TOKEN
    delete accountData.account_password;
    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 });
    
    res.cookie("jwt", accessToken, { 
      httpOnly: true, 
      maxAge: 3600 * 1000,
      secure: process.env.NODE_ENV === "production"
    });
    
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
    
    // SERVER-SIDE VALIDATION
    const errors = [];
    
    if (!account_firstname) errors.push({ msg: "First name is required." });
    if (!account_lastname) errors.push({ msg: "Last name is required." });
    if (!account_email) errors.push({ msg: "Email is required." });
    if (!account_password) errors.push({ msg: "Password is required." });
    
    if (account_password && !utilities.validatePassword(account_password)) {
      errors.push({ msg: "Password must be at least 12 characters with uppercase, lowercase, number, and special character." });
    }
    
    if (account_email && !utilities.validateEmail(account_email)) {
      errors.push({ msg: "Please enter a valid email address." });
    }
    
    if (errors.length > 0) {
      return res.render("account/register", {
        title: "Register",
        nav,
        errors,
        account_firstname,
        account_lastname,
        account_email,
      });
    }
    
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
    
    const hashedPassword = await bcrypt.hash(account_password, 10);
    
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
 * WITH DIFFERENT GREETINGS BASED ON ACCOUNT TYPE
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
      // Pass account type for conditional rendering
      accountType: accountData.account_type
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
    
    // SERVER-SIDE VALIDATION
    const errors = [];
    
    if (!account_firstname) errors.push({ msg: "First name is required." });
    if (!account_lastname) errors.push({ msg: "Last name is required." });
    if (!account_email) errors.push({ msg: "Email is required." });
    
    if (account_email && !utilities.validateEmail(account_email)) {
      errors.push({ msg: "Please enter a valid email address." });
    }
    
    if (errors.length > 0) {
      const accountData = await accountModel.getAccountById(account_id);
      return res.render("account/update", {
        title: "Update Account",
        nav,
        errors,
        accountData: { ...accountData, account_firstname, account_lastname, account_email },
      });
    }
    
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
    
    const updateResult = await accountModel.updateAccount(
      account_id,
      account_firstname,
      account_lastname,
      account_email
    );
    
    if (updateResult) {
      const updatedAccount = await accountModel.getAccountById(account_id);
      delete updatedAccount.account_password;
      
      const accessToken = jwt.sign(updatedAccount, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 });
      
      res.cookie("jwt", accessToken, { 
        httpOnly: true, 
        maxAge: 3600 * 1000,
        secure: process.env.NODE_ENV === "production"
      });
      
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
    
    // SERVER-SIDE VALIDATION
    const errors = [];
    
    if (!account_password) {
      errors.push({ msg: "Password is required." });
    } else if (!utilities.validatePassword(account_password)) {
      errors.push({ msg: "Password must be at least 12 characters with uppercase, lowercase, number, and special character." });
    }
    
    if (errors.length > 0) {
      const accountData = await accountModel.getAccountById(account_id);
      return res.render("account/update", {
        title: "Update Account",
        nav,
        errors,
        accountData,
      });
    }
    
    const hashedPassword = await bcrypt.hash(account_password, 10);
    
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
 * Process logout
 * *************************************** */
accountController.logout = async function (req, res, next) {
  try {
    res.clearCookie("jwt");
    req.session.messages = ["You have been logged out."];
    res.redirect("/");
  } catch (error) {
    next(error);
  }
};

module.exports = accountController;