// app.js
const express = require("express");
const path = require("path");

// Routes
const inventoryRoutes = require("./routes/inventoryRoutes");

const app = express();
let port = process.env.PORT || 3000;

// Set EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Use inventory routes
app.use("/", inventoryRoutes);

// Start server with automatic free port search
function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`CSE Motors app running at http://localhost:${server.address().port}`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.log(`Port ${port} in use, trying next port...`);
      startServer(port + 1);
    } else {
      console.error(err);
    }
  });
}

startServer(port);
