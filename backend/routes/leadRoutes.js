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

//create
router.post("/create", requiredSignIn, isAdmin, createLead);
//all leads
router.get("/all", requiredSignIn, isAdmin, getLeads);
//get single lead
router.get("/single/:id", requiredSignIn, isAdmin, getSingleLead);
//update
router.put("/update/:id", requiredSignIn, isAdmin, updateLead);
//delete
router.delete("/delete/:id", requiredSignIn, isAdmin, deleteLead);

export default router;