import Gym from "../models/Gym.js";

// @desc    List gyms, optionally filtered by area, sorted by rating desc
// @route   GET /api/gyms
// @access  Public
export const getGyms = async (req, res, next) => {
  try {
    const { area } = req.query;

    const filter = {};
    if (area) {
      filter.area = { $regex: area, $options: "i" };
    }

    const gyms = await Gym.find(filter).sort({ rating: -1 });

    res.status(200).json({ count: gyms.length, gyms });
  } catch (error) {
    next(error);
  }
};
