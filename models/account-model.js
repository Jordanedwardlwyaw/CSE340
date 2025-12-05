const pool = require("../database");

const accountModel = {};

/* *****************************
 * Register new account
 * USING PARAMETERIZED QUERIES (REQUIRED for prepared statements)
 * **************************** */
accountModel.registerAccount = async function (account_firstname, account_lastname, account_email, account_password) {
  try {
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
    const result = await pool.query(sql, [account_firstname, account_lastname, account_email, account_password]);
    return result.rows[0];
  } catch (error) {
    console.error("registerAccount error:", error);
    return null;
  }
};

/* *****************************
 * Get account by email
 * USING PARAMETERIZED QUERIES
 * **************************** */
accountModel.getAccountByEmail = async function (account_email) {
  try {
    const sql = "SELECT account_id, account_firstname, account_lastname, account_email, account_password, account_type FROM account WHERE account_email = $1";
    const result = await pool.query(sql, [account_email]);
    return result.rows[0];
  } catch (error) {
    console.error("getAccountByEmail error:", error);
    return null;
  }
};

/* *****************************
 * Get account by ID
 * USING PARAMETERIZED QUERIES (REQUIRED for update functionality)
 * **************************** */
accountModel.getAccountById = async function (account_id) {
  try {
    const sql = "SELECT account_id, account_firstname, account_lastname, account_email, account_type FROM account WHERE account_id = $1";
    const result = await pool.query(sql, [account_id]);
    return result.rows[0];
  } catch (error) {
    console.error("getAccountById error:", error);
    return null;
  }
};

/* *****************************
 * Update account information
 * USING PARAMETERIZED QUERIES (REQUIRED for prepared statements)
 * **************************** */
accountModel.updateAccount = async function (account_id, account_firstname, account_lastname, account_email) {
  try {
    const sql = "UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *";
    const result = await pool.query(sql, [account_firstname, account_lastname, account_email, account_id]);
    return result.rowCount > 0;
  } catch (error) {
    console.error("updateAccount error:", error);
    return false;
  }
};

/* *****************************
 * Update password
 * USING PARAMETERIZED QUERIES (REQUIRED for prepared statements)
 * **************************** */
accountModel.updatePassword = async function (account_id, account_password) {
  try {
    const sql = "UPDATE account SET account_password = $1 WHERE account_id = $2";
    const result = await pool.query(sql, [account_password, account_id]);
    return result.rowCount > 0;
  } catch (error) {
    console.error("updatePassword error:", error);
    return false;
  }
};

module.exports = accountModel;