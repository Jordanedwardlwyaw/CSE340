// app.js
const express = require("express");
const path = require("path");

const app = express();
let port = process.env.PORT || 3000;

// Set the view engine to EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files (CSS, images, etc.)
app.use(express.static(path.join(__dirname, "public")));

// Define routes
app.get("/", (req, res) => {
  res.render("index", { title: "CSE Motors" });
});

// Function to start server on a free port
function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`CSE Motors app is running at http://localhost:${server.address().port}`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.log(`Port ${port} in use, trying next port...`);
      startServer(port + 1); // Try next port
    } else {
      console.error(err);
    }
  });
}

// Start the server
startServer(port);
