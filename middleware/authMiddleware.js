const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ***************************
 * Middleware to check JWT token
 *************************** */
const checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("notice", "Please log in.");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        res.locals.accountData = accountData;
        res.locals.loggedin = 1;
        next();
      }
    );
  } else {
    next();
  }
};

/* ***************************
 * Middleware to check authorization for inventory management
 *************************** */
const checkAuthorization = (req, res, next) => {
  if (!res.locals.accountData) {
    req.flash("notice", "Please log in to access this page.");
    return res.redirect("/account/login");
  }
  
  const accountType = res.locals.accountData.account_type;
  if (accountType !== "Employee" && accountType !== "Admin") {
    req.flash("notice", "You must be an employee or administrator to access this page.");
    return res.redirect("/account/login");
  }
  
  next();
};

module.exports = { checkJWTToken, checkAuthorization };