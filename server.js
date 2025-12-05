const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5500;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || "cse340-secret-key",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Flash messages middleware
app.use((req, res, next) => {
  res.locals.messages = req.session.messages || [];
  delete req.session.messages;
  next();
});

// Import utilities and controllers
const utilities = require("./utilities");
const invController = require("./controllers/invController");

// Simple error handler (keep your existing one)
const handleErrors = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    console.error("Route error:", error);
    next(error);
  }
};

// Use JWT middleware if available
if (utilities.checkJWTToken) {
  app.use(utilities.checkJWTToken);
} else {
  // Fallback if checkJWTToken not defined
  app.use((req, res, next) => {
    res.locals.loggedin = 0;
    res.locals.accountData = null;
    next();
  });
}

// Home route
app.get("/", handleErrors(async (req, res) => {
  const nav = await utilities.getNav();
  res.render("index", {
    title: "Home",
    nav,
    errors: null,
  });
}));

// Inventory routes
app.get("/inv", handleErrors(invController.buildManagement));
app.get("/inv/type/:classificationId", handleErrors(invController.buildByClassificationId));
app.get("/inv/detail/:invId", handleErrors(invController.buildByInvId));

// Assignment 4 inventory management routes
app.get("/inv/add-classification", handleErrors(invController.buildAddClassification));
app.get("/inv/add-inventory", handleErrors(invController.buildAddInventory));
app.post("/inv/add-classification", handleErrors(invController.addClassification));
app.post("/inv/add-inventory", handleErrors(invController.addInventory));

// Account routes
app.get("/account/login", handleErrors(async (req, res) => {
  const nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email: "",
  });
}));

app.get("/account/register", handleErrors(async (req, res) => {
  const nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
    account_firstname: "",
    account_lastname: "",
    account_email: "",
  });
}));

// Account management route
app.get("/account", handleErrors(async (req, res) => {
  const nav = await utilities.getNav();
  
  if (!res.locals.accountData) {
    req.session.messages = ["Please log in to view account management."];
    return res.redirect("/account/login");
  }
  
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
    accountData: res.locals.accountData,
  });
}));

// Account update routes
app.get("/account/update/:accountId", handleErrors(async (req, res) => {
  const nav = await utilities.getNav();
  const accountId = req.params.accountId;
  
  if (!res.locals.accountData || res.locals.accountData.account_id != accountId) {
    req.session.messages = ["Please log in to update your account."];
    return res.redirect("/account/login");
  }
  
  // In a real app, you'd fetch account data from database
  res.render("account/update", {
    title: "Update Account",
    nav,
    errors: null,
    accountData: res.locals.accountData,
  });
}));

// Logout route
app.get("/account/logout", handleErrors(async (req, res) => {
  res.clearCookie("jwt");
  req.session.messages = ["You have been logged out."];
  res.redirect("/");
}));

// POST routes for account actions (simplified for now)
app.post("/account/login", handleErrors(async (req, res) => {
  // This would normally authenticate with database
  req.session.messages = ["Login functionality coming soon."];
  res.redirect("/account/login");
}));

app.post("/account/register", handleErrors(async (req, res) => {
  // This would normally register in database
  req.session.messages = ["Registration functionality coming soon."];
  res.redirect("/account/login");
}));

// Apply authorization middleware to inventory management routes
// Check if utilities.checkAuthorization exists
const checkAuth = utilities.checkAuthorization || ((req, res, next) => {
  if (!res.locals.accountData) {
    return res.redirect("/account/login");
  }
  next();
});

// Protect inventory management routes
const inventoryManagementRoutes = [
  "/inv/management",
  "/inv/add-classification", 
  "/inv/add-inventory",
  "/inv/edit/:invId",
  "/inv/delete/:invId"
];

// Apply authorization to inventory management routes
inventoryManagementRoutes.forEach(route => {
  app.all(route, (req, res, next) => {
    if (!res.locals.accountData) {
      req.session.messages = ["Please log in to access inventory management."];
      return res.redirect("/account/login");
    }
    
    const accountType = res.locals.accountData.account_type;
    if (accountType !== "Employee" && accountType !== "Admin") {
      req.session.messages = ["You must be an employee or administrator to access this page."];
      return res.redirect("/account/login");
    }
    
    next();
  });
});

// 404 Error Handler
app.use(handleErrors(async (req, res) => {
  const nav = await utilities.getNav();
  res.status(404).render("errors/error", {
    title: "404 - Page Not Found",
    message: "The page you requested could not be found.",
    status: 404,
    nav: nav
  });
}));

// 500 Error Handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);
  const nav = '<ul><li><a href="/">Home</a></li></ul>';
  res.status(500).render("errors/error", {
    title: "500 - Server Error",
    message: err.message || "An internal server error occurred.",
    status: 500,
    nav: nav
  });
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
  console.log(`🔐 Authentication enabled`);
  console.log(`🏠 Home: http://localhost:${port}/`);
  console.log(`👤 Login: http://localhost:${port}/account/login`);
  console.log(`📦 Inventory: http://localhost:${port}/inv`);
  console.log(`👤 Register: http://localhost:${port}/account/register`);
  console.log(`⚙️ Account Management: http://localhost:${port}/account`);
});