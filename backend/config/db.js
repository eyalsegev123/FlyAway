// const { Pool } = require("pg");
// const path = require("path");
// const dotenv = require("dotenv");

// // Configure dotenv to look for .env file in root directory
// dotenv.config();

// // Set up the connection pool with database credentials from .env
// const pool = new Pool({
//   user: process.env.PGUSER,
//   host: process.env.PGHOST,
//   database: process.env.PGDATABASE,
//   password: process.env.PGPASSWORD,
//   port: process.env.PGPORT,
// });

// // Test the connection
// pool
//   .connect()
//   .then(() => console.log("Connected to the database successfully!"))
//   .catch((err) => console.error("Database connection error:", err));

// module.exports = pool;



const { Pool } = require("pg");
const path = require("path");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// Set up the pool
const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false, // Required by many cloud providers like Render
        },
      }
    : {
        user: process.env.PGUSER,
        host: process.env.PGHOST,
        database: process.env.PGDATABASE,
        password: process.env.PGPASSWORD,
        port: process.env.PGPORT,
      }
);

// Test the connection
pool
  .connect()
  .then(() => console.log("Connected to the database successfully!"))
  .catch((err) => console.error("Database connection error:", err));

module.exports = pool;

