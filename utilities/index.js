// utilities/index.js
const invModel = require("../models/inventory-model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Initialize utilities object
const utilities = {};

// ====================================================
// NAVIGATION FUNCTIONS
// ====================================================

utilities.getNav = async function(currentClassificationId = null) {
  try {
    console.log("📊 getNav() called with classificationId:", currentClassificationId);
    
    const classifications = await invModel.getClassifications();
    console.log(`📋 Retrieved ${classifications.length} classifications from model`);
    
    if (classifications.length === 0) {
      console.log("⚠️ WARNING: No classifications found in database!");
      console.log("   Using fallback classifications...");
      // Add fallback classifications if database returns empty
      classifications.push(
        { classification_id: 1, classification_name: "Classic Cars" },
        { classification_id: 2, classification_name: "SUVs" },
        { classification_id: 3, classification_name: "Trucks" },
        { classification_id: 4, classification_name: "Sedans" }
      );
    }
    
    // Log each classification found
    classifications.forEach((c, i) => {
      console.log(`   ${i+1}. ${c.classification_name} (ID: ${c.classification_id})`);
    });
    
    let nav = '<ul class="nav-list">';
    
    // Home link with active state
    nav += `<li class="nav-item">
              <a href="/" class="nav-link ${currentClassificationId === null ? 'active' : ''}" 
                 title="Home page">Home</a>
            </li>`;
    
    // Classification links with active state
    classifications.forEach(classification => {
      const isActive = currentClassificationId == classification.classification_id ? 'active' : '';
      nav += `<li class="nav-item">
                <a href="/inv/type/${classification.classification_id}" 
                   class="nav-link ${isActive}"
                   title="View our ${classification.classification_name} inventory">
                   ${classification.classification_name}
                </a>
              </li>`;
    });
    
    nav += `<li class="nav-item">
              <a href="/account/login" class="nav-link account-link"
                 title="Login or register">
                 My Account
              </a>
            </li>`;
    
    nav += '</ul>';
    
    console.log("✅ Navigation built successfully");
    console.log("   Total links:", (classifications.length + 2));
    console.log("   Navigation HTML length:", nav.length);
    
    return nav;
  } catch (error) {
    console.error('❌ Error building navigation:', error);
    console.error('   Error details:', error.message);
    
    // Return minimal navigation as fallback
    let fallbackNav = '<ul class="nav-list">';
    fallbackNav += '<li class="nav-item"><a href="/" class="nav-link">Home</a></li>';
    
    // Add fallback classification links
    const fallbackClassifications = [
      { classification_id: 1, classification_name: "Classic Cars" },
      { classification_id: 2, classification_name: "SUVs" },
      { classification_id: 3, classification_name: "Trucks" },
      { classification_id: 4, classification_name: "Sedans" }
    ];
    
    fallbackClassifications.forEach(classification => {
      fallbackNav += `<li class="nav-item">
        <a href="/inv/type/${classification.classification_id}" class="nav-link">
          ${classification.classification_name}
        </a>
      </li>`;
    });
    
    fallbackNav += '<li class="nav-item"><a href="/account/login" class="nav-link">My Account</a></li>';
    fallbackNav += '</ul>';
    
    console.log("⚠️ Using fallback navigation due to error");
    return fallbackNav;
  }
};

// ====================================================
// INVENTORY DISPLAY FUNCTIONS
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

// ====================================================
// INVENTORY MANAGEMENT FUNCTIONS
// ====================================================

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
// ERROR HANDLING
// ====================================================

utilities.handleErrors = fn => (req, res, next) => 
  Promise.resolve(fn(req, res, next)).catch(next);

// ====================================================
// HELPER FUNCTIONS
// ====================================================

/* ****************************************
 * Build inventory management navigation
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
 * Simple flash message function
 **************************************** */
utilities.flashMessages = (req, res, next) => {
  res.locals.messages = req.session?.messages || [];
  res.locals.errors = req.session?.errors || [];
  if (req.session) {
    delete req.session.messages;
    delete req.session.errors;
  }
  next();
};

// ====================================================
// VALIDATION FUNCTIONS
// ====================================================

/* ****************************************
 * Validate password
 **************************************** */
utilities.validatePassword = function(password) {
  if (!password) {
    console.log("❌ Password validation failed: No password provided");
    return false;
  }
  
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{12,}$/;
  const isValid = passwordRegex.test(password);
  
  console.log(`🔐 Password validation: ${isValid ? '✅ Valid' : '❌ Invalid'}`);
  return isValid;
};

/* ****************************************
 * Validate email
 **************************************** */
utilities.validateEmail = function(email) {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// ====================================================
// JWT AUTHENTICATION FUNCTIONS
// REQUIRED FOR ASSIGNMENT 5
// ====================================================

/* ****************************************
 * Create JWT Token
 **************************************** */
utilities.createJWT = function(accountData) {
  try {
    console.log("🎫 Creating JWT token for:", accountData.account_email);
    
    const payload = {
      account_id: accountData.account_id,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
      account_type: accountData.account_type || "Client"
    };
    
    const secret = process.env.ACCESS_TOKEN_SECRET || "cse340-development-fallback-secret";
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });
    
    console.log("✅ JWT created successfully");
    return token;
  } catch (error) {
    console.error("❌ JWT creation error:", error);
    return null;
  }
};

