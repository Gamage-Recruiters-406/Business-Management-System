import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Generate JWT
const generateToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

// Register
export const registerUser = async (req, res) => {
  const { name, email, password, role, phoneNumber, NIC } = req.body;

  try {
    if (await User.findOne({ email }))
      return res.status(400).json({ message: "Email already exists" });

    if (await User.findOne({ NIC }))
      return res.status(400).json({ message: "NIC already exists" });

    const user = await User.create({ name, email, password, role, phoneNumber, NIC });

    res.status(201).json({
      message: "Registration successful",
      user,
      token: generateToken(user),
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
      res.status(200).json({
        message: "Login successful",
        user,
        token: generateToken(user),
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
  res.status(200).json({ message: "Logged out successfully" });
};