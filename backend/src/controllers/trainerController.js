import User from "../models/User.js";

// @desc    Get public list of trainers
// @route   GET /api/trainers
// @access  Public
export const getTrainers = async (req, res, next) => {
  try {
    const { specialization, minExperience } = req.query;

    const filter = { role: "trainer" };

    if (specialization) {
      filter.specialization = { $in: [specialization] };
    }

    if (minExperience) {
      const min = Number(minExperience);
      if (!Number.isNaN(min)) {
        filter.experience = { $gte: min };
      }
    }

    const trainers = await User.find(filter).select("-password");

    res.status(200).json({ count: trainers.length, trainers });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single trainer public profile
// @route   GET /api/trainers/:id
// @access  Public
export const getTrainerById = async (req, res, next) => {
  try {
    const trainer = await User.findOne({ _id: req.params.id, role: "trainer" }).select(
      "-password"
    );

    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }

    res.status(200).json({ trainer });
  } catch (error) {
    next(error);
  }
};
