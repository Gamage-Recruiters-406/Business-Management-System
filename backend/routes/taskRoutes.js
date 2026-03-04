import express from "express";
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
  getTasksByUser,
  getTaskStats,
} from "../controllers/taskController.js";
import { requiredSignIn, isAdmin } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

// Task statistics route (place before :id routes to avoid conflicts)
router.get("/stats", requiredSignIn, getTaskStats);

// Get tasks by user
router.get("/user/:userId", requiredSignIn, getTasksByUser);

// CRUD routes
router.route("/").get(requiredSignIn, getAllTasks).post(requiredSignIn, isAdmin, createTask);

router
  .route("/:id")
  .get(requiredSignIn, getTaskById)
  .put(requiredSignIn, isAdmin, updateTask)
  .delete(requiredSignIn, isAdmin, deleteTask);

// Update task status
router.patch("/:id/status", requiredSignIn, isAdmin, updateTaskStatus);

export default router;
