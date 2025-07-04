const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
} = require("../controllers/authController");

const authRoutes = express.Router();

// Register route
authRoutes.post("/register", registerUser);

// Login router
authRoutes.post("/login", loginUser);

// Logout route
authRoutes.post("/logout", logoutUser);

module.exports = authRoutes;