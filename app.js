const express = require("express");
const path = require("path");

const inventoryRoutes = require("./routes/inventoryRoutes");

const app = express();
let port = process.env.PORT || 3000;

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", inventoryRoutes);

// 404 page
app.use((req, res) => {
  res.status(404).render("404", { message: "Page not found" });
});

// Error middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("500", { message: "Internal Server Error" });
});

// Start server
app.listen(port, () => {
  console.log(`CSE Motors running at http://localhost:${port}`);
});
