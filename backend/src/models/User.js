import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },
    phone: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "trainer", "admin"],
      default: "user",
    },

    // ---- role = user fields ----
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    age: {
      type: Number,
    },
    height: {
      type: Number, // cm
    },
    weight: {
      type: Number, // kg
    },
    targetWeight: {
      type: Number, // kg
    },
    goal: {
      type: String,
      enum: ["weight_loss", "weight_gain", "maintain", "muscle_gain"],
    },
    activityLevel: {
      type: String,
      enum: ["sedentary", "light", "moderate", "active", "very_active"],
    },
    dietPreference: {
      type: String,
      enum: ["veg", "nonveg"],
    },

    // ---- profile picture (any role) ----
    profilePicture: {
      type: String,
    },

    // ---- role = trainer fields ----
    gallery: {
      type: [String],
      default: undefined,
      validate: {
        validator: (arr) => !arr || arr.length <= 5,
        message: "Gallery can have at most 5 photos",
      },
    },
    experience: {
      type: Number, // years
    },
    specialization: {
      type: [String],
      default: undefined,
    },
    bio: {
      type: String,
    },
    ratePerMonth: {
      type: Number,
    },
    rating: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["available", "busy"],
      default: "available",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
