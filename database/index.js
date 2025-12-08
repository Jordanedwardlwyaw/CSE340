// database/index.js
const { Pool } = require('pg');
require('dotenv').config();

console.log("🔧 Setting up database pool...");

// Use your Render.com URL
const connectionString = process.env.DATABASE_URL || 
  'postgresql://jordan_edwarddb_user:dltPAG0AOJtOQTw1X60oGMLg3mjU3leP@dpg-d4iqbengi27c739q0fl0-a.oregon-postgres.render.com:5432/jordan_edwarddb';

console.log("Using connection string (password hidden):", 
  connectionString.replace(/:[^:@]+@/, ':****@'));

const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false
  },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// Error handling
pool.on('error', (err) => {
  console.error('Unexpected database pool error:', err.message);
});

module.exports = pool;