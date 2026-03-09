import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Generate JWT
const generateToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

// Register
export const registerUser = async (req, res) => {
  const { first_name, last_name, email, password, role, phoneNumber, NIC } = req.body;

  try {
    if (await User.findOne({ email }))
      return res.status(400).json({ message: "Email already exists" });

    if (await User.findOne({ NIC }))
      return res.status(400).json({ message: "NIC already exists" });

    const user = await User.create({ first_name, last_name, email, password, role, phoneNumber, NIC });

    // Generate token first
    const token = generateToken(user);

    // Set token as cookie
    res.cookie("access_token", token, {
      httpOnly: true,       // prevents client-side JS from reading it
      secure: false,        // true in production (https)
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(201).json({
      message: "Registration successful",
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user && user.matchPassword(password)) {

      const token = generateToken(user);

      // Set cookie
      res.cookie("access_token", token, {
        httpOnly: true,
        secure: false, // true in production
        maxAge: 24 * 60 * 60 * 1000 // 1 day
      });

      res.status(200).json({
        message: "Login successful",
        user,
        token // optional to send in response too
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Logout (frontend just deletes token)
export const logoutUser = async (req, res) => {
  // Clear cookie
  res.clearCookie("access_token");
  res.status(200).json({ message: "Logged out successfully" });
};

// Get logged-in user profile
export const getUserProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get all users (admin only)
export const getAllEmployees = async (req, res) => {
  try {

    const employees = await User.find({ role: "employee" }).select("-password");

    res.status(200).json({
      count: employees.length,
      employees,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};