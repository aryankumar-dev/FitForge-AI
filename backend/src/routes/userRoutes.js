import express from "express";
import {
  getProfile,
  updateProfile,
  getCalories,
  getDietPlanForUser,
  getWorkoutPlanForUser,
} from "../controllers/userController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/profile", getProfile);
router.put("/profile", updateProfile);

router.get("/calories", authorize("user"), getCalories);
router.get("/diet-plan", authorize("user"), getDietPlanForUser);
router.get("/workout-plan", authorize("user"), getWorkoutPlanForUser);

export default router;
