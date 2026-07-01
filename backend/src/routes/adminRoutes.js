import express from "express";
import {
  getStats,
  getAllUsers,
  getAllHireRequests,
} from "../controllers/adminController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/stats", getStats);
router.get("/users", getAllUsers);
router.get("/hire-requests", getAllHireRequests);

export default router;
