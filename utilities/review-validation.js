const { body, validationResult } = require("express-validator");
const utilities = require("../utilities");

const reviewValidate = {
  // Validation rules for reviews
  reviewRules: () => [
    body("review_rating")
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be between 1 and 5."),
    
    body("review_text")
      .trim()
      .isLength({ min: 10 })
      .withMessage("Review must be at least 10 characters.")
      .isLength({ max: 1000 })
      .withMessage("Review cannot exceed 1000 characters."),
    
    body("inv_id")
      .isInt()
      .withMessage("Invalid vehicle ID."),
  ],

  // Check review data middleware
  checkReviewData: async (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      req.flash("notice", "Please correct the errors below.");
      req.session.errors = errors.array();
      return res.redirect(`/inv/detail/${req.body.inv_id}`);
    }
    
    next();
  }
};

module.exports = reviewValidate;