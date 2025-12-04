const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 5500;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/inventoryRoute"));

app.use((req, res, next) => {
  res.status(404).render("errors/error", {
    title: "404 - Page Not Found",
    message: "The page you requested could not be found.",
    status: 404,
    nav: '<ul><li><a href="/">Home</a></li></ul>'
  });
});

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
  console.log(`🚀 Using mock data - no database connection needed`);
  console.log(`📊 Management view: http://localhost:${port}/inv/`);
});