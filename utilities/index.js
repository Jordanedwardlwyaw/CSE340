const invModel = require("../models/inventory-model");
const utilities = {};

// ====================================================
// EXISTING FUNCTIONS (Keep your original code)
// ====================================================

utilities.buildClassificationGrid = async function(vehicles) {
  try {
    if (!vehicles || vehicles.length === 0) {
      return '<p class="notice">No vehicles found in this classification.</p>';
    }
    
    let grid = '<div class="vehicles-grid">';
    
    vehicles.forEach(vehicle => {
      const formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(vehicle.inv_price);
      
      grid += `
        <div class="vehicle-card">
          <div class="vehicle-image">
            <img src="${vehicle.inv_image}" 
                 alt="${vehicle.inv_make} ${vehicle.inv_model}">
          </div>
          <div class="vehicle-info">
            <h2>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h2>
            <div class="vehicle-price">${formattedPrice}</div>
            <p class="vehicle-description">${vehicle.inv_description}</p>
            <a href="/inv/detail/${vehicle.inv_id}" class="details-link">
              View Details
            </a>
          </div>
        </div>
      `;
    });
    
    grid += '</div>';
    return grid;
  } catch (error) {
    console.error("Error building classification grid:", error);
    return '<p class="error">Error loading vehicles.</p>';
  }
};

utilities.buildDetailView = async function(vehicle) {
  try {
    if (!vehicle) {
      return '<p class="error">Vehicle details not available.</p>';
    }
    
    const formattedPrice = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(vehicle.inv_price);
    
    const formattedMileage = new Intl.NumberFormat('en-US').format(vehicle.inv_miles);
    
    return `
    <div class="detail-container">
      <div class="detail-image">
        <img src="${vehicle.inv_image}" 
             alt="${vehicle.inv_make} ${vehicle.inv_model}" 
             class="full-image">
      </div>
      <div class="detail-info">
        <h2>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h2>
        <div class="vehicle-price">${formattedPrice}</div>
        
        <div class="specifications">
          <div class="spec-item">
            <strong>Year:</strong> ${vehicle.inv_year}
          </div>
          <div class="spec-item">
            <strong>Mileage:</strong> ${formattedMileage} miles
          </div>
          <div class="spec-item">
            <strong>Price:</strong> ${formattedPrice}
          </div>
          <div class="spec-item">
            <strong>Color:</strong> ${vehicle.inv_color}
          </div>
          <div class="spec-item">
            <strong>Classification:</strong> ${vehicle.classification_name}
          </div>
        </div>
        
        <div class="description">
          <h3>Description</h3>
          <p>${vehicle.inv_description}</p>
        </div>
      </div>
    </div>
    `;
  } catch (error) {
    console.error("Error building detail view:", error);
    return '<p class="error">Error loading vehicle details.</p>';
  }
};

// UPDATED FUNCTION - Now includes CSS classes and active state
utilities.getNav = async function(currentClassificationId = null) {
  try {
    const classifications = await invModel.getClassifications();
    let nav = '<ul class="nav-list">';
    
    // Home link with active state
    nav += `<li class="nav-item">
              <a href="/" class="nav-btn ${currentClassificationId === null ? 'active' : ''}" 
                 title="Home page">Home</a>
            </li>`;
    
    // Classification links with active state
    classifications.forEach(classification => {
      const isActive = currentClassificationId == classification.classification_id ? 'active' : '';
      nav += `<li class="nav-item">
                <a href="/inv/type/${classification.classification_id}" 
                   class="nav-btn ${isActive}"
                   title="View our ${classification.classification_name} inventory">
                   ${classification.classification_name}
                </a>
              </li>`;
    });
    
    nav += '</ul>';
    return nav;
  } catch (error) {
    console.error('Error building navigation:', error);
    return '<ul class="nav-list"><li class="nav-item"><a href="/" class="nav-btn">Home</a></li></ul>';
  }
};

// NEW FUNCTION FOR ASSIGNMENT 4
utilities.buildClassificationList = async function (classification_id = null) {
  try {
    let data = await invModel.getClassifications();
    let classificationList = '<select name="classification_id" id="classificationList" required>';
    classificationList += "<option value=''>Choose a Classification</option>";
    
    data.forEach((row) => {
      classificationList += '<option value="' + row.classification_id + '"';
      if (
        classification_id != null &&
        row.classification_id == classification_id
      ) {
        classificationList += " selected ";
      }
      classificationList += ">" + row.classification_name + "</option>";
    });
    
    classificationList += "</select>";
    return classificationList;
  } catch (error) {
    console.error("Utility Error: buildClassificationList", error);
    return '<select name="classification_id" id="classificationList" required><option value="">Error loading classifications</option></select>';
  }
};

// ====================================================
// NEW FUNCTIONS FOR ASSIGNMENT 5
// ====================================================

/* ****************************************
 * NEW FUNCTION FOR ASSIGNMENT 5: Get navigation with account links
 * REQUIRED for Task 1: Show different links based on login status
 **************************************** */
