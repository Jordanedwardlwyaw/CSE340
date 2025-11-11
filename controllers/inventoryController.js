const inventoryModel = require("../models/inventory-model");
const utilities = require("../utilities");

async function buildVehicleDetail(req, res, next) {
  try {
    const inv_id = req.params.inv_id;
    const vehicleData = await inventoryModel.getVehicleById(inv_id);

    if (!vehicleData) {
      return res.status(404).render("errors/404", { title: "Vehicle Not Found" });
    }

    const vehicleHTML = utilities.buildVehicleDetailHTML(vehicleData);

    res.render("inventory/detail", {
      title: `${vehicleData.make} ${vehicleData.model}`,
      vehicleHTML,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { buildVehicleDetail };
