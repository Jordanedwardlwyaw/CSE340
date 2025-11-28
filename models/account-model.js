// Get account by ID
accountModel.getAccountById = async (account_id) => {
    try {
        const sql = "SELECT account_id, account_firstname, account_lastname, account_email, account_type FROM account WHERE account_id = $1";
        const data = await pool.query(sql, [account_id]);
        return data.rows;
    } catch (error) {
        throw new Error('Database error getting account by ID');
    }
};

// Update account information
accountModel.updateAccount = async (account_id, account_firstname, account_lastname, account_email) => {
    try {
        const sql = "UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *";
        const data = await pool.query(sql, [account_firstname, account_lastname, account_email, account_id]);
        return data.rows[0];
    } catch (error) {
        throw new Error('Database error updating account');
    }
};

// Update password
accountModel.updatePassword = async (account_id, account_password) => {
    try {
        const sql = "UPDATE account SET account_password = $1 WHERE account_id = $2 RETURNING *";
        const data = await pool.query(sql, [account_password, account_id]);
        return data.rows[0];
    } catch (error) {
        throw new Error('Database error updating password');
    }
};