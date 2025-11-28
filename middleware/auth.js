const jwt = require("jsonwebtoken");

// Authorization middleware for Employee/Admin only
const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  
  if (token) {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) => {
      if (err) {
        res.locals.loggedin = 0;
        req.flash('error', 'Please log in to access this page.');
        return res.redirect('/account/login');
      } else {
        // Check if user is Employee or Admin
        if (decodedToken.account_type === 'Employee' || decodedToken.account_type === 'Admin') {
          res.locals.loggedin = 1;
          res.locals.accountData = decodedToken;
          next();
        } else {
          req.flash('error', 'You do not have permission to access this area. Employee or Admin accounts only.');
          return res.redirect('/account/login');
        }
      }
    });
  } else {
    req.flash('error', 'Please log in to access this page.');
    return res.redirect('/account/login');
  }
};

module.exports = { requireAuth };