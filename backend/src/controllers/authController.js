import jwt from "jsonwebtoken";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";
import { welcomeUser, welcomeTrainer } from "../utils/emailTemplates.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  });
};

const sanitizeUser = (userDoc) => {
  const user = userDoc.toObject();
  delete user.password;
  return user;
};

const USER_GENDERS = ["male", "female", "other"];
const USER_GOALS = ["weight_loss", "weight_gain", "maintain", "muscle_gain"];
const ACTIVITY_LEVELS = ["sedentary", "light", "moderate", "active", "very_active"];
const DIET_PREFERENCES = ["veg", "nonveg"];

// @desc    Register a new user (role: user | trainer | admin)
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      role = "user",
      // user fields
      gender,
      age,
      height,
      weight,
      targetWeight,
      goal,
      activityLevel,
      dietPreference,
      // trainer fields
      experience,
      specialization,
      bio,
      ratePerMonth,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: "Please provide a valid email address" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    if (!["user", "trainer", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "An account with this email already exists" });
    }

    const userData = { name, email: email.toLowerCase(), password, phone, role };

    if (role === "user") {
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

      Object.assign(userData, {
        gender,
        age,
        height,
        weight,
        targetWeight,
        goal,
        activityLevel,
        dietPreference,
      });
    }

    if (role === "trainer") {
      if (experience === undefined || experience === null || experience === "") {
        return res.status(400).json({ message: "Experience (years) is required for trainers" });
      }

      Object.assign(userData, {
        experience,
        specialization: Array.isArray(specialization) ? specialization : specialization ? [specialization] : [],
        bio,
        ratePerMonth,
      });
    }

    const user = await User.create(userData);

    const token = signToken(user._id);

    // Fire welcome email (never blocks/breaks the response)
    const template = role === "trainer" ? welcomeTrainer(user) : welcomeUser(user);
    sendEmail({
      to: user.email,
      subject: template.subject,
      html: template.html,
    });

    res.status(201).json({
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = signToken(user._id);

    res.status(200).json({
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
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
