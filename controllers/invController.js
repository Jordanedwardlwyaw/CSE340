const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagement = async (req, res, next) => {
    try {
        res.render("inventory/management", {
            title: "Vehicle Management"
        });
    } catch (error) {
        next(error);
    }
};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id);

    if (!data || data.length === 0) {
      let className = "Unknown";
      try {
        const classifications = await invModel.getClassifications();
        const classification = classifications.rows.find(c => c.classification_id == classification_id);
        if (classification) {
          className = classification.classification_name;
        }
      } catch (error) {
        console.error("Error getting classification name:", error);
      }

      return res.render("./inventory/classification", {
        title: `${className} Vehicles`,
        grid: '<p class="notice">Sorry, no matching vehicles could be found.</p>',
      });
    }

    const grid = await utilities.buildClassificationGrid(data);
    const className = data[0].classification_name;
    res.render("./inventory/classification", {
      title: `${className} Vehicles`,
      grid,
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Build vehicle page by inventory id
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  try {
    const inv_id = req.params.invId;
    const data = await invModel.getDetailByVehicleId(inv_id);

    if (!data) {
      const error = new Error("Vehicle not found");
      error.status = 404;
      throw error;
    }

    const vehicleTemplate = await utilities.buildVehiclePage(data);
    const vehicleName = `${data.inv_year} ${data.inv_make} ${data.inv_model}`;
    res.render("./inventory/vehicle", {
      title: vehicleName,
      vehicleTemplate,
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassification = async (req, res, next) => {
    try {
        res.render("inventory/add-classification", {
            title: "Add Classification",
            errors: null
        });
    } catch (error) {
        next(error);
    }
};

/* ***************************
 *  Process add classification
 * ************************** */
invCont.addClassification = async (req, res, next) => {
    try {
        const { classification_name } = req.body;
        
        // Server-side validation
        const errors = [];
        if (!classification_name || classification_name.trim() === '') {
            errors.push("Classification name is required");
        } else if (!/^[a-zA-Z0-9]+$/.test(classification_name)) {
            errors.push("Classification name cannot contain spaces or special characters");
        }
        
        if (errors.length > 0) {
            return res.render("inventory/add-classification", {
                title: "Add Classification",
                errors
            });
        }
        
        // Add to database
        const result = await invModel.addClass(classification_name);
        
        if (result.success) {
            // Set success message
            req.session.messages = [{ type: 'success', content: "Classification added successfully!" }];
            res.redirect("/inv/");
        } else {
            res.render("inventory/add-classification", {
                title: "Add Classification",
                errors: [result.message || "Failed to add classification"]
            });
        }
    } catch (error) {
        next(error);
    }
};

/* ***************************
 *  Build add inventory view
 * ************************** */
invCont.buildAddInventory = async (req, res, next) => {
    try {
        const classificationList = await utilities.buildClassificationList();
        res.render("inventory/add-inventory", {
            title: "Add Inventory",
            classificationList,
            errors: null,
            formData: null
        });
    } catch (error) {
        next(error);
    }
};

/* ***************************
 *  Process add inventory
 * ************************** */
invCont.addInventory = async (req, res, next) => {
    try {
        const formData = req.body;
        const classificationList = await utilities.buildClassificationList(formData.classification_id);
        
        // Server-side validation
        const errors = [];
        if (!formData.classification_id) errors.push("Classification is required");
        if (!formData.inv_make || formData.inv_make.trim() === '') errors.push("Make is required");
        if (!formData.inv_model || formData.inv_model.trim() === '') errors.push("Model is required");
        if (!formData.inv_year || formData.inv_year < 1900 || formData.inv_year > 2030) errors.push("Valid year is required (1900-2030)");
        if (!formData.inv_description || formData.inv_description.trim() === '') errors.push("Description is required");
        if (!formData.inv_price || formData.inv_price <= 0) errors.push("Valid price is required");
        if (!formData.inv_miles || formData.inv_miles < 0) errors.push("Valid miles is required");
        if (!formData.inv_color || formData.inv_color.trim() === '') errors.push("Color is required");
        
        if (errors.length > 0) {
            return res.render("inventory/add-inventory", {
                title: "Add Inventory",
                classificationList,
                errors,
                formData
            });
        }
        
        // Add to database
        const result = await invModel.addInventory(formData);
        
        if (result.success) {
            // Set success message
            req.session.messages = [{ type: 'success', content: "Vehicle added successfully!" }];
            res.redirect("/inv/");
        } else {
            res.render("inventory/add-inventory", {
                title: "Add Inventory",
                classificationList,
                errors: ["Failed to add vehicle"],
                formData
            });
        }
    } catch (error) {
        next(error);
    }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  try {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData && invData.length > 0 && invData[0].inv_id) {
      return res.json(invData)
    } else {
      res.status(404).json({ error: "No data returned" })
    }
  } catch (error) {
    next(error)
  }
}

module.exports = invCont