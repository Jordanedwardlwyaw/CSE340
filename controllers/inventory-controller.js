const { inventory } = require("../models/inventory-model");

// Home page
exports.showHome = (req, res) => {
  res.render("home", { home: inventory.home });
};

// Classification pages
exports.showClassification = (req, res) => {
  const type = req.params.type;
  // Normalize key: make first letter uppercase, rest lowercase
  const typeKey = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  const vehicles = inventory.classifications[typeKey];

  if (!vehicles) {
    return res.status(404).render("404", { message: "Classification not found" });
  }

  res.render("classification", { type: typeKey, vehicles });
};

// Vehicle details page
exports.showDetails = (req, res) => {
  const id = parseInt(req.params.id);
  let vehicle = null;

  // Loop through all classifications to find the vehicle by ID
  for (let key in inventory.classifications) {
    const current = inventory.classifications[key];
    if (Array.isArray(current)) {
      const found = current.find(v => v.id === id);
      if (found) vehicle = found;
    } else if (current.baseCar && current.baseCar.id === id) {
      vehicle = current;
    }
  }

  if (!vehicle) {
    return res.status(404).render("404", { message: "Vehicle not found" });
  }

  res.render("details", { vehicle });
};

// Custom upgrades page
exports.showCustom = (req, res) => {
  res.render("custom", { custom: inventory.classifications.Custom });
};
