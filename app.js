const express = require("express");
const path = require("path");
const inventoryRoutes = require("./routes/inventoryRoutes");

const app = express();
let port = process.env.PORT || 3000;

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", inventoryRoutes);

// Trigger 500 error link
app.get("/trigger-500", (req, res, next) => {
  next(new Error("Intentional 500 error"));
});

// 404 handler
app.use((req, res) => {
  res.status(404).render("404", { message: "Page not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("500");
});

// Start server
function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`CSE Motors app running at http://localhost:${server.address().port}`);
  });

  server.on("error", err => {
    if (err.code === "EADDRINUSE") {
      console.log(`Port ${port} in use, trying next port...`);
      startServer(port + 1);
    } else {
      console.error(err);
    }
  });
}

startServer(port);
