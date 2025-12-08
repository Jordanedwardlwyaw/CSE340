// ====================================================
// JWT AND AUTHENTICATION MIDDLEWARE
// ====================================================

const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ****************************************
 * Check JWT token and set account data
 * REQUIRED for Tasks 1, 2, 3, 5: JWT middleware
 **************************************** */
utilities.checkJWTToken = (req, res, next) => {
  console.log("🔄 checkJWTToken middleware running");
  console.log("   - Cookies present:", req.cookies ? 'Yes' : 'No');
  console.log("   - JWT cookie present:", req.cookies?.jwt ? 'Yes' : 'No');
  
  if (req.cookies && req.cookies.jwt) {
    try {
      const accountData = jwt.verify(
        req.cookies.jwt,
        process.env.ACCESS_TOKEN_SECRET || "cse340-secret-key-change-me"
      );
      
      console.log("✅ JWT verified successfully");
      console.log("   - Account email:", accountData.account_email);
      console.log("   - Account type:", accountData.account_type);
      console.log("   - First name:", accountData.account_firstname);
      
      // Set res.locals for use in views - IMPORTANT for Task 1 & 3
      res.locals.loggedin = 1;
      res.locals.accountData = accountData;
      
      // Also set individual properties for easy access (REQUIRED for Task 3)
      res.locals.account_firstname = accountData.account_firstname;
      res.locals.account_lastname = accountData.account_lastname;
      res.locals.account_email = accountData.account_email;
      res.locals.account_type = accountData.account_type;
      res.locals.account_id = accountData.account_id;
      
    } catch (err) {
      console.error("❌ JWT verification error:", err.message);
      res.clearCookie("jwt");
      res.locals.loggedin = 0;
      res.locals.accountData = null;
      res.locals.account_firstname = null;
      res.locals.account_type = null;
    }
  } else {
    console.log("🔒 No JWT cookie found");
    res.locals.loggedin = 0;
    res.locals.accountData = null;
    res.locals.account_firstname = null;
    res.locals.account_type = null;
  }
  
  next();
};

/* ****************************************
 * Authorization middleware (Employee or Admin only)
 * REQUIRED for Task 2: Only allow Employee/Admin access
 **************************************** */
utilities.authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    console.log("🔐 authorizeRoles middleware checking");
    console.log("   - Allowed roles:", allowedRoles);
    console.log("   - Current loggedin:", res.locals.loggedin);
    console.log("   - Current account type:", res.locals.account_type);
    
    // If not logged in
    if (!res.locals.loggedin) {
      console.log("   ❌ Not logged in - redirecting to login");
      if (req.session) {
        req.session.messages = ["Please log in to access this page."];
        req.session.returnTo = req.originalUrl;
      }
      return res.redirect("/account/login");
    }
    
    // Check if account type is allowed
    if (!allowedRoles.includes(res.locals.account_type)) {
      console.log("   ❌ Insufficient permissions - redirecting to login");
      if (req.session) {
        req.session.messages = [
          `Access denied. You must be ${allowedRoles.join(" or ")} to access this page.`
        ];
      }
      return res.redirect("/account/login");
    }
    
    console.log("   ✅ Authorization passed");
    next();
  };
};

/* ****************************************
 * Special middleware for inventory views
 * REQUIRED for Task 2: Don't require auth for classification/detail views
 **************************************** */
utilities.allowPublicAccess = (req, res, next) => {
  console.log("🌐 Public access middleware - allowing all");
  // This middleware does nothing - it just passes through
  // It's used to mark routes that should NOT require authentication
  next();
};