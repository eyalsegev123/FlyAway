const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/usersRoutes');
const tripRoutes = require('./routes/tripsRoutes');
const wishRoutes = require('./routes/wishesRoutes');
const openAiRoutes = require('./routes/openAiRoutes');
const pool = require('./config/db');

dotenv.config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/usersRoutes", userRoutes);
app.use("/api/tripsRoutes", tripRoutes);
app.use("/api/wishesRoutes", wishRoutes);
app.use("/api/openAiRoutes", openAiRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to FlyAway!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});