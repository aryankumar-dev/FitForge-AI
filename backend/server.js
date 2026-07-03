import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import morgan from "morgan";

import connectDB from "./src/config/db.js";
import { notFound, errorHandler } from "./src/middleware/errorHandler.js";

import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import chatRoutes from "./src/routes/chatRoutes.js";
import trainerRoutes from "./src/routes/trainerRoutes.js";
import hireRoutes from "./src/routes/hireRoutes.js";
import gymRoutes from "./src/routes/gymRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";

connectDB();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

app.get("/", (req, res) => {
  res.status(200).json({ message: "FitForge AI API is running" });
});

app.get("/api/health", (req, res) => {
  console.log("✅ Health check hit from frontend");

  res.status(200).json({
    success: true,
    message: "Backend is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/users", chatRoutes);
app.use("/api/trainers", trainerRoutes);
app.use("/api/hire-requests", hireRoutes);
app.use("/api/gyms", gymRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`FitForge AI server running on port ${PORT}`);
});

export default app;
