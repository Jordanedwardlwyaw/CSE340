const inventoryModel = require("../models/inventory-model");

exports.showHome = (req, res) => {
  res.render("home", {
    home: {
      banner: "/images/home-banner.jpg",
      message: "Welcome to CSE Motors!"
    }
  });
};

exports.showClassification = (req, res, next) => {
  const type = req.params.type;
  const vehicles = inventoryModel.getVehiclesByType(type);
  if (!vehicles || vehicles.length === 0) return next(new Error("No vehicles found"));
  res.render("classification", { type, vehicles });
};

exports.showVehicleDetails = (req, res, next) => {
  const vehicle = inventoryModel.getVehicleById(req.params.id);
  if (!vehicle) return next(new Error("Vehicle not found"));
  res.render("details", { vehicle });
};

exports.showCustom = (req, res) => {
  res.render("custom", {
    custom: {
      baseCar: inventoryModel.getVehicleById(7),
      upgrades: inventoryModel.getCustomUpgrades()
    }
  });
};
