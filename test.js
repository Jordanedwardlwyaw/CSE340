// test.js - Basic server test
const express = require("express");
const app = express();

app.set("view engine", "ejs");

// Simple test route
app.get("/", (req, res) => {
  res.render("index", { 
    title: "Test Page",
    nav: "<ul><li><a href='/'>Home</a></li></ul>"
  });
});

app.get("/test", (req, res) => {
  res.send("Basic server is working!");
});

app.listen(3001, () => {
  console.log("Test server running on http://localhost:3001");
});