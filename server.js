const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
require("dotenv").config();

// ADD THIS: Database connection test
console.log("🔧 Checking database connection...");
const { Client } = require('pg');

// Test connection directly before starting server
const testClient = new Client({
  connectionString: process.env.DATABASE_URL || 'postgresql://jordan_edwarddb_user:dltPAG0AOJtOQTw1X60oGMLg3mjU3leP@dpg-d4iqbengi27c739q0fl0-a.oregon-postgres.render.com:5432/jordan_edwarddb',
  ssl: { rejectUnauthorized: false }
});

testClient.connect()
  .then(() => {
    console.log('✅ Database connection successful!');
    return testClient.query('SELECT NOW()');
  })
  .then(res => {
    console.log('📅 Database time:', res.rows[0].now);
    
    // Also check if account table exists
    return testClient.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'account'
      )
    `);
  })
  .then(res => {
    console.log('📊 Account table exists:', res.rows[0].exists);
    
    // List all tables
    return testClient.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
  })
  .then(res => {
    console.log(`📋 Found ${res.rows.length} tables:`);
    res.rows.forEach(table => {
      console.log(`   - ${table.table_name}`);
    });
    
    testClient.end();
    console.log('🚀 Starting application server...\n');
  })
  .catch(err => {
    console.error('❌ Database connection FAILED:', err.message);
    console.error('\n💡 Troubleshooting tips:');
    console.error('1. Check if your Render.com database is running');
    console.error('2. Verify DATABASE_URL in .env file is correct');
    console.error('3. Make sure port 5432 is included in the URL');
    console.error('4. Try accessing via Render.com web console');
    
    testClient.end();
    
    // Ask if user wants to continue without database
    console.log('\n⚠️  Application will start WITHOUT database connection.');
    console.log('   Some features will not work properly.\n');
  });
// END OF DATABASE TEST

const app = express();
const port = process.env.PORT || 5500;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || "cse340-secret-key-12345",
  resave: true,
  saveUninitialized: true,
  cookie: { 
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 1000 * 60 * 60
  }
}));

// Import utilities
const utilities = require("./utilities");

// NEW: Import auth utilities for JWT
const auth = require("./utilities/auth");

// NEW: Apply JWT middleware to ALL routes (REQUIRED for Tasks 5, 8)
app.use(auth.checkJWTToken);

// Flash messages middleware
app.use((req, res, next) => {
  res.locals.messages = req.session.messages || [];
  res.locals.errors = req.session.errors || [];
  delete req.session.messages;
  delete req.session.errors;
  next();
});

// Make account data available to all views
app.use((req, res, next) => {
  res.locals.loggedin = res.locals.loggedin || 0; // Default to not logged in
  res.locals.accountData = res.locals.accountData || null;
  next();
});

// Import routes
const inventoryRoute = require("./routes/inventoryRoute");
const accountRoute = require("./routes/accountRouteW05"); // CHANGED: Use W05 account route

// Home route - UPDATED to use authenticated navigation
app.get("/", async (req, res, next) => {
  try {
    const nav = await utilities.getNavWithAuth(
      null, 
      res.locals.loggedin, 
      res.locals.accountData
    );
    
    res.render("index", {
      title: "Home - CSE Motors",
      nav,
      errors: null,
    });
  } catch (error) {
    console.error("Home route error:", error);
    next(error);
  }
});

// Use routes
app.use("/inv", inventoryRoute);
app.use("/account", accountRoute);

// 404 Error Handler - UPDATED to use authenticated navigation
app.use(async (req, res, next) => {
  try {
    const nav = await utilities.getNavWithAuth(null, res.locals.loggedin, res.locals.accountData);
    res.status(404).render("errors/error", {
      title: "404 - Page Not Found",
      message: "The page you requested could not be found.",
      status: 404,
      nav: nav
    });
  } catch (error) {
    next(error);
  }
});

// 500 Error Handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  const nav = '<ul><li><a href="/">Home</a></li></ul>';
  res.status(err.status || 500).render("errors/error", {
    title: "500 - Server Error",
    message: process.env.NODE_ENV === "development" ? err.message : "An internal server error occurred.",
    status: 500,
    nav: nav
  });
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
  console.log(`🔐 JWT Authentication enabled`);
  console.log(`🏠 Home: http://localhost:${port}/`);
  console.log(`👤 Login: http://localhost:${port}/account/login`);
  console.log(`👤 Register: http://localhost:${port}/account/register`);
  console.log(`📦 Inventory: http://localhost:${port}/inv`);
});