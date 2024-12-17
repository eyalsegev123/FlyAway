const { Pool } = require("pg"); // Import Pool from pg to create a connection pool
require("dotenv").config(); // Load environment variables from .env file

// Set up the connection pool with database credentials from .env
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,  // Ensure this is a valid string
  port: process.env.PORT,
});
// Test the connection
pool
  .connect()
  .then(() => console.log("Connected to the database successfully!"))
  .catch((err) => console.error("Database connection error:", err));

// Export the pool object for use in your app
module.exports = pool;
