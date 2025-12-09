const reviewModel = require("../models/review-model");
const utilities = require("../utilities/");

const reviewCont = {
  // Add a new review
  async addReview(req, res, next) {
    try {
      const { inv_id, review_rating, review_text, tags = [] } = req.body;
      const account_id = res.locals.accountData?.account_id;

      // Validate user is logged in
      if (!account_id) {
        req.flash("notice", "Please log in to submit a review.");
        return res.redirect(`/inv/detail/${inv_id}`);
      }

      // Server-side validation
      const errors = [];
      
      if (!review_rating || review_rating < 1 || review_rating > 5) {
        errors.push({ msg: "Please select a valid rating between 1 and 5 stars." });
      }
      
      if (!review_text || review_text.trim().length < 20) {
        errors.push({ msg: "Review must be at least 20 characters long." });
      }
      
      if (review_text && review_text.trim().length > 1000) {
        errors.push({ msg: "Review cannot exceed 1000 characters." });
      }
      
      if (errors.length > 0) {
        req.session.errors = errors;
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
        review_text: review_text.trim(),
        tags: Array.isArray(tags) ? tags : [tags].filter(Boolean),
        is_verified: false // In a real app, check if user purchased the vehicle
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
      const { review_id, inv_id, review_rating, review_text, tags = [] } = req.body;
      const account_id = res.locals.accountData?.account_id;

      if (!account_id) {
        req.flash("notice", "Please log in to update a review.");
        return res.redirect(`/inv/detail/${inv_id}`);
      }

      // Server-side validation
      const errors = [];
      
      if (!review_rating || review_rating < 1 || review_rating > 5) {
        errors.push({ msg: "Please select a valid rating between 1 and 5 stars." });
      }
      
      if (!review_text || review_text.trim().length < 20) {
        errors.push({ msg: "Review must be at least 20 characters long." });
      }
      
      if (review_text && review_text.trim().length > 1000) {
        errors.push({ msg: "Review cannot exceed 1000 characters." });
      }
      
      if (errors.length > 0) {
        req.session.errors = errors;
        return res.redirect(`/inv/detail/${inv_id}`);
      }

      const reviewData = {
        account_id,
        review_rating: parseInt(review_rating),
        review_text: review_text.trim(),
        tags: Array.isArray(tags) ? tags : [tags].filter(Boolean)
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
      const account_id = res.locals.accountData?.account_id;

      if (!account_id) {
        req.flash("notice", "Please log in to delete a review.");
        return res.redirect(`/inv/detail/${inv_id}`);
      }

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

  // Vote on a review as helpful (AJAX endpoint)
  async voteHelpful(req, res, next) {
    try {
      const { review_id, inv_id } = req.body;
      const account_id = res.locals.accountData?.account_id;

      if (!account_id) {
        return res.status(401).json({
          success: false,
          message: "Please log in to vote on reviews."
        });
      }

      // Check if user has already voted
      const hasVoted = await reviewModel.hasUserVoted(review_id, account_id);
      
      if (hasVoted) {
        // Remove vote
        const result = await reviewModel.removeHelpfulVote(review_id, account_id);
        
        if (result) {
          // Get updated review data
          const reviews = await reviewModel.getReviewsByInventoryId(inv_id, 1, 10, 'newest');
          const averageRating = await reviewModel.getAverageRating(inv_id);
          
          return res.json({
            success: true,
            message: "Vote removed",
            hasVoted: false,
            reviews,
            averageRating
          });
        }
      } else {
        // Add vote
        const result = await reviewModel.addHelpfulVote(review_id, account_id);
        
        if (result) {
          // Get updated review data
          const reviews = await reviewModel.getReviewsByInventoryId(inv_id, 1, 10, 'newest');
          const averageRating = await reviewModel.getAverageRating(inv_id);
          
          return res.json({
            success: true,
            message: "Thank you for your vote!",
            hasVoted: true,
            reviews,
            averageRating
          });
        }
      }

      return res.status(500).json({
        success: false,
        message: "Failed to process vote."
      });
    } catch (error) {
      console.error("voteHelpful error", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while processing your vote."
      });
    }
  },

  // Get reviews for a vehicle (AJAX endpoint with pagination)
  async getReviews(req, res, next) {
    try {
      const invId = parseInt(req.params.invId);
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const sortBy = req.query.sortBy || 'newest';
      
      if (isNaN(invId) || invId <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid vehicle ID."
        });
      }

      const reviews = await reviewModel.getReviewsByInventoryId(invId, page, limit, sortBy);
      const averageRating = await reviewModel.getAverageRating(invId);
      const totalCount = await reviewModel.getTotalReviewCount(invId);
      
      res.json({
        success: true,
        reviews,
        averageRating,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages: Math.ceil(totalCount / limit),
          hasNextPage: page * limit < totalCount,
          hasPrevPage: page > 1
        }
      });
    } catch (error) {
      console.error("getReviews error", error);
      res.status(500).json({
        success: false,
        message: "Error loading reviews"
      });
    }
  },

  // Render edit review form (optional separate page)
  async renderEditReview(req, res, next) {
    try {
      const review_id = parseInt(req.params.review_id);
      const nav = await utilities.getNav();

      // Fetch review details from database
      // This would require an additional model method to get review by ID
      
      res.render("review/edit-review", {
        title: "Edit Review",
        nav,
        review_id,
        errors: null,
        review_rating: req.body.review_rating || "",
        review_text: req.body.review_text || "",
        tags: req.body.tags || []
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = reviewCont;