require("dotenv").config();
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const messages = require("express-messages");

const app = express();

// Routes & Utilities
const staticRoutes = require("./routes/static");
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const utilities = require("./utilities/");

/* ***********************
 * Middleware
 *************************/

// Session Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "fallback-secret",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 }, // 1 hour
  })
);

// Flash messages
app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Set default values for header variables
app.use((req, res, next) => {
  res.locals.loggedIn = false; // Default to not logged in
  res.locals.accountType = 'Public'; // Default account type
  res.locals.firstName = ''; // Default empty name
  next();
});

// Navigation middleware
app.use(async (req, res, next) => {
  try {
    res.locals.nav = await utilities.getNav();
  } catch (error) {
    console.error('Navigation error:', error);
    res.locals.nav = '<ul><li><a href="/">Home</a></li></ul>';
  }
  next();
});

// Serve static files
app.use(express.static("public"));

/* ***********************
 * View Engine
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

/* ***********************
 * Routes
 *************************/
app.use("/", staticRoutes);
app.use("/inv", inventoryRoute);

// Simple home route
app.get("/", (req, res) => {
  res.render("index", {
    title: "Home"
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render("errors/error", {
    title: "404 - Page Not Found",
    message: "Sorry, the page you're looking for doesn't exist."
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Server Error:', error);
  res.status(500).render("errors/error", {
    title: "Server Error",
    message: "Something went wrong! Please try again later."
  });
});

/* ***********************
 * Start Server
 *************************/
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`✅ Server is running at http://localhost:${port}`);
});