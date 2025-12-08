const pool = require("../database");

/* ****************************************
 * Get Account by Email
 * Uses prepared statement
 **************************************** */
async function getAccountByEmail(account_email) {
  try {
    console.log("🔍 Getting account by email:", account_email);
    const sql = "SELECT * FROM account WHERE account_email = $1";
    const result = await pool.query(sql, [account_email]);
    console.log("📊 Found accounts:", result.rowCount);
    return result.rows[0];
  } catch (error) {
    console.error("❌ Get account by email error:", error.message);
    return null;
  }
}

/* ****************************************
 * Register new account
 * Uses prepared statement
 **************************************** */
async function registerAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_password
) {
  try {
    console.log("📝 Registering account:", account_email);
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
    const result = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password
    ]);
    console.log("✅ Account registered successfully");
    return result;
  } catch (error) {
    console.error("❌ Registration error:", error.message);
    return null;
  }
}

/* ****************************************
 * Get Account by ID
 * REQUIRED for Task 5
 * Uses prepared statement
 **************************************** */
async function getAccountById(account_id) {
  try {
    console.log("🔍 Getting account by ID:", account_id);
    const sql = "SELECT account_id, account_firstname, account_lastname, account_email, account_type FROM account WHERE account_id = $1";
    const result = await pool.query(sql, [account_id]);
    console.log("📊 Account data:", result.rows[0] ? "Found" : "Not found");
    return result.rows[0];
  } catch (error) {
    console.error("❌ Get account by ID error:", error.message);
    return null;
  }
}

/* ****************************************
 * Update Account Information
 * REQUIRED for Tasks 5, 6
 * Uses prepared statement
 **************************************** */
async function updateAccount(account_id, account_firstname, account_lastname, account_email) {
  try {
    console.log("🔄 Updating account:", account_id);
    const sql = `
      UPDATE account 
      SET account_firstname = $1, 
          account_lastname = $2, 
          account_email = $3 
      WHERE account_id = $4 
      RETURNING *
    `;
    const result = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_id
    ]);
    console.log("✅ Update result:", result.rowCount > 0 ? "Success" : "Failed");
    return result.rowCount > 0;
  } catch (error) {
    console.error("❌ Update account error:", error.message);
    return false;
  }
}

/* ****************************************
 * Update Password
 * REQUIRED for Tasks 5, 6
 * Uses prepared statement
 **************************************** */
async function updatePassword(account_id, account_password) {
  try {
    console.log("🔒 Updating password for account:", account_id);
    const sql = "UPDATE account SET account_password = $1 WHERE account_id = $2 RETURNING *";
    const result = await pool.query(sql, [account_password, account_id]);
    console.log("✅ Password update result:", result.rowCount > 0 ? "Success" : "Failed");
    return result.rowCount > 0;
  } catch (error) {
    console.error("❌ Update password error:", error.message);
    return false;
  }
}

/* ****************************************
 * Check if account table exists
 **************************************** */
async function checkAccountTable() {
  try {
    console.log("📊 Checking if account table exists...");
    const sql = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'account'
      )
    `;
    const result = await pool.query(sql);
    const exists = result.rows[0].exists;
    console.log("📋 Account table exists:", exists);
    
    if (exists) {
      const countResult = await pool.query("SELECT COUNT(*) as count FROM account");
      console.log("📈 Number of accounts:", countResult.rows[0].count);
    }
    
    return exists;
  } catch (error) {
    console.error("❌ Error checking account table:", error.message);
    return false;
  }
}

// Make sure ALL functions are exported
module.exports = {
  getAccountByEmail,
  registerAccount,
  getAccountById,
  updateAccount,
  updatePassword,
  checkAccountTable
};