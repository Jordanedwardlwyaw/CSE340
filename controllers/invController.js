const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagement = async (req, res, next) => {
    try {
        let nav = await utilities.getNav();
        res.render("inventory/management", {
            title: "Vehicle Management",
            nav,
            errors: null
        });
    } catch (error) {
        next(error);
    }
};

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassification = async (req, res, next) => {
    try {
        let nav = await utilities.getNav();
        res.render("inventory/add-classification", {
            title: "Add Classification",
            nav,
            errors: null
        });
    } catch (error) {
        next(error);
    }
};

/* ***************************
 *  Process add classification
 * ************************** */
invCont.addClassification = async (req, res, next) => {
    try {
        // Add your classification processing logic here
        req.flash("notice", "Classification added successfully!");
        res.redirect("/inv/");
    } catch (error) {
        next(error);
    }
};

/* ***************************
 *  Build add inventory view
 * ************************** */
invCont.buildAddInventory = async (req, res, next) => {
    try {
        let nav = await utilities.getNav();
        let classificationList = await utilities.buildClassificationList();
        
        res.render("inventory/add-inventory", {
            title: "Add Vehicle",
            nav,
            classificationList,
            errors: null
        });
    } catch (error) {
        next(error);
    }
};

/* ***************************
 *  Process add inventory
 * ************************** */
invCont.addInventory = async (req, res, next) => {
    try {
        // Add your inventory processing logic here
        req.flash("notice", "Vehicle added successfully!");
        res.redirect("/inv/");
    } catch (error) {
        next(error);
    }
};

// Your existing functions...
invCont.buildByClassificationId = async function (req, res, next) {
  // ... your existing code
};

invCont.buildByInvId = async function (req, res, next) {
  // ... your existing code
};

module.exports = invCont;