// controllers/accountController.js
const accountModel = require("../models/account-model");
const utilities = require("../utilities");
const bcrypt = require("bcryptjs");

/* ****************************************
 * Deliver login view
 **************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav(null);
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  });
}

/* ****************************************
 * Deliver registration view
 **************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav(null);
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}

/* ****************************************
 * Process registration
 **************************************** */
async function registerAccount(req, res) {
  try {
    console.log("📝 Registration attempt started...");
    const { account_firstname, account_lastname, account_email, account_password } = req.body;
    
    // Validate input
    if (!account_firstname || !account_lastname || !account_email || !account_password) {
      req.session.messages = ["All fields are required."];
      return res.redirect("/account/register");
    }
    
    // Validate password
    if (!utilities.validatePassword(account_password)) {
      req.session.messages = ["Password must be at least 12 characters with uppercase, lowercase, number, and special character."];
      return res.redirect("/account/register");
    }
    
    // Check if email already exists
    const existingAccount = await accountModel.getAccountByEmail(account_email);
    if (existingAccount) {
      req.session.messages = ["Email already registered. Please use a different email or login."];
      return res.redirect("/account/register");
    }
    
    // Hash password
    console.log("🔐 Hashing password...");
    const hashedPassword = await bcrypt.hash(account_password, 10);
    
    // Register account
    console.log("💾 Saving account to database...");
    const result = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    );
    
    if (result) {
      console.log("✅ Registration successful for:", account_email);
      req.session.messages = ["Registration successful! Please log in."];
      res.redirect("/account/login");
    } else {
      console.log("❌ Registration failed for:", account_email);
      req.session.messages = ["Registration failed. Please try again."];
      res.redirect("/account/register");
    }
  } catch (error) {
    console.error("🔥 Registration error:", error);
    req.session.messages = ["Registration failed due to server error."];
    res.redirect("/account/register");
  }
}

/* ****************************************
 * Process login WITH JWT
 * FIXED VERSION - NO 500 ERRORS
 **************************************** */
async function accountLogin(req, res) {
  try {
    console.log("\n🔐 LOGIN PROCESS STARTED ==================================");
    console.log("📧 Email from form:", req.body.account_email);
    
    const { account_email, account_password } = req.body;
    
    // Validate input
    if (!account_email || !account_password) {
      console.log("❌ Missing email or password");
      req.session.messages = ["Please provide email and password."];
      return res.redirect("/account/login");
    }
    
    console.log("🔍 Looking for account in database...");
    const accountData = await accountModel.getAccountByEmail(account_email);
    
    if (!accountData) {
      console.log("❌ Account not found:", account_email);
      req.session.messages = ["Invalid email or password."];
      return res.redirect("/account/login");
    }
    
    console.log("✅ Account found:", {
      id: accountData.account_id,
      name: accountData.account_firstname + " " + accountData.account_lastname,
      type: accountData.account_type
    });
    
    console.log("🔐 Checking password...");
    const isPasswordValid = await bcrypt.compare(account_password, accountData.account_password);
    
    if (!isPasswordValid) {
      console.log("❌ Password incorrect for:", account_email);
      req.session.messages = ["Invalid email or password."];
      return res.redirect("/account/login");
    }
    
    console.log("✅ Password correct!");
    
    // ============================================
    // CREATE JWT TOKEN (FIXED)
    // ============================================
    console.log("🎫 Creating JWT token...");
    
    // Check if ACCESS_TOKEN_SECRET exists
    if (!process.env.ACCESS_TOKEN_SECRET) {
      console.error("❌ CRITICAL: ACCESS_TOKEN_SECRET not found in .env!");
      console.error("   Using fallback secret for development ONLY");
      // Fallback for development
      process.env.ACCESS_TOKEN_SECRET = "cse340-development-fallback-secret-2025-02-15";
    }
    
    // Create payload
    const payload = {
      account_id: accountData.account_id,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
      account_type: accountData.account_type || "Client"
    };
    
    console.log("📄 JWT Payload:", payload);
    
    // Try to use utilities.createJWT if it exists, otherwise create directly
    let token;
    try {
      if (typeof utilities.createJWT === 'function') {
        token = utilities.createJWT(accountData);
      } else {
        console.log("⚠️ utilities.createJWT not found, creating token directly...");
        const jwt = require("jsonwebtoken");
        token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
      }
    } catch (jwtError) {
      console.error("❌ JWT creation error:", jwtError);
      throw new Error("JWT creation failed: " + jwtError.message);
    }
    
    if (!token) {
      console.error("❌ Token creation returned null/undefined");
      throw new Error("Token creation failed");
    }
    
    console.log("✅ JWT Token created (length:", token.length, "chars)");
    
    // ============================================
    // SET COOKIE
    // ============================================
    console.log("🍪 Setting JWT cookie...");
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000, // 1 hour in milliseconds
      sameSite: 'strict'
    });
    
    console.log("✅ Login successful for:", account_email);
    console.log("   Account type:", accountData.account_type);
    console.log("===============================================\n");
    
    req.session.messages = [`Welcome back ${accountData.account_firstname}!`];
    res.redirect("/account");
    
  } catch (error) {
    console.error("\n🔥🔥🔥 LOGIN ERROR 🔥🔥🔥");
    console.error("Error type:", error.constructor.name);
    console.error("Error message:", error.message);
    console.error("Full error:", error);
    console.error("Stack trace:", error.stack);
    
    req.session.messages = ["An error occurred during login. Please try again."];
    res.redirect("/account/login");
  }
}

