import pool from "../database/index.js";


const invModel = {};


invModel.getInventoryByClassification = async function (id) {
const sql = `SELECT * FROM inventory JOIN classification
ON inventory.classification_id = classification.classification_id
WHERE inventory.classification_id = $1`;
const result = await pool.query(sql, [id]);
return result.rows;
};


invModel.getVehicleDetail = async function (id) {
const sql = "SELECT * FROM inventory WHERE inv_id = $1";
const result = await pool.query(sql, [id]);
return result.rows[0];
};


export default invModel;