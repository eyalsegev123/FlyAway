  const express = require("express");
  const {
    registerUser,
    loginUser,
    updateUser,
    getUser,
  } = require("../controllers/userController");
  const router = express.Router();

  // Endpoint: Register a new user
  router.post("/register", registerUser);

  // Endpoint: User login
  router.post("/login", loginUser);

  // Endpoint: Update user information
  router.put("/update/:user_id", updateUser);

  router.get("/user_profile/:user_id" , getUser);

  module.exports = router;
