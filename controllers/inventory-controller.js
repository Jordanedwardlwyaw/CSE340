const { inventory } = require("../models/inventory-model");

exports.showHome = (req, res) => {
  res.render("home", { home: inventory.home });
};

exports.showClassification = (req, res) => {
  const type = req.params.type;
  const vehicles = inventory.classifications[type];

  if (!vehicles) {
    return res.status(404).render("404", { message: "Classification not found" });
  }

  res.render("classification", { type, vehicles });
};

exports.showDetails = (req, res) => {
  const id = parseInt(req.params.id);
  let vehicle = null;

  for (let key in inventory.classifications) {
    let found = inventory.classifications[key].find(v => v.id === id);
    if (found) vehicle = found;
  }

  if (!vehicle) {
    return res.status(404).render("404", { message: "Vehicle not found" });
  }

  res.render("details", { vehicle });
};

exports.showCustom = (req, res) => {
  res.render("custom", { custom: inventory.classifications.Custom });
};
