const Util = require("../utilities");

const staticController = {};

// Home page controller
staticController.buildHome = async function (req, res, next) {
  try {
    let nav = await Util.getNav();
    res.render("index", {
      title: "CSE Motors",
      nav,
      messages: req.flash(),
      errors: null
    });
  } catch (error) {
    next(error);
  }
};

module.exports = staticController;