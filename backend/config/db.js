const { Pool } = require("pg"); // Import Pool from pg to create a connection pool
require("dotenv").config(); // Load environment variables from .env file

// Set up the connection pool with database credentials from .env
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'FlyAway',
  password: 'Lior1609',  // Ensure this is a valid string
  port: 5432,
});
// Test the connection
pool
  .connect()
  .then(() => console.log("Connected to the database successfully!"))
  .catch((err) => console.error("Database connection error:", err));

// Export the pool object for use in your app
module.exports = pool;