utilities.getNavWithAccount = async function(currentClassificationId = null, loggedin = 0, accountData = null) {
  try {
    const classifications = await invModel.getClassifications();
    let nav = '<ul class="nav-list">';
    
    // Home link with active state
    nav += `<li class="nav-item">
              <a href="/" class="nav-btn ${currentClassificationId === null ? 'active' : ''}" 
                 title="Home page">Home</a>
            </li>`;
    
    // Classification links with active state
    classifications.forEach(classification => {
      const isActive = currentClassificationId == classification.classification_id ? 'active' : '';
      nav += `<li class="nav-item">
                <a href="/inv/type/${classification.classification_id}" 
                   class="nav-btn ${isActive}"
                   title="View our ${classification.classification_name} inventory">
                   ${classification.classification_name}
                </a>
              </li>`;
    });
    
    // Account links based on login status - REQUIRED for Task 1
    if (loggedin && accountData) {
      // Logged in: Show Welcome and Logout
      nav += `<li class="nav-item">
                <a href="/account" class="nav-btn account-link"
                   title="Manage your account">
                   Welcome ${accountData.account_firstname}
                </a>
              </li>`;
      nav += `<li class="nav-item">
                <a href="/account/logout" class="nav-btn logout-link"
                   title="Logout">
                   Logout
                </a>
              </li>`;
    } else {
      // Not logged in: Show My Account
      nav += `<li class="nav-item">
                <a href="/account/login" class="nav-btn account-link"
                   title="Login or register">
                   My Account
                </a>
              </li>`;
    }
    
    nav += '</ul>';
    return nav;
  } catch (error) {
    console.error('Error building navigation with account:', error);
    return '<ul class="nav-list"><li class="nav-item"><a href="/" class="nav-btn">Home</a></li></ul>';
  }
};

// Override getNav to use the new function by default
utilities.getNav = async function(currentClassificationId = null, loggedin = 0, accountData = null) {
  return await utilities.getNavWithAccount(currentClassificationId, loggedin, accountData);
};

/* ****************************************
 * Error handling middleware
 * REQUIRED for Task 5: Error handling in routes
 **************************************** */
utilities.handleErrors = fn => (req, res, next) => 
  Promise.resolve(fn(req, res, next)).catch(next);

/* ****************************************
 * Check JWT token
 * REQUIRED for Task 2: JWT middleware
 **************************************** */
utilities.checkJWTToken = (req, res, next) => {
  if (req.cookies && req.cookies.jwt) {
    const jwt = require("jsonwebtoken");
    require("dotenv").config();
    
    try {
      const accountData = jwt.verify(
        req.cookies.jwt,
        process.env.ACCESS_TOKEN_SECRET
      );
      res.locals.accountData = accountData;
      res.locals.loggedin = 1;
    } catch (err) {
      console.error("JWT verification error:", err.message);
      res.clearCookie("jwt");
      res.locals.loggedin = 0;
      res.locals.accountData = null;
    }
  } else {
    res.locals.loggedin = 0;
    res.locals.accountData = null;
  }
  next();
};

/* ****************************************
 * Check authorization (Employee or Admin)
 * REQUIRED for Task 2: Authorization middleware
 **************************************** */
utilities.checkAuthorization = (req, res, next) => {
  if (!res.locals.accountData) {
    // Store the original URL for redirect after login
    req.session.returnTo = req.originalUrl;
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

/* ****************************************
 * Simple flash message function
 * REQUIRED for displaying messages
 **************************************** */
utilities.flashMessages = (req, res, next) => {
  res.locals.messages = req.session.messages || [];
  delete req.session.messages;
  next();
};

/* ****************************************
 * Build inventory management navigation
 * For inventory management views
 **************************************** */
utilities.buildInventoryNav = async function() {
  return `
    <div class="management-nav">
      <a href="/inv/management" class="management-link">Inventory Management</a>
      <a href="/inv/add-classification" class="management-link">Add Classification</a>
      <a href="/inv/add-inventory" class="management-link">Add Inventory</a>
    </div>
  `;
};

/* ****************************************
 * Validate password
 * REQUIRED for Task 4 & 5: Password validation
 **************************************** */
utilities.validatePassword = function(password) {
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{12,}$/;
  return passwordRegex.test(password);
};

/* ****************************************
 * Validate email
 * REQUIRED for Task 5: Email validation
 **************************************** */
utilities.validateEmail = function(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/* ****************************************
 * Get account navigation (for header partial)
 * Alternative approach for Task 1
 **************************************** */
utilities.getAccountNav = function(loggedin = 0, accountData = null) {
  if (loggedin && accountData) {
    return `
      <div class="account-nav">
        <a href="/account" class="account-link welcome-link">
          Welcome ${accountData.account_firstname}
        </a>
        <a href="/account/logout" class="account-link logout-link">
          Logout
        </a>
      </div>
    `;
  } else {
    return `
      <div class="account-nav">
        <a href="/account/login" class="account-link">
          My Account
        </a>
      </div>
    `;
  }
};

module.exports = utilities;