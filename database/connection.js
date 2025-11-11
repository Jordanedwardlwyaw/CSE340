const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",
  database: "cse340",
  user: "your_db_user",
  password: "your_db_password",
  port: 5432,
});

module.exports = pool;
