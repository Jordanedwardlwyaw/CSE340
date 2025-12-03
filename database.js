// database.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.on('connect', () => {
  console.log('✅ Database connected successfully');
});

pool.on('error', (err) => {
  console.error('❌ Database connection error:', err);
});

// Test connection function
pool.testConnection = async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Database test query successful:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('❌ Database test query failed:', error.message);
    return false;
  }
};

module.exports = pool;