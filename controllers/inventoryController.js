const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

// Build homepage view
invCont.buildHome = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render("index", {
      title: "Home - CSE Motors",
      nav,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};

// Build inventory by classification view - UPDATED TO HANDLE TEXT
invCont.buildByClassification = async function (req, res, next) {
  try {
    const classificationParam = req.params.classification;
    
    // Map text names to numeric IDs
    const classificationMap = {
      "classic": "1",
      "sedan": "4",
      "suv": "2",
      "truck": "3",
      "1": "1",
      "2": "2",
      "3": "3",
      "4": "4"
    };
    
    // Get the numeric ID from the parameter
    const classification_id = classificationMap[classificationParam.toLowerCase()] || classificationParam;
    
    const data = await invModel.getInventoryByClassificationId(classification_id);
    const grid = await utilities.buildClassificationGrid(data);
    const nav = await utilities.getNav();
    
    // Get classification name for title
    const classificationNames = {
      "1": "Classic Cars",
      "2": "SUVs", 
      "3": "Trucks",
      "4": "Sedans"
    };
    
    const className = classificationNames[classification_id] || "Vehicles";
    
    res.render("./inventory/classification", {
      title: `${className} - CSE Motors`,
      nav,
      grid,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};

// Build vehicle detail view
invCont.buildByInventoryId = async function (req, res, next) {
  try {
    const inv_id = req.params.invId;
    const data = await invModel.getVehicleById(inv_id);
    
    if (!data) {
      const error = new Error("Vehicle not found");
      error.status = 404;
      throw error;
    }
    
    const detailHTML = await utilities.buildDetailView(data);
    const nav = await utilities.getNav();
    
    res.render("./inventory/detail", {
      title: `${data.inv_make} ${data.inv_model}`,
      nav,
      detailHTML,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = invCont;