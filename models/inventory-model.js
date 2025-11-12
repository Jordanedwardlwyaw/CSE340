const pool = require("../database/connection");

async function getVehicleById(inv_id) {
  try {
    const sql = "SELECT * FROM inventory WHERE inv_id = $1";
    const result = await pool.query(sql, [inv_id]);
    return result.rows[0];
  } catch (error) {
    throw new Error("Error fetching vehicle data");
  }
}

async function getVehiclesByClassification(classificationId) {
  try {
    const sql = `
      SELECT * FROM inventory
      WHERE classification_id = $1
      LIMIT 5
    `;
    const result = await pool.query(sql, [classificationId]);
    return result.rows;
  } catch (error) {
    throw new Error("Error fetching classification data");
  }
}

module.exports = {
  getVehicleById,
  getVehiclesByClassification
};