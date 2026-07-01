import User from "../models/User.js";
import HireRequest from "../models/HireRequest.js";

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private (role: admin)
export const getStats = async (req, res, next) => {
  try {
    const [totalUsers, totalTrainers, totalHireRequests, pending, accepted, rejected] =
      await Promise.all([
        User.countDocuments({ role: "user" }),
        User.countDocuments({ role: "trainer" }),
        HireRequest.countDocuments({}),
        HireRequest.countDocuments({ status: "pending" }),
        HireRequest.countDocuments({ status: "accepted" }),
        HireRequest.countDocuments({ status: "rejected" }),
      ]);

    res.status(200).json({
      totalUsers,
      totalTrainers,
      totalHireRequests,
      pending,
      accepted,
      rejected,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users, optionally filtered by role
// @route   GET /api/admin/users
// @access  Private (role: admin)
export const getAllUsers = async (req, res, next) => {
  try {
    const { role } = req.query;

    const filter = {};
    if (role) {
      if (!["user", "trainer", "admin"].includes(role)) {
        return res.status(400).json({ message: "Invalid role filter" });
      }
      filter.role = role;
    }

    const users = await User.find(filter).select("-password").sort({ createdAt: -1 });

    res.status(200).json({ count: users.length, users });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all hire requests (admin view)
// @route   GET /api/admin/hire-requests
// @access  Private (role: admin)
export const getAllHireRequests = async (req, res, next) => {
  try {
    const hireRequests = await HireRequest.find({})
      .populate("user", "-password")
      .populate("trainer", "-password")
      .sort({ createdAt: -1 });

    res.status(200).json({ count: hireRequests.length, hireRequests });
  } catch (error) {
    next(error);
  }
};
