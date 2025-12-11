const invModel = require("../models/inventory-model");
const reviewModel = require("../models/review-model"); // ADD THIS LINE
const utilities = require("../utilities/");

const invCont = {};

invCont.buildHome = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    const featuredVehicles = await invModel.getFeaturedVehicles();
    
    res.render("index", {
      title: "Home - CSE Motors",
      nav,
      featuredVehicles,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};

invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classificationId = parseInt(req.params.classificationId);
    const vehicles = await invModel.getInventoryByClassificationId(classificationId);
    const nav = await utilities.getNav();
    
    const classification = await invModel.getClassificationById(classificationId);
    const className = classification ? classification.classification_name : "Vehicles";
    
    const grid = await utilities.buildClassificationGrid(vehicles);
    
    res.render("./inventory/classification", {
      title: className + " - CSE Motors",
      nav,
      grid,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};

invCont.buildByInventoryId = async function (req, res, next) {
  try {
    const invId = parseInt(req.params.invId);
    const vehicle = await invModel.getInventoryById(invId);
    
    if (!vehicle) {
      const error = new Error("Vehicle not found");
      error.status = 404;
      throw error;
    }
    
    const nav = await utilities.getNav();
    const detailHTML = await utilities.buildDetailView(vehicle);
    
    // NEW: Get reviews and average rating for this vehicle
    const reviews = await reviewModel.getReviewsByInventoryId(invId);
    const averageRating = await reviewModel.getAverageRating(invId);
    
    // NEW: Check if user has already reviewed this vehicle
    let userHasReviewed = false;
    let existingUserReview = null;
    
    if (res.locals.accountData && res.locals.accountData.account_id) {
      existingUserReview = await reviewModel.getUserReviewForVehicle(
        res.locals.accountData.account_id, 
        invId
      );
      userHasReviewed = !!existingUserReview;
    }
    
    res.render("./inventory/detail", {
      title: vehicle.inv_make + " " + vehicle.inv_model + " - Details",
      nav,
      detailHTML,
      vehicle, // Pass vehicle object directly for the review form
      reviews,
      averageRating,
      userHasReviewed,
      existingUserReview,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};

invCont.triggerError = async function (req, res, next) {
  try {
    throw new Error("Intentional 500 Error for CSE340 Assignment 3 Testing");
  } catch (error) {
    next(error);
  }
};

// Deliver management view
invCont.buildManagement = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render("./inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};

// Deliver add classification view
invCont.buildAddClassification = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
      classification_name: '',
    });
  } catch (error) {
    next(error);
  }
};

// Process add classification form
invCont.addClassification = async function (req, res, next) {
  try {
    const { classification_name } = req.body;
    
    // Add classification to database
    const result = await invModel.addClassification(classification_name);
    
    if (result) {
      // Set success message - CHANGED from req.flash to req.session.messages
      req.session.messages = [`Classification "${classification_name}" was added successfully.`];
      
      // Success - redirect to management view at /inv/
      res.redirect("/inv/"); // CHANGED FROM /inv/management
    } else {
      // CHANGED from req.flash to req.session.messages
      req.session.messages = ["Sorry, the classification addition failed."];
      res.redirect("/inv/add-classification");
    }
  } catch (error) {
    next(error);
  }
};

// Deliver add inventory view
invCont.buildAddInventory = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList();
    
    res.render("./inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList,
      errors: null,
      inv_make: '',
      inv_model: '',
      inv_year: '',
      inv_description: '',
      inv_price: '',
      inv_miles: '',
      inv_color: '',
      inv_image: '/images/vehicles/no-image.png',
      inv_thumbnail: '/images/vehicles/no-image-tn.png',
      classification_id: '',
    });
  } catch (error) {
    next(error);
  }
};

// Process add inventory form
invCont.addInventory = async function (req, res, next) {
  try {
    const {
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_price,
      inv_miles,
      inv_color,
      inv_image,
      inv_thumbnail
    } = req.body;
    
    // Add inventory to database
    const result = await invModel.addInventoryItem(req.body);
    
    if (result) {
      // Set success message - CHANGED from req.flash to req.session.messages
      req.session.messages = [`Vehicle "${inv_make} ${inv_model}" was added successfully.`];
      
      // Success - redirect to management view at /inv/
      res.redirect("/inv/"); // CHANGED FROM /inv/management
    } else {
      // CHANGED from req.flash to req.session.messages
      req.session.messages = ["Sorry, the inventory addition failed."];
      res.redirect("/inv/add-inventory");
    }
  } catch (error) {
    next(error);
  }
};

