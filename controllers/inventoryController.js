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

async function buildClassificationView(req, res, next) {
  try {
    const classificationId = req.params.classificationId;
    const vehicles = await inventoryModel.getVehiclesByClassification(classificationId);

    if (!vehicles || vehicles.length === 0) {
      return res.status(404).render("errors/404", { title: "No Vehicles Found" });
    }

    const vehicleListHTML = utilities.buildClassificationHTML(vehicles);

    res.render("inventory/classification", {
      title: `${classificationId.charAt(0).toUpperCase() + classificationId.slice(1)} Vehicles`,
      vehicleListHTML
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  buildVehicleDetail,
  buildClassificationView
};