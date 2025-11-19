const inventoryModel = require("../models/inventory-model");

exports.showHome = (req, res) => {
  res.render("home", {
    custom: {
      upgrades: inventoryModel.getCustomUpgrades()
    }
  });
};

exports.showClassification = (req, res) => {
  const type = req.params.type;
  const vehicles = inventoryModel.getVehiclesByType(type);

  res.render("classification", {
    type,
    vehicles
  });
};

exports.showVehicleDetails = (req, res, next) => {
  const vehicle = inventoryModel.getVehicleById(req.params.id);
  if (!vehicle) {
    return next(new Error("Vehicle not found"));
  }
  res.render("details", {
    vehicle
  });
};

exports.showCustom = (req, res) => {
  res.render("custom", {
    custom: {
      baseCar: inventoryModel.getVehicleById(7),
      upgrades: inventoryModel.getCustomUpgrades()
    }
  });
};