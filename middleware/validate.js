const { body, validationResult } = require('express-validator');

/* **********************************
 *  Classification Validation Rules
 * ********************************* */
const classificationRules = () => {
    return [
        body('classification_name')
            .trim()
            .notEmpty()
            .withMessage('Classification name is required.')
            .matches(/^[a-zA-Z0-9]+$/)
            .withMessage('Classification name cannot contain spaces or special characters.')
            .isLength({ max: 30 })
            .withMessage('Classification name cannot exceed 30 characters.')
            .escape()
    ];
}

/* **********************************
 *  Inventory Validation Rules
 * ********************************* */
const inventoryRules = () => {
    return [
        // Classification ID
        body('classification_id')
            .notEmpty()
            .withMessage('Classification is required.')
            .isInt()
            .withMessage('Classification must be a valid selection.'),
        
        // Make
        body('inv_make')
            .trim()
            .notEmpty()
            .withMessage('Make is required.')
            .isLength({ max: 50 })
            .withMessage('Make cannot exceed 50 characters.')
            .escape(),
        
        // Model
        body('inv_model')
            .trim()
            .notEmpty()
            .withMessage('Model is required.')
            .isLength({ max: 50 })
            .withMessage('Model cannot exceed 50 characters.')
            .escape(),
        
        // Year
        body('inv_year')
            .notEmpty()
            .withMessage('Year is required.')
            .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
            .withMessage(`Year must be between 1900 and ${new Date().getFullYear() + 1}.`),
        
        // Description
        body('inv_description')
            .trim()
            .notEmpty()
            .withMessage('Description is required.')
            .escape(),
        
        // Price
        body('inv_price')
            .notEmpty()
            .withMessage('Price is required.')
            .isFloat({ min: 0 })
            .withMessage('Price must be a positive number.'),
        
        // Miles
        body('inv_miles')
            .notEmpty()
            .withMessage('Miles are required.')
            .isInt({ min: 0 })
            .withMessage('Miles must be a positive number.'),
        
        // Color
        body('inv_color')
            .trim()
            .notEmpty()
            .withMessage('Color is required.')
            .isLength({ max: 30 })
            .withMessage('Color cannot exceed 30 characters.')
            .escape()
    ];
}

/* **********************************
 *  Check Validation Results
 * ********************************* */
const checkClassificationData = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        req.validationErrors = errors.array();
    }
    
    next();
}

const checkInventoryData = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        req.validationErrors = errors.array();
    }
    
    next();
}

module.exports = {
    classificationRules,
    inventoryRules,
    checkClassificationData,
    checkInventoryData
};