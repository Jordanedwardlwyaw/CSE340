const { body, validationResult } = require('express-validator');

// Validation rules for classification
const classificationRules = () => {
  return [
    body('classification_name')
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage('Please provide a classification name.')
      .isAlphanumeric()
      .withMessage('Classification name must contain only letters and numbers (no spaces or special characters).')
  ];
};

// Validation rules for inventory
const inventoryRules = () => {
  return [
    body('inv_make')
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage('Please provide a vehicle make.'),
    
    body('inv_model')
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage('Please provide a vehicle model.'),
    
    body('inv_year')
      .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
      .withMessage('Please provide a valid year.'),
    
    body('inv_description')
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage('Please provide a description.'),
    
    body('inv_price')
      .isFloat({ min: 0 })
      .withMessage('Please provide a valid price.'),
    
    body('inv_miles')
      .isInt({ min: 0 })
      .withMessage('Please provide valid mileage.'),
    
    body('inv_color')
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage('Please provide a color.'),
    
    body('classification_id')
      .isInt({ min: 1 })
      .withMessage('Please select a classification.')
  ];
};

// Check validation result
const checkData = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let messages = errors.array().map(error => error.msg);
    req.flash('error', messages);
    
    // Store form data for sticky forms
    if (req.originalUrl.includes('add-inventory')) {
      req.session.formData = req.body;
    }
    
    return res.redirect('back');
  }
  next();
};

module.exports = { classificationRules, inventoryRules, checkData };