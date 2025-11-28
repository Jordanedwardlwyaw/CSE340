const accountModel = require("../models/accountModel");
const utilities = require("../utilities");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* ****************************************
 *  Deliver Login View
 * *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
    messages: req.flash(),
  });
}

/* ****************************************
 *  Deliver Registration View
 * *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
    messages: req.flash(),
  });
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_password } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.');
    return res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
      messages: req.flash(),
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "success",
      `Congratulations, you're registered ${account_firstname}. Please log in.`
    );
    return res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      messages: req.flash(),
    });
  } else {
    req.flash("error", "Sorry, the registration failed.");
    return res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
      messages: req.flash(),
    });
  }
}

/* ****************************************
 *  Process Login Request
 * *************************************** */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);

  if (!accountData) {
    req.flash("error", "Please check your credentials and try again.");
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      messages: req.flash(),
    });
  }

  try {
    const match = await bcrypt.compare(account_password, accountData.account_password);
    if (match) {
      // Create JWT token
      const token = jwt.sign(
        { 
          account_id: accountData.account_id,
          account_firstname: accountData.account_firstname,
          account_type: accountData.account_type 
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 }
      );

      if (process.env.NODE_ENV === 'development') {
        res.cookie("jwt", token, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", token, { httpOnly: true, secure: true, maxAge: 3600 * 1000 });
      }

      req.flash("success", `Welcome back, ${accountData.account_firstname}!`);
      return res.redirect("/account");
    } else {
      req.flash("error", "Please check your credentials and try again.");
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        messages: req.flash(),
      });
    }
  } catch (error) {
    req.flash("error", "Sorry, there was an error processing your login.");
    return res.status(500).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      messages: req.flash(),
    });
  }
}

/* ****************************************
 *  Deliver Account Management View
 * *************************************** */
async function buildManagement(req, res, next) {
  try {
    let nav = await utilities.getNav();
    
    // Get account data from JWT token
    const token = req.cookies.jwt;
    if (!token) {
      req.flash("error", "Please log in to access your account.");
      return res.redirect("/account/login");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const accountData = await accountModel.getAccountById(decodedToken.account_id);

    if (!accountData) {
      req.flash("error", "Account not found.");
      return res.redirect("/account/login");
    }

    res.render("account/management", {
      title: "Account Management",
      nav,
      accountData: accountData[0],
      messages: req.flash(),
    });
  } catch (error) {
    req.flash("error", "Please log in to access your account.");
    return res.redirect("/account/login");
  }
}

/* ****************************************
 *  Deliver Account Update View
 * *************************************** */
async function buildUpdate(req, res, next) {
  try {
    let nav = await utilities.getNav();
    const account_id = req.params.account_id;

    // Verify the logged-in user is updating their own account
    const token = req.cookies.jwt;
    if (!token) {
      req.flash("error", "Please log in to update your account.");
      return res.redirect("/account/login");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (decodedToken.account_id != account_id) {
      req.flash("error", "You can only update your own account.");
      return res.redirect("/account");
    }

    const accountData = await accountModel.getAccountById(account_id);
    
    if (!accountData || accountData.length === 0) {
      req.flash("error", "Account not found.");
      return res.redirect("/account");
    }

    res.render("account/update", {
      title: "Update Account",
      nav,
      accountData: accountData[0],
      errors: null,
      messages: req.flash(),
    });
  } catch (error) {
    req.flash("error", "Error accessing account update.");
    return res.redirect("/account");
  }
}

/* ****************************************
 *  Process Account Update
 * *************************************** */
async function updateAccount(req, res, next) {
  try {
    let nav = await utilities.getNav();
    const { account_id, account_firstname, account_lastname, account_email } = req.body;

    // Verify the logged-in user is updating their own account
    const token = req.cookies.jwt;
    if (!token) {
      req.flash("error", "Please log in to update your account.");
      return res.redirect("/account/login");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (decodedToken.account_id != account_id) {
      req.flash("error", "You can only update your own account.");
      return res.redirect("/account");
    }

    // Check if email already exists (excluding current account)
    const existingAccount = await accountModel.getAccountByEmail(account_email);
    if (existingAccount && existingAccount.account_id != account_id) {
      req.flash("error", "Email already exists. Please use a different email.");
      return res.render("account/update", {
        title: "Update Account",
        nav,
        accountData: { account_id, account_firstname, account_lastname, account_email },
        errors: null,
        messages: req.flash(),
      });
    }

    const updateResult = await accountModel.updateAccount(
      account_id,
      account_firstname,
      account_lastname,
      account_email
    );

    if (updateResult) {
      // Update JWT token with new first name
      const newToken = jwt.sign(
        { 
          account_id: updateResult.account_id,
          account_firstname: updateResult.account_firstname,
          account_type: updateResult.account_type 
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 }
      );

      if (process.env.NODE_ENV === 'development') {
        res.cookie("jwt", newToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", newToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 });
      }

      req.flash("success", "Account updated successfully.");
      res.redirect("/account");
    } else {
      req.flash("error", "Sorry, the update failed.");
      res.render("account/update", {
        title: "Update Account",
        nav,
        accountData: { account_id, account_firstname, account_lastname, account_email },
        errors: null,
        messages: req.flash(),
      });
    }
  } catch (error) {
    let nav = await utilities.getNav();
    req.flash("error", "Sorry, the update failed.");
    res.render("account/update", {
      title: "Update Account",
      nav,
      accountData: req.body,
      errors: null,
      messages: req.flash(),
    });
  }
}

/* ****************************************
 *  Process Password Change
 * *************************************** */
async function updatePassword(req, res, next) {
  try {
    let nav = await utilities.getNav();
    const { account_id, account_password } = req.body;

    // Verify the logged-in user is updating their own account
    const token = req.cookies.jwt;
    if (!token) {
      req.flash("error", "Please log in to update your password.");
      return res.redirect("/account/login");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (decodedToken.account_id != account_id) {
      req.flash("error", "You can only update your own password.");
      return res.redirect("/account");
    }

    // Hash the new password
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(account_password, 10);
    } catch (error) {
      req.flash("error", "Error processing password.");
      return res.render("account/update", {
        title: "Update Account",
        nav,
        accountData: await accountModel.getAccountById(account_id),
        errors: null,
        messages: req.flash(),
      });
    }

    const updateResult = await accountModel.updatePassword(
      account_id,
      hashedPassword
    );

    if (updateResult) {
      req.flash("success", "Password updated successfully.");
      res.redirect("/account");
    } else {
      req.flash("error", "Sorry, the password update failed.");
      res.render("account/update", {
        title: "Update Account",
        nav,
        accountData: await accountModel.getAccountById(account_id),
        errors: null,
        messages: req.flash(),
      });
    }
  } catch (error) {
    let nav = await utilities.getNav();
    req.flash("error", "Sorry, the password update failed.");
    res.render("account/update", {
      title: "Update Account",
      nav,
      accountData: await accountModel.getAccountById(req.body.account_id),
      errors: null,
      messages: req.flash(),
    });
  }
}

/* ****************************************
 *  Process Logout
 * *************************************** */
async function logout(req, res, next) {
  try {
    res.clearCookie("jwt");
    req.flash("success", "You have been logged out successfully.");
    res.redirect("/");
  } catch (error) {
    req.flash("error", "Error during logout.");
    res.redirect("/");
  }
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