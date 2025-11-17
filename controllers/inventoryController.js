const model = require('../models/inventory-model');
const utilities = require('../utilities/index');

function showClassification(req, res) {
  const classification = req.params.classification;
  const vehicles = model.getVehiclesByClassification(classification);
  res.render('inventory/classification', { classification, vehicles });
}

function showVehicle(req, res) {
  const vehicleId = req.params.id;
  const vehicle = model.getVehicleById(vehicleId);

  if (!vehicle) {
    return res.status(404).render('errors/404');
  }

  const vehicleHTML = utilities.buildVehicleDetailHTML(vehicle);
  res.render('inventory/detail', { vehicleHTML, vehicle });
}

module.exports = { showClassification, showVehicle };
