const express = require("express");
const User = require("../models/User"); // Importing the User model
const router = express.Router(); // Creating an instance of Express router
const { body, validationResult } = require("express-validator"); // Importing validators from express-validator
const jwt = require("jsonwebtoken"); // Importing JWT for authentication
const bcrypt = require("bcryptjs"); // Importing bcrypt for password hashing
const jwtSecret = "Ilovedosa"; // Secret key for JWT token

// Route to create a new user
router.post(
  "/createuser",
  [
    body("email").isEmail(), // Validation: Check if email is in correct format
    body("name").isLength({ min: 5 }), // Validation: Check if name is at least 5 characters long
    body("password", "Incorrect Password").isLength({ min: 5 }), // Validation: Check if password is at least 5 characters long
  ],
  async (req, res) => {
    let success = false; // Flag to indicate success or failure
    const errors = validationResult(req); // Get validation errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() }); // Return errors if validation fails
    }
    const salt = await bcrypt.genSalt(10); // Generate salt for password hashing
    let secPassword = await bcrypt.hash(req.body.password, salt); // Hash the password
    try {
      await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPassword,
        location: req.body.location,
      }); // Create a new user with hashed password
      res.json({ success: true }); // Return success message
    } catch (error) {
      console.log(error); // Log error
      res.json({ success: false }); // Return failure message
    }
  }
);

// Route to login a user
router.post(
  "/loginuser",
  [
    body("email").isEmail(), // Validation: Check if email is in correct format
    body("password", "Incorrect Password").isLength({ min: 5 }), // Validation: Check if password is at least 5 characters long
  ],
  async (req, res) => {
    let success = false; // Flag to indicate success or failure
    const errors = validationResult(req); // Get validation errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() }); // Return errors if validation fails
    }
    let email = req.body.email; // Get email from request
    try {
      let userData = await User.findOne({ email }); // Find user by email
      if (!userData) {
        return res
          .status(400)
          .json({ success, errors: "Try logging with correct credentials" }); // Return error if user not found
      }
      const pwdCompare = await bcrypt.compare(
        req.body.password,
        userData.password
      ); // Compare hashed password
      if (!pwdCompare) {
        return res
          .status(400)
          .json({ errors: "Try logging with correct credentials" }); // Return error if password doesn't match
      }
      const data = {
        user: {
          id: userData.id,
        },
      };
      const authToken = jwt.sign(data, jwtSecret); // Generate JWT token
      return res.json({ success: true, authToken: authToken }); // Return success message with token
    } catch (error) {
      console.log(error); // Log error
      res.json({ success: false }); // Return failure message
    }
  }
);

module.exports = router; // Export the router
