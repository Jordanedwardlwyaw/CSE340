const invModel = require("../models/inventory-model");
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
    
    res.render("./inventory/detail", {
      title: vehicle.inv_make + " " + vehicle.inv_model + " - Details",
      nav,
      detailHTML,
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
      // Rebuild nav to include new classification
      const newNav = await utilities.getNav();
      
      // Set success message
      req.flash("notice", `Classification "${classification_name}" was added successfully.`);
      
      // Success - redirect to management view
      res.redirect("/inv/management");
    } else {
      req.flash("notice", "Sorry, the classification addition failed.");
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
      // Set success message
      req.flash("notice", `Vehicle "${inv_make} ${inv_model}" was added successfully.`);
      
      // Success - redirect to management view
      res.redirect("/inv/management");
    } else {
      req.flash("notice", "Sorry, the inventory addition failed.");
      res.redirect("/inv/add-inventory");
    }
  } catch (error) {
    next(error);
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