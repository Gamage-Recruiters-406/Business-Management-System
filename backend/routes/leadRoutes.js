import express from "express";
import {
  createLead,
  getLeads,
  updateLead,
  deleteLead,
  getSingleLead,
} from "../controllers/leadController.js";

import { requiredSignIn, isAdmin } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

// Admin-only Lead Management
router.post("/create", requiredSignIn, isAdmin, createLead);
router.get("/all", requiredSignIn, isAdmin, getLeads);
router.get("/single/:id", requiredSignIn, isAdmin, getSingleLead);
router.put("/update/:id", requiredSignIn, isAdmin, updateLead);
router.delete("/delete/:id", requiredSignIn, isAdmin, deleteLead);

export default router;