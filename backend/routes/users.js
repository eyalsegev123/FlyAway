const express = require("express");
const {
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const router = express.Router();

// Endpoint: Register a new user
router.post("/register", registerUser);

// Endpoint: User login
router.post("/login", loginUser);

// Endpoint: Update user information
router.put("/update/:user_id", updateUser);

// Endpoint: Delete user
router.delete("/delete/:user_id", deleteUser);

module.exports = router;
