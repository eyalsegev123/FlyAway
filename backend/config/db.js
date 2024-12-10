// db.js
const { Pool } = require("pg"); // Import Pool from pg to create a connection pool
require("dotenv").config(); // Load environment variables from .env file

// Set up the connection pool with database credentials from .env
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST, 
  database: process.env.DB_DATABASE, 
  password: process.env.DB_PASSWORD, 
  port: process.env.DB_PORT, 
});

// Test the connection
pool
  .connect()
  .then(() => console.log("Connected to the database successfully!"))
  .catch((err) => console.error("Database connection error:", err));

// Export the pool object for use in your app
module.exports = pool;
