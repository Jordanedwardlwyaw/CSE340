const reviewModel = require("../models/review-model");
const utilities = require("../utilities/");

const reviewCont = {
  // Add a new review
  async addReview(req, res, next) {
    try {
      const { inv_id, review_rating, review_text } = req.body;
      const account_id = res.locals.accountData.account_id;

      // Validate user is logged in
      if (!account_id) {
        req.flash("notice", "Please log in to submit a review.");
        return res.redirect(`/inv/detail/${inv_id}`);
      }

      // Check if user already reviewed this vehicle
      const existingReview = await reviewModel.getUserReviewForVehicle(account_id, inv_id);
      if (existingReview) {
        req.flash("notice", "You have already reviewed this vehicle. You can edit your existing review.");
        return res.redirect(`/inv/detail/${inv_id}`);
      }

      // Add review to database
      const reviewData = {
        account_id,
        inv_id,
        review_rating: parseInt(review_rating),
        review_text
      };

      const result = await reviewModel.addReview(reviewData);

      if (result) {
        req.flash("notice", "Review submitted successfully!");
      } else {
        req.flash("notice", "Failed to submit review. Please try again.");
      }

      res.redirect(`/inv/detail/${inv_id}`);
    } catch (error) {
      console.error("addReview error", error);
      req.flash("notice", "An error occurred while submitting your review.");
      res.redirect(`/inv/detail/${req.body.inv_id}`);
    }
  },

  // Update a review
  async updateReview(req, res, next) {
    try {
      const { review_id, inv_id, review_rating, review_text } = req.body;
      const account_id = res.locals.accountData.account_id;

      const reviewData = {
        account_id,
        review_rating: parseInt(review_rating),
        review_text
      };

      const result = await reviewModel.updateReview(review_id, reviewData);

      if (result) {
        req.flash("notice", "Review updated successfully!");
      } else {
        req.flash("notice", "Failed to update review. You can only edit your own reviews.");
      }

      res.redirect(`/inv/detail/${inv_id}`);
    } catch (error) {
      console.error("updateReview error", error);
      req.flash("notice", "An error occurred while updating your review.");
      res.redirect(`/inv/detail/${req.body.inv_id}`);
    }
  },

  // Delete a review
  async deleteReview(req, res, next) {
    try {
      const { review_id, inv_id } = req.body;
      const account_id = res.locals.accountData.account_id;

      const result = await reviewModel.deleteReview(review_id, account_id);

      if (result) {
        req.flash("notice", "Review deleted successfully!");
      } else {
        req.flash("notice", "Failed to delete review. You can only delete your own reviews.");
      }

      res.redirect(`/inv/detail/${inv_id}`);
    } catch (error) {
      console.error("deleteReview error", error);
      req.flash("notice", "An error occurred while deleting your review.");
      res.redirect(`/inv/detail/${req.body.inv_id}`);
    }
  },

  // Render edit review form
  async renderEditReview(req, res, next) {
    try {
      const review_id = parseInt(req.params.review_id);
      const nav = await utilities.getNav();

      // In a full implementation, you'd fetch the review details here
      res.render("review/edit-review", {
        title: "Edit Review",
        nav,
        review_id,
        errors: null,
        review_rating: req.body.review_rating || "",
        review_text: req.body.review_text || ""
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = reviewCont;