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

module.exports = invCont;