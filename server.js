/* ******************************************
 * server.js - Primary application file
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const pgSession = require("connect-pg-simple")(session);
const messages = require("express-messages");

const app = express();
const pool = require("./database/");

// Routes & Utilities
const staticRoutes = require("./routes/static");
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const accountRoute = require("./routes/accountRoute");
const errorRoute = require("./routes/errorRoute");
const utilities = require("./utilities/");

/* ***********************
 * Middleware
 *************************/

// Session Middleware
app.use(
  session({
    store: new pgSession({
      createTableIfMissing: true,
      pool: pool,
    }),
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 }, // 1 hour
  })
);

// Flash Middleware
app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = messages(req, res);
  next();
});

// Cookie Parser
app.use(cookieParser());

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// JWT Token Validation
app.use(utilities.checkJWTToken);

// Populate Navigation for All Responses
app.use(async (req, res, next) => {
  try {
    res.locals.nav = await utilities.getNav();
    next();
  } catch (err) {
    next(err);
  }
});

// Serve Static Files
app.use(express.static("public"));

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

/* ***********************
 * Routes
 *************************/
// Public Routes
app.get("/", utilities.handleErrors(baseController.buildHome));
app.use("/account", accountRoute);

// Restricted Routes
app.use("/inv", inventoryRoute);

// Test Route
app.get("/account/test", (req, res) => {
  res.send("Account test route is working");
});

// Intentional Error Route
app.use("/error", errorRoute);

// Flash Test Route
app.get("/test-flash", (req, res) => {
  req.flash("success", "Flash message is working!");
  res.redirect("/account/login");
});

// 404 Not Found Route - Must Be Last
app.use((req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." });
});

/* ***********************
 * Express Error Handler
 *************************/
app.use((err, req, res, next) => {
  console.error(`Error at "${req.originalUrl}": ${err.message}`);
  res.status(err.status || 500).render("errors/error", {
    title: err.status || "Server Error",
    message: err.message || "An unknown error occurred.",
    nav: res.locals.nav,
  });
});

/* ***********************
 * Server Configuration with Automatic Port Handling
 *************************/
const DEFAULT_PORT = process.env.PORT || 3000;

// Start the server, try next port if in use
function startServer(port) {
  const server = app.listen(port, "0.0.0.0", () => {
    console.log(`Server is running at http://localhost:${server.address().port}`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.warn(`Port ${port} is in use, trying port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error(err);
    }
  });
}

startServer(DEFAULT_PORT);
