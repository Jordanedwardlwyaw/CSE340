const jwt = require("jsonwebtoken");

// Authorization middleware for Employee/Admin only
const requireAuth = (req, res, next) => {
  // Check if ACCESS_TOKEN_SECRET is set
  if (!process.env.ACCESS_TOKEN_SECRET) {
    console.error('❌ ACCESS_TOKEN_SECRET environment variable is missing');
    return res.status(500).render("errors/error", {
      title: "Server Configuration Error - CSE Motors",
      message: "Server configuration error. Please try again later."
    });
  }

  const token = req.cookies.jwt;
  
  if (!token) {
    req.flash('error', 'Please log in to access this page.');
    return res.redirect('/account/login');
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) => {
    if (err) {
      console.error('JWT verification error:', err);
      req.flash('error', 'Invalid or expired session. Please log in again.');
      return res.redirect('/account/login');
    }

    // Check if user is Employee or Admin
    if (decodedToken.account_type === 'Employee' || decodedToken.account_type === 'Admin') {
      res.locals.loggedin = 1;
      res.locals.accountData = decodedToken;
      next();
    } else {
      req.flash('error', 'You do not have permission to access this area. Employee or Admin accounts only.');
      return res.redirect('/account/login');
    }
  });
};

// Optional: Add a less restrictive auth for general users
const requireAnyAuth = (req, res, next) => {
  // Check if ACCESS_TOKEN_SECRET is set
  if (!process.env.ACCESS_TOKEN_SECRET) {
    res.locals.loggedin = 0;
    return next();
  }

  const token = req.cookies.jwt;
  
  if (token) {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) => {
      if (!err && decodedToken) {
        res.locals.loggedin = 1;
        res.locals.accountData = decodedToken;
      } else {
        res.locals.loggedin = 0;
      }
      next();
    });
  } else {
    res.locals.loggedin = 0;
    next();
  }
};

module.exports = { requireAuth, requireAnyAuth };