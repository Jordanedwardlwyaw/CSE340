const express = require("express");
const router = express.Router();
const utilities = require("../utilities");

// Home route
router.get("/", async (req, res, next) => {
  try {
    const nav = await utilities.getNav();
    res.render("index", {
      title: "Home",
      nav,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;