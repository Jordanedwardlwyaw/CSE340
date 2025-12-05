const utilities = require("./");
const { body, validationResult } = require("express-validator");
const accountModel = require("../models/account-model");
const validate = {};

/* *****************************
 * Update Account Validation Rules
 * **************************** */
validate.updateAccountRules = () => {
  return [
    body("account_firstname")
      .trim()
      .notEmpty()
      .withMessage("First name is required.")
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),
    
    body("account_lastname")
      .trim()
      .notEmpty()
      .withMessage("Last name is required.")
      .isLength({ min: 1 })
      .withMessage("Please provide a last name."),
    
    body("account_email")
      .trim()
      .notEmpty()
      .withMessage("Email is required.")
      .isEmail()
      .withMessage("Please provide a valid email address.")
      .normalizeEmail(),
  ];
};

/* *****************************
 * Update Password Validation Rules
 * **************************** */
validate.updatePasswordRules = () => {
  return [
    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password is required.")
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ];
};

/* *****************************
 * Check update data and return errors or continue
 * **************************** */
validate.checkUpdateData = async (req, res, next) => {
  const { account_id, account_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    const accountData = await accountModel.getAccountById(account_id);
    
    res.render("account/update", {
      title: "Update Account",
      nav,
      errors: errors.array(),
      accountData,
    });
    return;
  }
  
  next();
};

/* *****************************
 * Check update password and return errors or continue
 * **************************** */
validate.checkUpdatePassword = async (req, res, next) => {
  const { account_id } = req.body;
  let errors = [];
  errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    const accountData = await accountModel.getAccountById(account_id);
    
    res.render("account/update", {
      title: "Update Account",
      nav,
      errors: errors.array(),
      accountData,
    });
    return;
  }
  
  next();
};

module.exports = validate;