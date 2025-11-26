const invModel = require("../models/inventory-model");

const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function () {
  try {
    let data = await invModel.getClassifications();
    console.log(`🔄 Building nav with ${data.rows.length} classifications`);
    
    let list = "<ul>";
    list += '<li><a href="/" title="Home page">Home</a></li>';
    data.rows.forEach((row) => {
      list += "<li>";
      list +=
        '<a href="/inv/type/' +
        row.classification_id +
        '" title="See our inventory of ' +
        row.classification_name +
        ' vehicles">' +
        row.classification_name +
        "</a>";
      list += "</li>";
    });
    list += "</ul>";
    return list;
  } catch (error) {
    console.error("❌ Error building navigation:", error);
    // Return fallback navigation
    return `<ul>
      <li><a href="/">Home</a></li>
      <li><a href="/inv/add-classification">Add Classification</a></li>
      <li><a href="#">SUV</a></li>
      <li><a href="#">Sedan</a></li>
      <li><a href="#">Truck</a></li>
      <li><a href="#">Custom</a></li>
    </ul>`;
  }
};

/* ************************
 * Build classification list for select input
 ************************** */
Util.buildClassificationList = async function (classification_id = null) {
  try {
    let data = await invModel.getClassifications();
    let classificationList = '<select name="classification_id" id="classificationList" required>';
    classificationList += "<option value=''>Choose a Classification</option>";
    data.rows.forEach((row) => {
      classificationList += '<option value="' + row.classification_id + '"';
      if (classification_id != null && row.classification_id == classification_id) {
        classificationList += " selected ";
      }
      classificationList += ">" + row.classification_name + "</option>";
    });
    classificationList += "</select>";
    return classificationList;
  } catch (error) {
    console.error("Error building classification list:", error);
    return `<select name="classification_id" required>
      <option value="">Choose a Classification</option>
      <option value="1">SUV</option>
      <option value="2">Sedan</option>
      <option value="3">Truck</option>
      <option value="4">Custom</option>
    </select>`;
  }
};

module.exports = Util;