// NEW: Function to get reviews for a vehicle (API endpoint)
invCont.getVehicleReviews = async function (req, res, next) {
  try {
    const invId = parseInt(req.params.invId);
    const reviews = await reviewModel.getReviewsByInventoryId(invId);
    const averageRating = await reviewModel.getAverageRating(invId);
    
    res.json({
      success: true,
      reviews,
      averageRating
    });
  } catch (error) {
    console.error("Error getting vehicle reviews:", error);
    res.status(500).json({
      success: false,
      message: "Error loading reviews"
    });
  }
};

// NEW: Function to handle review submission (API endpoint)
invCont.submitReview = async function (req, res, next) {
  try {
    const { inv_id, review_rating, review_text } = req.body;
    const account_id = res.locals.accountData?.account_id;
    
    if (!account_id) {
      return res.status(401).json({
        success: false,
        message: "Please log in to submit a review"
      });
    }
    
    // Check if user already reviewed this vehicle
    const existingReview = await reviewModel.getUserReviewForVehicle(account_id, inv_id);
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this vehicle"
      });
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
      // Get updated reviews and average rating
      const reviews = await reviewModel.getReviewsByInventoryId(inv_id);
      const averageRating = await reviewModel.getAverageRating(inv_id);
      
      res.json({
        success: true,
        message: "Review submitted successfully!",
        review: result,
        reviews,
        averageRating
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to submit review"
      });
    }
  } catch (error) {
    console.error("Error submitting review:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while submitting your review"
    });
  }
};

// NEW: Function to handle review update (API endpoint)
invCont.updateReview = async function (req, res, next) {
  try {
    const { review_id, inv_id, review_rating, review_text } = req.body;
    const account_id = res.locals.accountData?.account_id;
    
    if (!account_id) {
      return res.status(401).json({
        success: false,
        message: "Please log in to update a review"
      });
    }
    
    const reviewData = {
      account_id,
      review_rating: parseInt(review_rating),
      review_text
    };
    
    const result = await reviewModel.updateReview(review_id, reviewData);
    
    if (result) {
      // Get updated reviews and average rating
      const reviews = await reviewModel.getReviewsByInventoryId(inv_id);
      const averageRating = await reviewModel.getAverageRating(inv_id);
      
      res.json({
        success: true,
        message: "Review updated successfully!",
        review: result,
        reviews,
        averageRating
      });
    } else {
      res.status(403).json({
        success: false,
        message: "You can only update your own reviews"
      });
    }
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating your review"
    });
  }
};

// NEW: Function to handle review deletion (API endpoint)
invCont.deleteReview = async function (req, res, next) {
  try {
    const { review_id, inv_id } = req.body;
    const account_id = res.locals.accountData?.account_id;
    
    if (!account_id) {
      return res.status(401).json({
        success: false,
        message: "Please log in to delete a review"
      });
    }
    
    const result = await reviewModel.deleteReview(review_id, account_id);
    
    if (result) {
      // Get updated reviews and average rating
      const reviews = await reviewModel.getReviewsByInventoryId(inv_id);
      const averageRating = await reviewModel.getAverageRating(inv_id);
      
      res.json({
        success: true,
        message: "Review deleted successfully!",
        reviews,
        averageRating
      });
    } else {
      res.status(403).json({
        success: false,
        message: "You can only delete your own reviews"
      });
    }
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting your review"
    });
  }
};

// Alias functions for compatibility
invCont.buildInventoryManagement = async function (req, res, next) {
  try {
    return await invCont.buildManagement(req, res, next);
  } catch (error) {
    next(error);
  }
};

invCont.buildVehicleDetail = async function (req, res, next) {
  try {
    return await invCont.buildByInventoryId(req, res, next);
  } catch (error) {
    next(error);
  }
};

module.exports = invCont;