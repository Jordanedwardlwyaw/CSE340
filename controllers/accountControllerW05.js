// controllers/accountControllerW05.js
const accountModel = require("../models/account-model");
const utilities = require("../utilities");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* ****************************************
 * Deliver Account Management View
 * REQUIRED for Task 3
 **************************************** */
async function buildAccountManagement(req, res) {
  try {
    console.log("👤 Building account management view...");
    console.log("   - loggedin:", res.locals.loggedin);
    
    if (!res.locals.loggedin) {
      console.log("❌ Not logged in - redirecting");
      if (req.session) {
        req.session.messages = ["Please log in to view your account."];
      }
      return res.redirect("/account/login");
    }
    
    // Use getNav if getNavWithAuth doesn't exist yet
    let nav;
    try {
      nav = await utilities.getNavWithAuth(null, res.locals.loggedin, res.locals.accountData);
    } catch {
      nav = await utilities.getNav(null);
    }
    
    const accountData = res.locals.accountData || { account_firstname: "User", account_type: "Client", account_id: 0 };
    
    // Determine greeting based on account type (Task 3)
    let greeting = "";
    let inventoryManagement = "";
    
    if (accountData.account_type === "Client") {
      // Client: Only show greeting (NO <h2> element as per requirements)
      greeting = `<p class="welcome-message">Welcome ${accountData.account_firstname}</p>`;
    } else if (accountData.account_type === "Employee" || accountData.account_type === "Admin") {
      // Employee/Admin: Show greeting AND inventory management
      greeting = `<h2>Welcome ${accountData.account_firstname}</h2>`;
      inventoryManagement = `
        <div class="management-section">
          <h3>Inventory Management</h3>
          <p><a href="/inv/management" class="btn btn-primary">Access Inventory Management</a></p>
        </div>
      `;
    }
    
    res.render("account/account-management", {
      title: "Account Management",
      nav,
      greeting,
      inventoryManagement,
      account_id: accountData.account_id || 0,
      errors: null,
    });
    
  } catch (error) {
    console.error("❌ Account management error:", error);
    if (req.session) {
      req.session.messages = ["Error loading account management."];
    }
    res.redirect("/");
  }
}

/* ****************************************
 * Process Login Request & Create JWT
 * REQUIRED for Tasks 5, 8
 **************************************** */
async function accountLogin(req, res) {
  try {
    console.log("🔐 Processing login...");
    const { account_email, account_password } = req.body;
    
    if (!account_email || !account_password) {
      if (req.session) {
        req.session.messages = ["Please enter both email and password."];
      }
      return res.redirect("/account/login");
    }
    
    // Get account data
    const accountData = await accountModel.getAccountByEmail(account_email);
    
    if (!accountData) {
      console.log("❌ Account not found:", account_email);
      if (req.session) {
        req.session.messages = ["Invalid email or password."];
      }
      return res.redirect("/account/login");
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(account_password, accountData.account_password);
    
    if (!isPasswordValid) {
      console.log("❌ Invalid password for:", account_email);
      if (req.session) {
        req.session.messages = ["Invalid email or password."];
      }
      return res.redirect("/account/login");
    }
    
    // Create JWT token (Task 8)
    const token = jwt.sign(
      {
        account_id: accountData.account_id,
        account_firstname: accountData.account_firstname,
        account_lastname: accountData.account_lastname,
        account_email: accountData.account_email,
        account_type: accountData.account_type
      },
      process.env.ACCESS_TOKEN_SECRET || "cse340-secret-key",
      { expiresIn: "1h" }
    );
    
    // Set cookie (Task 8)
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000 // 1 hour
    });
    
    console.log("✅ Login successful for:", accountData.account_email);
    
    if (req.session) {
      req.session.messages = ["Login successful!"];
    }
    res.redirect("/account");
    
  } catch (error) {
    console.error("❌ Login error:", error);
    if (req.session) {
      req.session.messages = ["An error occurred during login."];
    }
    res.redirect("/account/login");
  }
}

/* ****************************************
 * Deliver Account Update View
 * REQUIRED for Task 1, 4
 **************************************** */
