const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require("path");
const userRoutes = require('./routes/usersRoutes');
const tripRoutes = require('./routes/tripsRoutes');
const wishRoutes = require('./routes/wishesRoutes');
const openAiRoutes = require('./routes/openAiRoutes');
const pool = require('./config/db');

// Configure dotenv to look for .env file in backend directory
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use("/api/usersRoutes", userRoutes);
app.use("/api/tripsRoutes", tripRoutes);
app.use("/api/wishesRoutes", wishRoutes);
app.use("/api/openAiRoutes", openAiRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to FlyAway!");
});

const PORT = process.env.PORT || process.env.BACK_PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});