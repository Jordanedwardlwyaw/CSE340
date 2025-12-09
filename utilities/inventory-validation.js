const { body, validationResult } = require("express-validator");
const utilities = require("../utilities");
const invModel = require("../models/inventory-model");

/**
 * Validation rules for new classification
 */
const classificationRules = () => [
  body("classification_name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Please provide a classification name.")
    .isLength({ max: 30 })
    .withMessage("Classification name must be less than 30 characters.")
    .matches(/^[A-Za-z0-9]+$/)
    .withMessage("Classification name must contain only letters and numbers, no spaces or special characters.")
    .custom(async (classification_name) => {
      const classifications = await invModel.getClassifications();
      const exists = classifications.find(
        c => c.classification_name.toLowerCase() === classification_name.toLowerCase()
      );
      if (exists) {
        throw new Error("Classification already exists. Please use a different name.");
      }
    }),
];

/**
 * Middleware to check data for new classification
 */
const checkClassificationData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    
    res.render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: errors.array(),
      classification_name: req.body.classification_name,
    });
    return;
  }
  next();
};

/**
 * Validation rules for new inventory
 */
const inventoryRules = () => [
  body("inv_make")
    .trim()
    .notEmpty()
    .withMessage("Make is required.")
    .isLength({ max: 50 })
    .withMessage("Make must be less than 50 characters."),
  
  body("inv_model")
    .trim()
    .notEmpty()
    .withMessage("Model is required.")
    .isLength({ max: 50 })
    .withMessage("Model must be less than 50 characters."),
  
  body("inv_year")
    .trim()
    .notEmpty()
    .withMessage("Year is required.")
    .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
    .withMessage(`Year must be between 1900 and ${new Date().getFullYear() + 1}.`),
  
  body("inv_description")
    .trim()
    .notEmpty()
    .withMessage("Description is required."),
  
  body("inv_image")
    .trim()
    .notEmpty()
    .withMessage("Image path is required."),
  
  body("inv_thumbnail")
    .trim()
    .notEmpty()
    .withMessage("Thumbnail path is required."),
  
  body("inv_price")
    .trim()
    .notEmpty()
    .withMessage("Price is required.")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number."),
  
  body("inv_miles")
    .trim()
    .notEmpty()
    .withMessage("Mileage is required.")
    .isInt({ min: 0 })
    .withMessage("Mileage must be a non-negative integer."),
  
  body("inv_color")
    .trim()
    .notEmpty()
    .withMessage("Color is required.")
    .isLength({ max: 30 })
    .withMessage("Color must be less than 30 characters."),
  
  body("classification_id")
    .notEmpty()
    .withMessage("Please select a classification.")
    .isInt()
    .withMessage("Please select a valid classification."),
];

/**
 * Middleware to check data for new inventory
 */
const checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList(req.body.classification_id);
    
    res.render("inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
      classificationList,
      errors: errors.array(),
      inv_make: req.body.inv_make || '',
      inv_model: req.body.inv_model || '',
      inv_year: req.body.inv_year || '',
      inv_description: req.body.inv_description || '',
      inv_image: req.body.inv_image || '/images/vehicles/no-image.png',
      inv_thumbnail: req.body.inv_thumbnail || '/images/vehicles/no-image-tn.png',
      inv_price: req.body.inv_price || '',
      inv_miles: req.body.inv_miles || '',
      inv_color: req.body.inv_color || '',
      classification_id: req.body.classification_id || '',
    });
    return;
  }
  next();
};

module.exports = { 
  classificationRules, 
  checkClassificationData,
  inventoryRules, 
  checkInventoryData 
};