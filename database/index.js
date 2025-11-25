const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: String(process.env.PG_PASSWORD),
  port: Number(process.env.PG_PORT),
});

// Optional: test connection
pool.connect((err, client, release) => {
  if (err) {
    console.error("PostgreSQL connection failed:", err.message);
    process.exit(1);
  } else {
    console.log("PostgreSQL connected successfully.");
    release();
  }
});

module.exports = pool;
