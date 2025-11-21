import invModel from "../models/inventory-model.js";
import utilities from "../utilities/index.js";


const invController = {};


invController.buildManagement = async function (req, res) {
const nav = await utilities.getNav();
res.render("inventory/management", { title: "Inventory Management", nav });
};


invController.buildByClassificationId = async function (req, res) {
const classification_id = req.params.classification_id;
const data = await invModel.getInventoryByClassification(classification_id);
const nav = await utilities.getNav();
const grid = await utilities.buildClassificationGrid(data);


res.render("inventory/classification", {
title: data[0]?.classification_name + " Vehicles" || "Vehicles",
nav,
grid,
});
};


invController.buildDetailView = async function (req, res) {
const inv_id = req.params.inv_id;
const data = await invModel.getVehicleDetail(inv_id);
const nav = await utilities.getNav();


res.render("inventory/detail", {
title: `${data.inv_make} ${data.inv_model}`,
nav,
vehicle: data,
});
};


export default invController;