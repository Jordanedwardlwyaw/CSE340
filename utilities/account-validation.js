const utilities = require(".")
const accountModel = require("../models/account-model")
const { body, validationResult } = require("express-validator")
const jwt = require("jsonwebtoken")

const validate = {}

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registationRules = () => {
  return [
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),

    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."),

    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists) {
          throw new Error("Email exists. Please log in or use different email")
        }
      }),

    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

/* ******************************
 * Check registration data
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    return res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    })
  }
  next()
}

/*  **********************************
 *  Login Data Validation Rules
 * ********************************* */
validate.loginRules = () => {
  return [
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (!emailExists) {
          throw new Error("Email does not exist. Please register.")
        }
      }),

    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password is required."),
  ]
}

/* ******************************
 * Check login data
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body
  let errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    return res.render("account/login", {
      errors,
      title: "Login",
      nav,
      account_email,
    })
  }
  next()
}

/* ***********************************************
 * JWT Login Check
 ************************************************ */
const checkLoggedIn = (req, res, next) => {
  const token = req.cookies.token

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

      res.locals.loggedIn = true
      res.locals.accountData = decoded  // 🔥 FIXED — this was missing
      res.locals.firstName = decoded.first_name
      res.locals.accountType = decoded.account_type

    } catch (err) {
      console.error("JWT Verification Error:", err)
      res.locals.loggedIn = false
    }
  } else {
    res.locals.loggedIn = false
  }

  next()
}

/* ***********************************************
 * Role Restriction Middleware (Admin / Employee)
 ************************************************ */
const restrictToRoles = (roles) => (req, res, next) => {
  // 🔥 FIXED: previously checked a variable that DID NOT EXIST
  if (res.locals.loggedIn && roles.includes(res.locals.accountData.account_type)) {
    return next()
  }

  req.flash("notice", "You are not authorized to access this page.")
  return res.redirect("/account/login")
}

module.exports = {
  registationRules: validate.registationRules,
  checkRegData: validate.checkRegData,
  loginRules: validate.loginRules,
  checkLoginData: validate.checkLoginData,
  checkLoggedIn,
  restrictToRoles,
}
