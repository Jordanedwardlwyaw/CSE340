const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",       // or your remote DB host
  port: 5432,
  user: "your_db_user",
  password: "your_db_password",
  database: "your_db_name"
});

module.exports = pool;