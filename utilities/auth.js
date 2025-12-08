// utilities/auth.js - NEW FILE
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ****************************************
 * JWT Authentication Middleware
 * REQUIRED for Tasks 5, 8
 **************************************** */
function checkJWTToken(req, res, next) {
  console.log("🔐 Checking JWT token...");
  const token = req.cookies.jwt;
  
  if (token) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET || "cse340-secret-key"
      );
      
      // Set user data in res.locals
      res.locals.loggedin = 1;
      res.locals.accountData = {
        account_id: decoded.account_id,
        account_firstname: decoded.account_firstname,
        account_lastname: decoded.account_lastname,
        account_email: decoded.account_email,
        account_type: decoded.account_type
      };
      
      console.log(`✅ User authenticated: ${decoded.account_firstname}`);
      
    } catch (error) {
      console.error("❌ JWT verification failed:", error.message);
      res.clearCookie("jwt");
      res.locals.loggedin = 0;
      res.locals.accountData = null;
    }
  } else {
    res.locals.loggedin = 0;
    res.locals.accountData = null;
  }
  next();
}

/* ****************************************
 * Authorization Middleware (Employee/Admin only)
 * REQUIRED for Task 2, 5
 **************************************** */
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    console.log(`🔐 Checking authorization for roles: ${allowedRoles.join(", ")}`);
    
    if (!res.locals.loggedin) {
      console.log("❌ Not logged in - redirecting to login");
      if (req.session) {
        req.session.messages = ["Please log in to access this page."];
      }
      return res.redirect("/account/login");
    }
    
    if (!allowedRoles.includes(res.locals.accountData?.account_type)) {
      console.log(`❌ User type ${res.locals.accountData?.account_type} not allowed`);
      if (req.session) {
        req.session.messages = ["You are not authorized to access this page."];
      }
      return res.redirect("/account/login");
    }
    
    console.log("✅ Authorization passed");
    next();
  };
}

module.exports = {
  checkJWTToken,
  authorizeRoles
};