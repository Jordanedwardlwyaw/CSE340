const express = require("express");
const app = express();
const path = require("path");
const baseRoutes = require("./routes/index");
const invRoutes = require("./routes/invRoutes");
const accountRoutes = require("./routes/accountRoutes");
const errorMiddleware = require("./utilities/errors");

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static Files
app.use(express.static(path.join(__dirname, "public")));

// Body Parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use("/", baseRoutes);
app.use("/inv", invRoutes);
app.use("/account", accountRoutes);

// 404 Handler
app.use(errorMiddleware.handle404);

// Error Handler
app.use(errorMiddleware.handleErrors);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

module.exports = app; // Optional if you still want to export for testing
