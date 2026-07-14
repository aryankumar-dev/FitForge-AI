import express from "express";
import {
  getProfile,
  updateProfile,
  uploadProfilePicture,
  uploadGalleryPhotos,
  deleteGalleryPhoto,
  getCalories,
  getDietPlanForUser,
  getWorkoutPlanForUser,
} from "../controllers/userController.js";
import { protect, authorize } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.use(protect);

router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.post("/profile/photo", upload.single("photo"), uploadProfilePicture);
router.post(
  "/profile/gallery",
  authorize("trainer"),
  upload.array("photos", 5),
  uploadGalleryPhotos
);
router.delete("/profile/gallery", authorize("trainer"), deleteGalleryPhoto);

router.get("/calories", authorize("user"), getCalories);
router.get("/diet-plan", authorize("user"), getDietPlanForUser);
router.get("/workout-plan", authorize("user"), getWorkoutPlanForUser);

export default router;
