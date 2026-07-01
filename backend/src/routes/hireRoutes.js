import express from "express";
import {
  createHireRequest,
  getMyHireRequests,
  updateHireRequestStatus,
} from "../controllers/hireController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.post("/", authorize("user"), createHireRequest);
router.get("/mine", getMyHireRequests);
router.put("/:id/status", authorize("trainer"), updateHireRequestStatus);

export default router;
