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

const router = express.Router();

// Task statistics route (place before :id routes to avoid conflicts)
router.get("/stats", getTaskStats);

// Get tasks by user
router.get("/user/:userId", getTasksByUser);

// CRUD routes
router.route("/").get(getAllTasks).post(createTask);

router.route("/:id").get(getTaskById).put(updateTask).delete(deleteTask);

// Update task status
router.patch("/:id/status", updateTaskStatus);

export default router;
