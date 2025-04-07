
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


//TABLES CREATION:

// CREATE TABLE users (
//   user_id SERIAL PRIMARY KEY,
//   name VARCHAR(255),
//   mail VARCHAR(255),
//   password VARCHAR(255),
//   birthday DATE,
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );


// CREATE TABLE trips (
//   trip_id SERIAL PRIMARY KEY,
//   user_id INTEGER,
//   review TEXT,
//   stars INTEGER,
//   destination VARCHAR(255),
//   trip_name VARCHAR(255),
//   start_date DATE,
//   end_date DATE,
//   album_s3location TEXT
// );

// CREATE TABLE wishlist (
//   wish_id SERIAL PRIMARY KEY,
//   user_id INTEGER,
//   destination VARCHAR(255),
//   trip_length INTEGER,
//   budget INTEGER,
//   wish_name TEXT,
//   notes TEXT,
//   trip_genres VARCHAR(255),
//   start_date DATE,
//   end_date DATE,
//   recommendation JSON
// );
