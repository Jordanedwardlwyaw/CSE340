// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const invManagementController = require("../controllers/invManagementController");
const utilities = require("../utilities");
const { newInventoryRules, checkUpdateData } = require("../utilities/inventory-validation");
const { restrictToRoles } = require("../utilities/account-validation");
const { body } = require("express-validator");

// ==========================
// Public Routes
// ==========================

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to get inventory as JSON
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));

// Route to build vehicle page by vehicleId
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId));

// ==========================
// Assignment 4 Routes - Management (No authentication for now)
// ==========================

// Route for inventory management page (Assignment 4)
router.get("/", utilities.handleErrors(invController.buildManagement));

// Route for adding classification (Assignment 4)
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));
router.post("/add-classification", utilities.handleErrors(invController.addClassification));

// Route for adding inventory (Assignment 4)
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));
router.post(
  "/add-inventory",
  [
    body("classification_id").notEmpty().withMessage("Classification is required."),
    body("inv_make").notEmpty().withMessage("Make is required."),
    body("inv_model").notEmpty().withMessage("Model is required."),
    body("inv_year").isInt({ min: 1900, max: 2030 }).withMessage("Year must be between 1900 and 2030."),
    body("inv_description").notEmpty().withMessage("Description is required."),
    body("inv_price").isFloat({ gt: 0 }).withMessage("Price must be a positive number."),
    body("inv_miles").isInt({ min: 0 }).withMessage("Mileage must be a valid number."),
    body("inv_color").notEmpty().withMessage("Color is required."),
  ],
  utilities.handleErrors(invController.addInventory)
);

// ==========================
// Restricted Routes - employee/admin (Keep your existing ones)
// ==========================

// Route for inventory management page (Existing - keep for backward compatibility)
router.get("/manage", restrictToRoles(["Employee", "Admin"]), utilities.handleErrors(invManagementController.buildInvManagement));

// Routes for deleting inventory items
router.get("/delete/:inv_id", restrictToRoles(["Employee", "Admin"]), utilities.handleErrors(invManagementController.buildDeleteView));
router.post("/delete", restrictToRoles(["Employee", "Admin"]), utilities.handleErrors(invManagementController.processDelete));

// Route for editing inventory items in management view
router.get("/edit/:inv_id", restrictToRoles(["Employee", "Admin"]), utilities.handleErrors(invManagementController.editInventoryView));

// Route for updating inventory
router.post(
  "/update",
  restrictToRoles(["Employee", "Admin"]),
  newInventoryRules(),
  checkUpdateData,
  utilities.handleErrors(invManagementController.updateInventoryResult)
);

// Routes for adding classification (Existing - keep for backward compatibility)
router.get(
  "/manage/add-classification",
  restrictToRoles(["Employee", "Admin"]),
  utilities.handleErrors(invManagementController.buildAddClassification)
);
router.post(
  "/manage/add-classification",
  restrictToRoles(["Employee", "Admin"]),
  utilities.handleErrors(invManagementController.addClassResult)
);

// Routes for adding inventory (Existing - keep for backward compatibility)
router.get("/manage/add-inventory", restrictToRoles(["Employee", "Admin"]), utilities.handleErrors(invManagementController.buildAddInventory));
router.post(
  "/manage/add-inventory",
  restrictToRoles(["Employee", "Admin"]),
  [
    body("classification_id").notEmpty().withMessage("Classification is required."),
    body("inv_make").isLength({ min: 3 }).withMessage("Make must be at least 3 characters long."),
    body("inv_model").isLength({ min: 3 }).withMessage("Model must be at least 3 characters long."),
    body("inv_year").matches(/^\d{4}$/).withMessage("Year must be a 4-digit number."),
    body("inv_price").isFloat({ gt: 0 }).withMessage("Price must be a positive number."),
    body("inv_miles").isInt({ min: 0 }).withMessage("Mileage must be a valid number."),
    body("inv_color").notEmpty().withMessage("Color is required."),
    body("inv_thumbnail").notEmpty().withMessage("Thumbnail is required."),
    body("inv_image").notEmpty().withMessage("Image is required."),
  ],
  utilities.handleErrors(invManagementController.addInventoryResult)
);

// Error handling middleware
router.use((error, req, res, next) => {
    console.error("Inventory Route Error:", error);
    req.flash("error", "An error occurred processing your request");
    res.redirect("/inv/");
});

module.exports = router;