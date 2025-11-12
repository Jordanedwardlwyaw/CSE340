const { Pool } = require("pg");

const pool = new Pool({
  host: "dpg-d468nma4d50c73cfjs50-a.oregon-postgres.render.com",
  port: 5432,
  user: "jordan_yqwo_user",
  password: "8CkhcyY17ofAF4Rec4h3xXLf6s4Z3odD",
  database: "jordan_yqwo",
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool;