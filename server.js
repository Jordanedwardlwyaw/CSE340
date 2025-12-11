const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
require("dotenv").config();

console.log("🚀 Starting CSE340 Assignment 4 - Inventory Management System");

const app = express();
const port = process.env.PORT || 5500;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

// Session configuration for flash messages
app.use(session({
  secret: process.env.SESSION_SECRET || "cse340-assignment4-secret-key",
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 1000 * 60 * 60 // 1 hour
  }
}));

// Import utilities
const utilities = require("./utilities");

// Flash messages middleware - REQUIRED for Assignment 4
app.use((req, res, next) => {
  res.locals.messages = req.session.messages || [];
  res.locals.errors = req.session.errors || [];
  delete req.session.messages;
  delete req.session.errors;
  next();
});

// Make account data available (for consistency, though Assignment 4 doesn't require login)
app.use((req, res, next) => {
  res.locals.loggedin = res.locals.loggedin || 0;
  res.locals.accountData = res.locals.accountData || null;
  next();
});

// Import routes - CRITICAL for Assignment 4
const inventoryRoute = require("./routes/inventoryRoute"); // For Tasks 1, 2, 3
const accountRoute = require("./routes/accountRoute"); // For registration/login
const reviewRoute = require("./routes/reviewRoute"); // Additional feature

// Home route
app.get("/", async (req, res, next) => {
  try {
    const nav = await utilities.getNav();
    res.render("index", {
      title: "Home - CSE Motors",
      nav,
      errors: null,
    });
  } catch (error) {
    console.error("Home route error:", error);
    next(error);
  }
});

// Use routes
app.use("/inv", inventoryRoute); // This handles /inv/ (management view), /inv/add-classification, /inv/add-inventory
app.use("/account", accountRoute);
app.use("/review", reviewRoute);

// 404 Error Handler
app.use(async (req, res, next) => {
  try {
    const nav = await utilities.getNav();
    res.status(404).render("errors/error", {
      title: "404 - Page Not Found",
      message: "The page you requested could not be found.",
      status: 404,
      nav: nav
    });
  } catch (error) {
    next(error);
  }
});

// 500 Error Handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  const nav = '<ul><li><a href="/">Home</a></li></ul>';
  res.status(err.status || 500).render("errors/error", {
    title: "500 - Server Error",
    message: process.env.NODE_ENV == "development" ? err.message : "An internal server error occurred.",
    status: 500,
    nav: nav
  });
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
  console.log(`📋 Assignment 4 Features:`);
  console.log(`   • Management View: http://localhost:${port}/inv/`);
  console.log(`   • Add Classification: http://localhost:${port}/inv/add-classification`);
  console.log(`   • Add Inventory: http://localhost:${port}/inv/add-inventory`);
  console.log(`   • Login: http://localhost:${port}/account/login`);
  console.log(`   • Register: http://localhost:${port}/account/register`);
});