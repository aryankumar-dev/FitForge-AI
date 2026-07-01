import HireRequest from "../models/HireRequest.js";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";
import {
  hireRequestToTrainer,
  hireRequestConfirmationToUser,
  hireStatusToUser,
  hireStatusToTrainer,
} from "../utils/emailTemplates.js";

// @desc    Create a hire request
// @route   POST /api/hire-requests
// @access  Private (role: user)
export const createHireRequest = async (req, res, next) => {
  try {
    const { trainerId, message } = req.body;

    if (!trainerId) {
      return res.status(400).json({ message: "trainerId is required" });
    }

    const trainer = await User.findOne({ _id: trainerId, role: "trainer" });
    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }

    const hireRequest = await HireRequest.create({
      user: req.user._id,
      trainer: trainer._id,
      message,
      status: "pending",
    });

    const toTrainerTemplate = hireRequestToTrainer(req.user, trainer, message);
    sendEmail({
      to: trainer.email,
      subject: toTrainerTemplate.subject,
      html: toTrainerTemplate.html,
    });

    const toUserTemplate = hireRequestConfirmationToUser(req.user, trainer);
    sendEmail({
      to: req.user.email,
      subject: toUserTemplate.subject,
      html: toUserTemplate.html,
    });

    res.status(201).json({ hireRequest });
  } catch (error) {
    next(error);
  }
};

// @desc    Get hire requests relevant to current user (sent if user, received if trainer)
// @route   GET /api/hire-requests/mine
// @access  Private
export const getMyHireRequests = async (req, res, next) => {
  try {
    let hireRequests;

    if (req.user.role === "user") {
      hireRequests = await HireRequest.find({ user: req.user._id })
        .populate("trainer", "-password")
        .sort({ createdAt: -1 });
    } else if (req.user.role === "trainer") {
      hireRequests = await HireRequest.find({ trainer: req.user._id })
        .populate("user", "-password")
        .sort({ createdAt: -1 });
    } else {
      hireRequests = await HireRequest.find({})
        .populate("user", "-password")
        .populate("trainer", "-password")
        .sort({ createdAt: -1 });
    }

    res.status(200).json({ count: hireRequests.length, hireRequests });
  } catch (error) {
    next(error);
  }
};

// @desc    Update hire request status (accept/reject)
// @route   PUT /api/hire-requests/:id/status
// @access  Private (role: trainer, only the trainer on the request)
export const updateHireRequestStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be 'accepted' or 'rejected'" });
    }

    const hireRequest = await HireRequest.findById(req.params.id)
      .populate("user")
      .populate("trainer");

    if (!hireRequest) {
      return res.status(404).json({ message: "Hire request not found" });
    }

    if (String(hireRequest.trainer._id) !== String(req.user._id)) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this hire request" });
    }

    hireRequest.status = status;
    await hireRequest.save();

    const toUserTemplate = hireStatusToUser(hireRequest.user, hireRequest.trainer, status);
    sendEmail({
      to: hireRequest.user.email,
      subject: toUserTemplate.subject,
      html: toUserTemplate.html,
    });

    const toTrainerTemplate = hireStatusToTrainer(hireRequest.user, hireRequest.trainer, status);
    sendEmail({
      to: hireRequest.trainer.email,
      subject: toTrainerTemplate.subject,
      html: toTrainerTemplate.html,
    });

    res.status(200).json({ hireRequest });
  } catch (error) {
    next(error);
  }
};
