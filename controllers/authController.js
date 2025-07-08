const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendRegistrationmail } = require("../utils/email");

// Register a new user
const registerUser = async (req, res, next) => {
  try {
    // Extract user data from request body
    const { email, password } = req.body;

    // Validate user data (you can add more validation as needed)
    if (!email || !password) {
      return res.status(400).json({
        message:
          "Please provide all required fields: name, email, and password",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email",
      });
    }

    // Create a new user
    const newUser = await User.create({
      email,
      password,
    });
    await sendRegistrationmail({
      to:newUser.email,
      email:newUser.email,
    });
   

    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({
      message: "Something went wrong while registering the user",
    });
  }
};

// Login a user
const loginUser = async (req, res, next) => {
  try {
    // Extract user data from request body
    const { email, password } = req.body;

    // Validate user data
    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide both email and password",
      });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    // If the password is invalid, return an error
    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // JWT token generation
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Set the token in the cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3600000,
    });

    // Respond with success message
    res.status(200).json({
      message: "User logged in successfully",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      token: token,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({
      message: "Something went wrong while logging in the user",
    });
  }
};

// Logout a user
const logoutUser = (req, res, next) => {
  // Clear the cookie
  res.clearCookie("token");

  // Respond with success message
  res.status(200).json({
    message: "User logged out successfully",
  });
};

// Export the controller functions
module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};