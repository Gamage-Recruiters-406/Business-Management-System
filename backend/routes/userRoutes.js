import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  getAllEmployees
} from "../controllers/userController.js";
import { requiredSignIn,isAdmin } from "../middlewares/AuthMiddleware.js";
const router = express.Router();

router.post("/register", registerUser); //  no auth required
router.post("/login", loginUser);       //  no auth required
router.post("/logout", requiredSignIn, logoutUser); //  auth required
router.get("/profile", requiredSignIn, getUserProfile);// profile view
router.get("/employees", requiredSignIn, isAdmin, getAllEmployees); // admin only

export default router;
