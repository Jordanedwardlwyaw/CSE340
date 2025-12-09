const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
require("dotenv").config();

// Database connection test (optional - can be removed if causing issues)
console.log("🔧 Starting application server...");

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
  secret: process.env.SESSION_SECRET || "cse340-secret-key-12345",
  resave: true,
  saveUninitialized: true,
  cookie: { 
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 1000 * 60 * 60
  }
}));

// Import utilities
const utilities = require("./utilities");

// Flash messages middleware
app.use((req, res, next) => {
  res.locals.messages = req.session.messages || [];
  res.locals.errors = req.session.errors || [];
  delete req.session.messages;
  delete req.session.errors;
  next();
});

// COMMENT OUT JWT middleware for Assignment 4 (Assignment 5 feature)
// app.use(auth.checkJWTToken);

// Make account data available to all views (for Assignment 5)
app.use((req, res, next) => {
  res.locals.loggedin = res.locals.loggedin || 0; // Default to not logged in
  res.locals.accountData = res.locals.accountData || null;
  next();
});

// Import routes
const inventoryRoute = require("./routes/inventoryRoute");
const accountRoute = require("./routes/accountRoute"); // Use regular account route for Assignment 4

// Home route - UPDATED for Assignment 4 (without auth)
app.get("/", async (req, res, next) => {
  try {
    // For Assignment 4, use regular getNav (not getNavWithAuth)
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
app.use("/inv", inventoryRoute);
app.use("/account", accountRoute);

// 404 Error Handler - UPDATED for Assignment 4
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
// Add this with your other route imports
const reviewRoute = require("./routes/reviewRoute");

// Add this with your other route middleware (around line 65, after accountRoute)
app.use("/review", reviewRoute);

// 500 Error Handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  const nav = '<ul><li><a href="/">Home</a></li></ul>';
  res.status(err.status || 500).render("errors/error", {
    title: "500 - Server Error",
    message: process.env.NODE_ENV == "development"  ? err.message : "An internal server error occurred.",
    status: 500,
    nav: nav
  });
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
  console.log(`🏠 Home: http://localhost:${port}/`);
  console.log(`👤 Login: http://localhost:${port}/account/login`);
  console.log(`👤 Register: http://localhost:${port}/account/register`);
  console.log(`📦 Inventory: http://localhost:${port}/inv`);
  console.log(`📊 Inventory Management: http://localhost:${port}/inv/management`);
});