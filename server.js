require("dotenv").config();
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const pgSession = require("connect-pg-simple")(session);
const messages = require("express-messages");

const app = express();
const pool = require("./database");

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

// Session Middleware with PostgreSQL
app.use(
  session({
    store: new pgSession({
      pool: pool,
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 }, // 1 hour
  })
);

// Flash messages
app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = messages(req, res);
  next();
});

// Cookie parser
app.use(cookieParser());

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// JWT token validation
app.use(utilities.checkJWTToken);

// Populate navigation for all responses
app.use(async (req, res, next) => {
  try {
    res.locals.nav = await utilities.getNav();
    next();
  } catch (err) {
    next(err);
  }
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
app.get("/", utilities.handleErrors(baseController.buildHome));
app.use("/account", accountRoute);
app.use("/inv", inventoryRoute);
app.use("/error", errorRoute);

// 404 Not Found - must be last
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
 * Start Server
 *************************/
const port = process.env.PORT || 5500;

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