/* ****************************************
 * Deliver account management view
 * REQUIRED for Task 3
 **************************************** */
async function buildManagement(req, res) {
  try {
    console.log("📋 Building account management view...");
    
    if (!res.locals.loggedin || !res.locals.accountData) {
      console.log("❌ Not logged in, redirecting to login");
      req.session.messages = ["Please login to access account management."];
      return res.redirect("/account/login");
    }
    
    const nav = await utilities.getNav(null);
    const accountData = await accountModel.getAccountById(res.locals.accountData.account_id);
    
    if (!accountData) {
      console.log("❌ Account not found in database for ID:", res.locals.accountData.account_id);
      req.session.messages = ["Account not found."];
      return res.redirect("/account/login");
    }
    
    res.render("account/management", {
      title: "Account Management",
      nav,
      accountData: accountData,
      account_type: res.locals.accountData.account_type,
      errors: null,
    });
    
  } catch (error) {
    console.error("Account management error:", error);
    req.session.messages = ["Error loading account management."];
    res.redirect("/");
  }
}

/* ****************************************
 * Deliver account update view
 * REQUIRED for Task 4
 **************************************** */
async function buildUpdate(req, res) {
  try {
    console.log("📝 Building account update view...");
    
    if (!res.locals.loggedin || !res.locals.accountData) {
      req.session.messages = ["Please login to update account."];
      return res.redirect("/account/login");
    }
    
    const nav = await utilities.getNav(null);
    const accountData = await accountModel.getAccountById(res.locals.accountData.account_id);
    
    res.render("account/update", {
      title: "Update Account",
      nav,
      accountData: accountData,
      errors: null,
    });
    
  } catch (error) {
    console.error("Update view error:", error);
    req.session.messages = ["Error loading update form."];
    res.redirect("/account");
  }
}

/* ****************************************
 * Process account update
 * REQUIRED for Task 5
 **************************************** */
async function updateAccount(req, res) {
  try {
    const { account_id, account_firstname, account_lastname, account_email } = req.body;
    
    // Server-side validation
    if (!account_firstname || !account_lastname || !account_email) {
      req.session.messages = ["All fields are required."];
      return res.redirect("/account/update");
    }
    
    const updateResult = await accountModel.updateAccount(
      account_id,
      account_firstname,
      account_lastname,
      account_email
    );
    
    if (updateResult) {
      req.session.messages = ["Account updated successfully!"];
    } else {
      req.session.messages = ["Account update failed."];
    }
    
    res.redirect("/account");
    
  } catch (error) {
    console.error("Update account error:", error);
    req.session.messages = ["Error updating account."];
    res.redirect("/account/update");
  }
}

/* ****************************************
 * Process password update
 * REQUIRED for Task 5
 **************************************** */
async function updatePassword(req, res) {
  try {
    const { account_id, account_password } = req.body;
    
    // Validate password
    if (!account_password || account_password.length < 12) {
      req.session.messages = ["Password must be at least 12 characters."];
      return res.redirect("/account/update");
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(account_password, 10);
    
    const updateResult = await accountModel.updatePassword(account_id, hashedPassword);
    
    if (updateResult) {
      req.session.messages = ["Password updated successfully!"];
    } else {
      req.session.messages = ["Password update failed."];
    }
    
    res.redirect("/account");
    
  } catch (error) {
    console.error("Update password error:", error);
    req.session.messages = ["Error updating password."];
    res.redirect("/account/update");
  }
}

/* ****************************************
 * Process logout
 * REQUIRED for Task 6
 **************************************** */
function logout(req, res) {
  console.log("👋 Logging out user...");
  res.clearCookie("jwt");
  req.session.messages = ["You have been logged out."];
  res.redirect("/");
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildManagement,
  buildUpdate,
  updateAccount,
  updatePassword,
  logout
};