/* ****************************************
 * Check JWT Token Middleware
 * This runs on EVERY request
 **************************************** */
utilities.checkJWTToken = function(req, res, next) {
  const token = req.cookies.jwt;
  
  if (token) {
    console.log("🔍 Found JWT token, verifying...");
    
    try {
      const secret = process.env.ACCESS_TOKEN_SECRET || "cse340-development-fallback-secret";
      const decoded = jwt.verify(token, secret);
      res.locals.accountData = decoded;
      res.locals.loggedin = 1;
      console.log(`✅ JWT verified for: ${decoded.account_email} (${decoded.account_type})`);
    } catch (error) {
      console.error("❌ JWT verification failed:", error.message);
      res.clearCookie("jwt");
      res.locals.accountData = null;
      res.locals.loggedin = 0;
    }
  } else {
    res.locals.accountData = null;
    res.locals.loggedin = 0;
  }
  
  next();
};

/* ****************************************
 * Require Login Middleware
 * Use for routes that need authentication
 **************************************** */
utilities.requireLogin = function(req, res, next) {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash("notice", "Please log in to access this page.");
    res.redirect("/account/login");
  }
};

/* ****************************************
 * Require Employee or Admin Middleware
 * REQUIRED for Task 2
 **************************************** */
utilities.requireEmployeeOrAdmin = function(req, res, next) {
  if (res.locals.loggedin && 
      (res.locals.accountData.account_type === "Employee" || 
       res.locals.accountData.account_type === "Admin")) {
    console.log(`✅ Access granted for ${res.locals.accountData.account_type}: ${res.locals.accountData.account_email}`);
    next();
  } else {
    console.log(`❌ Access denied. Required: Employee or Admin. Current: ${res.locals.loggedin ? res.locals.accountData?.account_type : 'Not logged in'}`);
    req.flash("notice", "Access denied. Employee or Admin privileges required.");
    res.redirect("/account/login");
  }
};

// ====================================================
// NAVIGATION WITH AUTHENTICATION
// REQUIRED FOR TASK 1
// ====================================================

/* ****************************************
 * Navigation with Login Awareness
 * FIXED VERSION - handles res.locals properly
 **************************************** */
utilities.getNavWithAuth = async function(currentClassificationId = null, loggedin = 0, accountData = null) {
  try {
    console.log("🔧 Building navigation with authentication...");
    console.log("   - loggedin:", loggedin);
    console.log("   - accountData:", accountData ? accountData.account_firstname : "None");
    
    // Use your existing getNav function as base
    const baseNav = await utilities.getNav(currentClassificationId);
    
    // If user is logged in, replace "My Account" with "Welcome [name]" and "Logout"
    if (loggedin && accountData) {
      console.log("   User is logged in as:", accountData.account_firstname);
      
      const welcomeLink = `<li class="nav-item">
        <a href="/account" class="nav-link account-link" title="Manage your account">
          Welcome ${accountData.account_firstname}
        </a>
      </li>`;
      
      const logoutLink = `<li class="nav-item">
        <a href="/account/logout" class="nav-link logout-link" title="Logout">
          Logout
        </a>
      </li>`;
      
      // Replace "My Account" with the two new links
      const updatedNav = baseNav.replace(
        '<li class="nav-item"><a href="/account/login" class="nav-link account-link" title="Login or register">My Account</a></li>',
        welcomeLink + logoutLink
      );
      
      console.log("✅ Navigation updated for logged in user");
      return updatedNav;
    }
    
    console.log("   User is not logged in, using default navigation");
    return baseNav;
    
  } catch (error) {
    console.error("Navigation with auth error:", error);
    return await utilities.getNav(currentClassificationId);
  }
};

// ====================================================
// PASSWORD HASHING
// ====================================================

/* ****************************************
 * Hash Password
 **************************************** */
utilities.hashPassword = async function(password) {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log("✅ Password hashed successfully");
    return hashedPassword;
  } catch (error) {
    console.error("❌ Password hashing error:", error);
    throw error;
  }
};

module.exports = utilities;