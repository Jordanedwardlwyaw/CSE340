const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const reviewValidate = require("../utilities/review-validation");

// Add review
router.post("/add", 
  reviewValidate.reviewRules(),
  reviewValidate.checkReviewData,
  reviewController.addReview
);

// Update review
router.post("/update",
  reviewValidate.reviewRules(),
  reviewValidate.checkReviewData,
  reviewController.updateReview
);

// Delete review
router.post("/delete",
  reviewController.deleteReview
);

// Vote on review - FIXED THIS ROUTE
router.post("/vote",
  reviewValidate.voteRules(),     // Returns validation rules
  reviewValidate.checkVoteData,   // Middleware that checks validation
  reviewController.voteHelpful    // Controller function
);

// Get reviews (AJAX endpoint)
router.get("/:invId", 
  reviewController.getReviews
);

// Edit review page
router.get("/edit/:review_id",
  reviewController.renderEditReview
);

module.exports = router;