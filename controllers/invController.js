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

// NEW FUNCTIONS FOR ASSIGNMENT 4

// Deliver management view - FIXED: Added successMessage parameter
invCont.buildManagement = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render("./inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
      successMessage: null, // ADDED THIS LINE
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
      classification_name: null,
    });
  } catch (error) {
    next(error);
  }
};

// Process add classification form
invCont.addClassification = async function (req, res, next) {
  try {
    const { classification_name } = req.body;
    const nav = await utilities.getNav();
    
    // Simple validation
    if (!classification_name || !/^[a-zA-Z0-9]+$/.test(classification_name)) {
      return res.render("./inventory/add-classification", {
        title: "Add New Classification",
        nav,
        errors: [{ msg: "Classification name cannot contain spaces or special characters." }],
        classification_name,
      });
    }
    
    // Check if classification already exists
    const classifications = await invModel.getClassifications();
    const exists = classifications.find(
      c => c.classification_name.toLowerCase() === classification_name.toLowerCase()
    );
    
    if (exists) {
      return res.render("./inventory/add-classification", {
        title: "Add New Classification",
        nav,
        errors: [{ msg: "Classification already exists." }],
        classification_name,
      });
    }
    
    // Add classification to database
    const result = await invModel.addClassification(classification_name);
    
    if (result) {
      // Rebuild nav to include new classification
      const newNav = await utilities.getNav();
      
      // Success - render management view - FIXED: Added successMessage
      res.render("./inventory/management", {
        title: "Inventory Management",
        nav: newNav,
        errors: null,
        successMessage: `Classification "${classification_name}" was added successfully.`,
      });
    } else {
      throw new Error("Classification insertion failed.");
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
      inv_make: null,
      inv_model: null,
      inv_year: null,
      inv_description: null,
      inv_price: null,
      inv_miles: null,
      inv_color: null,
      inv_image: "/images/vehicles/no-image.png",
      inv_thumbnail: "/images/vehicles/no-image-tn.png",
    });
  } catch (error) {
    next(error);
  }
};

// Process add inventory form
invCont.addInventory = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList(req.body.classification_id);
    
    // Extract form data
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
    
    // Simple validation
    const errors = [];
    
    if (!classification_id) errors.push({ msg: "Classification is required." });
    if (!inv_make) errors.push({ msg: "Make is required." });
    if (!inv_model) errors.push({ msg: "Model is required." });
    if (!inv_year || inv_year < 1900 || inv_year > new Date().getFullYear() + 1) {
      errors.push({ msg: "Valid year is required." });
    }
    if (!inv_description) errors.push({ msg: "Description is required." });
    if (!inv_price || inv_price <= 0) errors.push({ msg: "Valid price is required." });
    if (!inv_miles || inv_miles < 0) errors.push({ msg: "Valid mileage is required." });
    if (!inv_color) errors.push({ msg: "Color is required." });
    
    if (errors.length > 0) {
      return res.render("./inventory/add-inventory", {
        title: "Add New Vehicle",
        nav,
        classificationList,
        errors,
        classification_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_price,
        inv_miles,
        inv_color,
        inv_image: inv_image || "/images/vehicles/no-image.png",
        inv_thumbnail: inv_thumbnail || "/images/vehicles/no-image-tn.png",
      });
    }
    
    // Add inventory to database
    const result = await invModel.addInventoryItem(req.body);
    
    if (result) {
      // Success - render management view - FIXED: Added successMessage
      res.render("./inventory/management", {
        title: "Inventory Management",
        nav,
        errors: null,
        successMessage: `Vehicle "${inv_make} ${inv_model}" was added successfully.`,
      });
    } else {
      throw new Error("Inventory insertion failed.");
    }
  } catch (error) {
    next(error);
  }
};// Add this function to your invController if it doesn't exist
invCont.buildInventoryManagement = async function (req, res, next) {
  try {
    // Use the existing buildManagement function
    return await invCont.buildManagement(req, res, next);
  } catch (error) {
    next(error);
  }
};

// Also add this if buildVehicleDetail doesn't exist
invCont.buildVehicleDetail = async function (req, res, next) {
  try {
    // Use the existing buildByInventoryId function
    return await invCont.buildByInventoryId(req, res, next);
  } catch (error) {
    next(error);
  }
};

module.exports = invCont;