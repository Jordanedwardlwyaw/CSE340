// server.js
const express = require("express");
const app = express();
const path = require("path");

// Routes
const baseRoutes = require("./routes/index"); // placeholder if index.js doesn't exist
const invRoutes = require("./routes/inventoryRoute"); // match your inventory route file
const accountRoutes = require("./routes/accountRoutes"); // your account routes

// Error Middleware
const errorMiddleware = require("./utilities/errors"); // make sure handle404 & handleErrors exist

// ------------------------
// View Engine
// ------------------------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ------------------------
// Static Files
// ------------------------
app.use(express.static(path.join(__dirname, "public")));

// ------------------------
// Body Parser
// ------------------------
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ------------------------
// Routes
// ------------------------
app.use("/", baseRoutes);
app.use("/inv", invRoutes);
app.use("/account", accountRoutes);

// ------------------------
// 404 Handler
// ------------------------
app.use(errorMiddleware.handle404);

// ------------------------
// Error Handler
// ------------------------
app.use(errorMiddleware.handleErrors);

// ------------------------
// Start Server
// ------------------------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
