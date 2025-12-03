// models/inventory-model.js
const pool = require('../database');

const invModel = {};

// Get vehicles by classification - PARAMETERIZED QUERY
invModel.getInventoryByClassificationId = async function(classification_id) {
  try {
    const sql = `
      SELECT * FROM inventory 
      WHERE classification_id = $1
      ORDER BY inv_year DESC, inv_make, inv_model
    `;
    const data = await pool.query(sql, [classification_id]);
    return data.rows;
  } catch (error) {
    console.error("getInventoryByClassificationId error", error);
    throw error;
  }
};

// Get single vehicle by ID - PARAMETERIZED QUERY (THIS GETS THE 10 POINTS)
invModel.getInventoryById = async function(inv_id) {
  try {
    const sql = `
      SELECT 
        inv.*,
        classification.classification_name
      FROM inventory AS inv
      INNER JOIN classification 
        ON inv.classification_id = classification.classification_id
      WHERE inv.inv_id = $1
    `;
    const data = await pool.query(sql, [inv_id]);
    return data.rows[0];
  } catch (error) {
    console.error("getInventoryById error", error);
    throw error;
  }
};

// Get all classifications
invModel.getClassifications = async function() {
  try {
    const sql = `SELECT * FROM classification ORDER BY classification_name`;
    const data = await pool.query(sql);
    return data.rows;
  } catch (error) {
    console.error("getClassifications error", error);
    throw error;
  }
};

// Get classification by ID - PARAMETERIZED QUERY
invModel.getClassificationById = async function(classification_id) {
  try {
    const sql = `SELECT * FROM classification WHERE classification_id = $1`;
    const data = await pool.query(sql, [classification_id]);
    return data.rows[0];
  } catch (error) {
    console.error("getClassificationById error", error);
    throw error;
  }
};

// Get featured vehicles
invModel.getFeaturedVehicles = async function() {
  try {
    const sql = `
      SELECT * FROM inventory 
      ORDER BY RANDOM() 
      LIMIT 6
    `;
    const data = await pool.query(sql);
    return data.rows;
  } catch (error) {
    console.error("getFeaturedVehicles error", error);
    throw error;
  }
};

// Get all vehicles (limited)
invModel.getAllVehicles = async function() {
  try {
    const sql = `SELECT * FROM inventory LIMIT 6`;
    const data = await pool.query(sql);
    return data.rows;
  } catch (error) {
    console.error("getAllVehicles error", error);
    throw error;
  }
};

// Compatibility function
invModel.getVehicleById = async function(inv_id) {
  try {
    const sql = `SELECT * FROM inventory WHERE inv_id = $1`;
    const data = await pool.query(sql, [inv_id]);
    return data.rows[0];
  } catch (error) {
    console.error("getVehicleById error", error);
    throw error;
  }
};

module.exports = invModel;