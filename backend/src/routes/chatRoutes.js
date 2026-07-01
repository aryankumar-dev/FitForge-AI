import express from "express";
import { chat } from "../controllers/chatController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// Mounted under /api/users in server.js, so final path is POST /api/users/chat
router.post("/chat", protect, authorize("user"), chat);

export default router;
