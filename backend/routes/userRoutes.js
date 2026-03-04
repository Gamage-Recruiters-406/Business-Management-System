import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/userController.js";
import { requiredSignIn } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

router.post("/register", registerUser); //  no auth required
router.post("/login", loginUser);       //  no auth required
router.post("/logout", requiredSignIn, logoutUser); //  auth required

export default router;