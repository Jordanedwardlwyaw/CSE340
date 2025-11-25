const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id  
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
    return []
  }
}

/* ***************************
 *  Get all deatails on a specific vehicle by inventory id
 * ************************** */
async function getDetailByVehicleId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory
      WHERE inv_id = $1`,
      [inv_id]
    );
    return data.rows[0];
  } catch (error) {
    console.error("Get Details By Vehicle Id error " + error);
  }
}

/* ***************************
 *  Add Classification
 * ************************** */
async function addClass(classification_name) {
  try {
    // Check if classification already exists
    const checkSql = "SELECT classification_name FROM classification WHERE classification_name = $1";
    const checkResult = await pool.query(checkSql, [classification_name]);
    
    if (checkResult.rows.length > 0) {
      return { success: false, message: "Classification name already exists" };
    }

    // Insert new classification
    const insertSql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *";
    const result = await pool.query(insertSql, [classification_name]);
    
    return { success: true, data: result.rows[0] };
  } catch (error) {
    console.error("Error in addClass:", error);
    return { success: false, message: "Database error occurred" };
  }
}

/* ***************************
 *  Add Inventory
 * ************************** */
async function addInventory(data) {
  try {
    const sql = `INSERT INTO inventory (
      classification_id, inv_make, inv_model, inv_year, 
      inv_description, inv_image, inv_thumbnail, 
      inv_price, inv_miles, inv_color
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`;
    
    const values = [
      data.classification_id,
      data.inv_make,
      data.inv_model,
      data.inv_year,
      data.inv_description,
      data.inv_image,
      data.inv_thumbnail,
      data.inv_price,
      data.inv_miles,
      data.inv_color
    ];
    
    const result = await pool.query(sql, values);
    return { success: true, data: result.rows[0] };
  } catch (error) {
    console.error("Error in addInventory:", error);
    return { success: false, message: "Database error occurred" };
  }
}

/* ****************************************
*  Model to update inventory item info
* *************************************** */
const updateInventory = async (data) => {
  const sql = `
    UPDATE public.inventory
    SET
      classification_id = $1,
      inv_make = $2,
      inv_model = $3,
      inv_year = $4,
      inv_description = $5,
      inv_image = $6,
      inv_thumbnail = $7,
      inv_price = $8,
      inv_miles = $9,
      inv_color = $10
    WHERE inv_id = $11
  `;

  const values = [
    data.classification_id,
    data.inv_make,
    data.inv_model,
    data.inv_year,
    data.inv_description,
    data.inv_image,
    data.inv_thumbnail,
    data.inv_price,
    data.inv_miles,
    data.inv_color,
    data.inv_id,
  ];

  try {
    const result = await pool.query(sql, values);
    return result;
  } catch (err) {
    console.error("Error in updateInventory:", err);
    throw err;
  }
};

/* ****************************************
*  Model to delete an inventory item
* *************************************** */
const deleteInventoryById = async (inv_id) => {
  const sql = 'DELETE FROM inventory WHERE inv_id = $1';
  const values = [inv_id];

  try {
    const result = await pool.query(sql, values);
    return result;
  } catch (err) {
    console.error("Error in deleteInventoryById:", err);
    throw err;
  }
};

module.exports = { 
  getClassifications, 
  getInventoryByClassificationId, 
  getDetailByVehicleId, 
  addClass, 
  addInventory,
  updateInventory,
  deleteInventoryById 
}