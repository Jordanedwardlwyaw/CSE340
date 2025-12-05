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
  secret: process.env.SESSION_SECRET || "cse340-secret",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === "production" }
}));

// Import utilities
const utilities = require("./utilities");

// JWT middleware (REQUIRED for Task 2 & 8)
app.use(utilities.checkJWTToken);

// Flash messages
app.use((req, res, next) => {
  res.locals.messages = req.session.messages || [];
  delete req.session.messages;
  next();
});

// Import controllers
const invController = require("./controllers/invController");

// Simple error handler
const handleErrors = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    console.error("Route error:", error);
    next(error);
  }
};

// Home route - with login-aware navigation
app.get("/", handleErrors(async (req, res) => {
  const nav = await utilities.getNav(
    null, 
    res.locals.loggedin || 0, 
    res.locals.accountData || null
  );
  res.render("index", {
    title: "Home",
    nav,
    errors: null,
  });
}));

// Inventory routes
app.use("/inv", require("./routes/inventoryRoute"));

// Account routes
app.use("/account", require("./routes/accountRoute"));

// Apply authorization middleware to inventory management routes (REQUIRED for Task 5)
app.use("/inv/management", utilities.checkAuthorization);
app.use("/inv/add-classification", utilities.checkAuthorization);
app.use("/inv/add-inventory", utilities.checkAuthorization);
app.use("/inv/edit/:invId", utilities.checkAuthorization);
app.use("/inv/delete/:invId", utilities.checkAuthorization);

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
});