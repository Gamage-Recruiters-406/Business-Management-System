import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware to check JWT and attach user
export const requiredSignIn = async (req, res, next) => {
  try {

    // Get token from cookie OR Authorization header
    const token =
      req.cookies?.access_token ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    // Attach user to request
    req.user = user;

    next();

  } catch (error) {
    return res.status(401).json({
      message: "Not authorized, token failed",
    });
  }
};

// Admin check
export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Access denied: Admins only",
    });
  }
  next();
};

// Employee check
export const isEmployee = (req, res, next) => {
  if (req.user.role !== "employee") {
    return res.status(403).json({
      message: "Access denied: Employees only",
    });
  }
  next();
};