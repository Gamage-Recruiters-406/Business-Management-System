import express from "express";
import {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getEmployeeStats,
} from "../controllers/employeeController.js";
import { requiredSignIn, isAdmin } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

// Employee statistics route (place before :id routes)
router.get("/stats", requiredSignIn, getEmployeeStats);

// CRUD routes
router
  .route("/")
  .get(requiredSignIn, getAllEmployees)
  .post(requiredSignIn, isAdmin, createEmployee);

router
  .route("/:id")
  .get(requiredSignIn, getEmployeeById)
  .put(requiredSignIn, isAdmin, updateEmployee)
  .delete(requiredSignIn, isAdmin, deleteEmployee);

export default router;
