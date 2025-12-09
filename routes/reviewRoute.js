const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const utilities = require("../utilities");
const reviewValidate = require("../utilities/review-validation");

// All review routes require login
router.post("/add",
  utilities.requireLogin,
  reviewValidate.reviewRules(),
  reviewValidate.checkReviewData,
  utilities.handleErrors(reviewController.addReview)
);

router.post("/update",
  utilities.requireLogin,
  reviewValidate.reviewRules(),
  reviewValidate.checkReviewData,
  utilities.handleErrors(reviewController.updateReview)
);

router.post("/delete",
  utilities.requireLogin,
  utilities.handleErrors(reviewController.deleteReview)
);

router.get("/edit/:review_id",
  utilities.requireLogin,
  utilities.handleErrors(reviewController.renderEditReview)
);

module.exports = router;