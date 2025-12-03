const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5500;

// Database test on startup
const pool = require('./database');
pool.testConnection().then(success => {
  if (success) {
    console.log('✅ Database ready for queries');
  }
});

// Set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Import and use routes
app.use("/", require("./routes/inventoryRoute"));

// 404 Error handler
app.use((req, res, next) => {
  res.status(404).render("errors/error", {
    title: "404 - Page Not Found",
    message: "The page you requested could not be found.",
    status: 404,
    nav: '<ul><li><a href="/">Home</a></li></ul>'
  });
});

// General error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);
  res.status(500).render("errors/error", {
    title: "500 - Server Error",
    message: err.message || "An internal server error occurred.",
    status: 500,
    nav: '<ul><li><a href="/">Home</a></li></ul>'
  });
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});