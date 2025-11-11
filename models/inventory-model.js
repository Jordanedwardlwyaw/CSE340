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

module.exports = { getVehicleById };