async function buildUpdateAccount(req, res) {
  try {
    console.log("📝 Building update account view...");
    
    if (!res.locals.loggedin) {
      if (req.session) {
        req.session.messages = ["Please log in to update your account."];
      }
      return res.redirect("/account/login");
    }
    
    const account_id = parseInt(req.params.account_id) || res.locals.accountData?.account_id;
    const accountData = await accountModel.getAccountById(account_id);
    
    if (!accountData) {
      if (req.session) {
        req.session.messages = ["Account not found."];
      }
      return res.redirect("/account");
    }
    
    // Use getNav if getNavWithAuth doesn't exist yet
    let nav;
    try {
      nav = await utilities.getNavWithAuth(null, res.locals.loggedin, res.locals.accountData);
    } catch {
      nav = await utilities.getNav(null);
    }
    
    res.render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      account_id: accountData.account_id,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email
    });
    
  } catch (error) {
    console.error("❌ Update account view error:", error);
    if (req.session) {
      req.session.messages = ["Error loading update form."];
    }
    res.redirect("/account");
  }
}

/* ****************************************
 * Process Account Update
 * REQUIRED for Tasks 4, 5, 6, 10
 **************************************** */
async function updateAccount(req, res) {
  try {
    console.log("🔄 Processing account update...");
    const { account_id, account_firstname, account_lastname, account_email } = req.body;
    
    // Server-side validation (Task 10)
    if (!account_firstname || !account_lastname || !account_email) {
      if (req.session) {
        req.session.messages = ["All fields are required."];
      }
      return res.redirect(`/account/update/${account_id}`);
    }
    
    if (!utilities.validateEmail(account_email)) {
      if (req.session) {
        req.session.messages = ["Please enter a valid email address."];
      }
      return res.redirect(`/account/update/${account_id}`);
    }
    
    // Check if email exists (only if changed)
    const currentAccount = await accountModel.getAccountById(account_id);
    if (currentAccount && currentAccount.account_email !== account_email) {
      const existingAccount = await accountModel.getAccountByEmail(account_email);
      if (existingAccount && existingAccount.account_id !== parseInt(account_id)) {
        if (req.session) {
          req.session.messages = ["Email already exists."];
        }
        return res.redirect(`/account/update/${account_id}`);
      }
    }
    
    // Update account (Task 6)
    const result = await accountModel.updateAccount(
      account_id,
      account_firstname,
      account_lastname,
      account_email
    );
    
    if (result) {
      console.log("✅ Account updated successfully");
      if (req.session) {
        req.session.messages = ["Account updated successfully."];
      }
      res.redirect("/account");
    } else {
      if (req.session) {
        req.session.messages = ["Failed to update account."];
      }
      res.redirect(`/account/update/${account_id}`);
    }
  } catch (error) {
    console.error("❌ Update account error:", error);
    if (req.session) {
      req.session.messages = ["Error updating account."];
    }
    res.redirect("/account");
  }
}

/* ****************************************
 * Process Password Change
 * REQUIRED for Tasks 4, 5, 6, 10
 **************************************** */
async function changePassword(req, res) {
  try {
    console.log("🔒 Processing password change...");
    const { account_id, account_password } = req.body;
    
    // Server-side validation (Task 10)
    if (!utilities.validatePassword(account_password)) {
      if (req.session) {
        req.session.messages = ["Password must be at least 12 characters with uppercase, lowercase, number, and special character."];
      }
      return res.redirect(`/account/update/${account_id}`);
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(account_password, 10);
    
    // Update password (Task 6)
    const result = await accountModel.updatePassword(account_id, hashedPassword);
    
    if (result) {
      console.log("✅ Password changed successfully");
      if (req.session) {
        req.session.messages = ["Password changed successfully."];
      }
      res.redirect("/account");
    } else {
      if (req.session) {
        req.session.messages = ["Failed to change password."];
      }
      res.redirect(`/account/update/${account_id}`);
    }
  } catch (error) {
    console.error("❌ Change password error:", error);
    if (req.session) {
      req.session.messages = ["Error changing password."];
    }
    res.redirect("/account");
  }
}

/* ****************************************
 * Logout Process
 * REQUIRED for Task 9
 **************************************** */
async function logout(req, res) {
  try {
    console.log("🚪 Processing logout...");
    
    // Clear JWT cookie (Task 9)
    res.clearCookie("jwt");
    
    console.log("✅ Logout successful");
    
    if (req.session) {
      req.session.messages = ["You have been logged out."];
    }
    res.redirect("/");
  } catch (error) {
    console.error("❌ Logout error:", error);
    if (req.session) {
      req.session.messages = ["Error during logout."];
    }
    res.redirect("/account");
  }
}

module.exports = {
  buildAccountManagement,
  accountLogin,
  buildUpdateAccount,
  updateAccount,
  changePassword,
  logout
};