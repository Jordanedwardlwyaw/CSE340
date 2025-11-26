const pool = require("../database/");

/* ***************************
 *  Get all classifications - FORCE FALLBACK
 * ************************** */
async function getClassifications() {
  try {
    console.log("🔄 Getting classifications from database...");
    const sql = "SELECT * FROM classification ORDER BY classification_name";
    const result = await pool.query(sql);
    console.log(`✅ Database classifications: ${result.rows.length}`);
    return result;
  } catch (error) {
    console.error("❌ Database error, using fallback classifications");
    // Force fallback classifications
    return { 
      rows: [
        { classification_id: 1, classification_name: "SUV" },
        { classification_id: 2, classification_name: "Sedan" },
        { classification_id: 3, classification_name: "Truck" },
        { classification_id: 4, classification_name: "Custom" }
      ] 
    };
  }
}

/* ***************************
 *  Get inventory by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const sql = `SELECT * FROM inventory 
                 WHERE classification_id = $1 
                 ORDER BY inv_make, inv_model`;
    const result = await pool.query(sql, [classification_id]);
    return result;
  } catch (error) {
    console.error("getInventoryByClassificationId error:", error);
    return { rows: [] };
  }
}

/* ***************************
 *  Get vehicle details by inventory_id
 * ************************** */
async function getInventoryById(inv_id) {
  try {
    const sql = `SELECT * FROM inventory 
                 WHERE inv_id = $1`;
    const result = await pool.query(sql, [inv_id]);
    return result.rows[0];
  } catch (error) {
    console.error("getInventoryById error:", error);
    return null;
  }
}

/* ***************************
 *  Add new classification
 * ************************** */
async function addClassification(classification_name) {
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *";
    const result = await pool.query(sql, [classification_name]);
    return result.rowCount > 0;
  } catch (error) {
    console.error("Add classification error:", error);
    return false;
  }
}

/* ***************************
 *  Check for existing classification
 * ************************** */
async function checkExistingClassification(classification_name) {
  try {
    const sql = "SELECT * FROM classification WHERE classification_name = $1";
    const classification = await pool.query(sql, [classification_name]);
    return classification.rowCount;
  } catch (error) {
    console.error("Check classification error:", error);
    return -1;
  }
}

/* ***************************
 *  Add new inventory item
 * ************************** */
async function addInventory(invData) {
  try {
    const sql = `INSERT INTO inventory (
      inv_make, inv_model, inv_year, inv_description, 
      inv_image, inv_thumbnail, inv_price, inv_miles, 
      inv_color, classification_id
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`;
    
    const result = await pool.query(sql, [
      invData.inv_make,
      invData.inv_model,
      invData.inv_year,
      invData.inv_description,
      invData.inv_image || '/images/vehicles/no-image.png',
      invData.inv_thumbnail || '/images/vehicles/no-image-tn.png',
      invData.inv_price,
      invData.inv_miles,
      invData.inv_color,
      invData.classification_id
    ]);
    
    return result.rowCount > 0;
  } catch (error) {
    console.error("Add inventory error:", error);
    return false;
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryById,
  addClassification,
  checkExistingClassification,
  addInventory
};