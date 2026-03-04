import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

//import routes
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from './routes/taskRoutes.js';
import leadRoutes from "./routes/leadRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";


// Configure environment
dotenv.config();

const app = express();

// Database config
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/v1/tasks', taskRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/leads", leadRoutes);
app.use("/api/v1/employees", employeeRoutes);

app.get("/", (req, res) => {
  res.send({
    message: "Welcome to Business Management System",
  });
});

const PORT = process.env.PORT || 8085;

app.listen(PORT, () => {
  console.log(`Server Running on ${process.env.DEV_MODE} mode`.bgCyan.white);
  console.log(`Server is running on port ${PORT}`.bgCyan.white);
});