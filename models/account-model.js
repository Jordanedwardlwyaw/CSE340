const pool = require("../database/")

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try {
      const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
      return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
      return error.message
    }
  }

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail(account_email) {
  try {
    console.log("Attempting to fetch account with email:", account_email);
    const result = await pool.query(
      'SELECT * FROM public.account WHERE account_email = $1',
      [account_email]
    )
    console.log("Query result rows:", result.rows.length);
    return result.rows[0]
  } catch (error) {
    console.error("Database error in getAccountByEmail:", error);
    throw error
  }
}

/* *****************************
* Update Account information
* ***************************** */
async function updateAccountById(account_id, account_firstname, account_lastname, account_email) {
  try {
    const sql = `
      UPDATE account
      SET account_firstname = $1, account_lastname = $2, account_email = $3
      WHERE account_id = $4
      RETURNING *;
    `;
    const params = [account_firstname, account_lastname, account_email, account_id];
    const result = await pool.query(sql, params);

    return result.rowCount;
  } catch (error) {
    console.error("Error in updateAccountById:", error);
    throw error;
  }
}

/* *****************************
* Update password
* ***************************** */
async function updatePassword(account_id, hashedPassword) {
  const sql = `
    UPDATE account
    SET account_password = $1
    WHERE account_id = $2
    RETURNING *;
  `;
  const params = [hashedPassword, parseInt(account_id)];

  try {
    const result = await pool.query(sql, params);
    return result.rowCount;
  } catch (err) {
    console.error("Error in updatePassword:", err);
    throw err;
  }
}

module.exports = {registerAccount, checkExistingEmail, getAccountByEmail, updateAccountById, updatePassword }