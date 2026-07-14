import User from "../models/User.js";
import calculateCalories from "../utils/calorieCalculator.js";
import getDietPlan from "../utils/dietPlans.js";
import getWorkoutPlan from "../utils/workoutPlans.js";

const USER_GENDERS = ["male", "female", "other"];
const USER_GOALS = ["weight_loss", "weight_gain", "maintain", "muscle_gain"];
const ACTIVITY_LEVELS = ["sedentary", "light", "moderate", "active", "very_active"];
const DIET_PREFERENCES = ["veg", "nonveg"];

const sanitizeUser = (userDoc) => {
  const user = userDoc.toObject();
  delete user.password;
  return user;
};

// @desc    Get current user's profile
// @route   GET /api/users/profile
// @access  Private
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
};

// @desc    Update current user's profile / health fields
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const {
      name,
      phone,
      gender,
      age,
      height,
      weight,
      targetWeight,
      goal,
      activityLevel,
      dietPreference,
      experience,
      specialization,
      bio,
      ratePerMonth,
    } = req.body;

    if (gender && !USER_GENDERS.includes(gender)) {
      return res.status(400).json({ message: "Invalid gender value" });
    }
    if (goal && !USER_GOALS.includes(goal)) {
      return res.status(400).json({ message: "Invalid goal value" });
    }
    if (activityLevel && !ACTIVITY_LEVELS.includes(activityLevel)) {
      return res.status(400).json({ message: "Invalid activityLevel value" });
    }
    if (dietPreference && !DIET_PREFERENCES.includes(dietPreference)) {
      return res.status(400).json({ message: "Invalid dietPreference value" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatableFields = {
      name,
      phone,
      gender,
      age,
      height,
      weight,
      targetWeight,
      goal,
      activityLevel,
      dietPreference,
      experience,
      specialization,
      bio,
      ratePerMonth,
    };

    Object.entries(updatableFields).forEach(([key, value]) => {
      if (value !== undefined) {
        user[key] = value;
      }
    });

    await user.save();

    res.status(200).json({ user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload/replace the trainer's profile picture
// @route   POST /api/users/profile/photo
// @access  Private (trainer)
export const uploadProfilePicture = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file uploaded" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.profilePicture = `/uploads/trainers/${req.file.filename}`;
    await user.save();

    res.status(200).json({ user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
};

// @desc    Add photos to the trainer's gallery (max 5 total)
// @route   POST /api/users/profile/gallery
// @access  Private (trainer)
export const uploadGalleryPhotos = async (req, res, next) => {
  try {
    if (!req.files || !req.files.length) {
      return res.status(400).json({ message: "No image files uploaded" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existing = user.gallery || [];
    if (existing.length + req.files.length > 5) {
      return res.status(400).json({
        message: `Gallery allows at most 5 photos (you have ${existing.length})`,
      });
    }

    const newPaths = req.files.map((f) => `/uploads/trainers/${f.filename}`);
    user.gallery = [...existing, ...newPaths];
    await user.save();

    res.status(200).json({ user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove a photo from the trainer's gallery
// @route   DELETE /api/users/profile/gallery
// @access  Private (trainer)
export const deleteGalleryPhoto = async (req, res, next) => {
  try {
    const { photoUrl } = req.body;
    if (!photoUrl) {
      return res.status(400).json({ message: "photoUrl is required" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.gallery = (user.gallery || []).filter((p) => p !== photoUrl);
    await user.save();

    res.status(200).json({ user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
};

// @desc    Compute and return BMR, TDEE, calorie target
// @route   GET /api/users/calories
// @access  Private
export const getCalories = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const result = calculateCalories(user);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Get a rule-based Indian-style diet plan based on user's calorie target
// @route   GET /api/users/diet-plan
// @access  Private
export const getDietPlanForUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { calorieTarget } = calculateCalories(user);
    const dietPreference = user.dietPreference || "veg";
    const meals = getDietPlan(calorieTarget, dietPreference);

    res.status(200).json({
      calorieTarget,
      dietPreference,
      meals,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get workout plan (5-day split + tutorials) for a given muscle group
// @route   GET /api/users/workout-plan?muscle=chest
// @access  Private
export const getWorkoutPlanForUser = async (req, res, next) => {
  try {
    const { muscle } = req.query;

    if (!muscle) {
      return res.status(400).json({ message: "Query parameter 'muscle' is required" });
    }

    const plan = getWorkoutPlan(muscle);
    res.status(200).json(plan);
  } catch (error) {
    next(error);
  }
};
