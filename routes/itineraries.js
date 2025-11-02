import express from "express";
import { body, validationResult } from "express-validator";
import Itinerary from "../models/Itinerary.js";
import Trip from "../models/Trip.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// @route   GET /api/itineraries/:tripId
// @desc    Get all itineraries for a trip
// @access  Private
router.get("/:tripId", auth, async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.tripId,
      createdBy: req.user.id,
    });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    const itineraries = await Itinerary.find({
      tripId: req.params.tripId,
    }).sort({ day: 1 });

    res.json(itineraries);
  } catch (error) {
    console.error("Get itineraries error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/itineraries
// @desc    Create new itinerary
// @access  Private
router.post(
  "/",
  auth,
  [
    body("tripId").notEmpty().withMessage("Trip ID is required"),
    body("day").isNumeric().withMessage("Day must be a number"),
    body("date").isISO8601().withMessage("Valid date is required"),
    body("activities").isArray().withMessage("Activities must be an array"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const trip = await Trip.findOne({
        _id: req.body.tripId,
        createdBy: req.user.id,
      });

      if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
      }

      const itineraryData = {
        ...req.body,
        createdBy: req.user.id,
      };

      const itinerary = new Itinerary(itineraryData);
      await itinerary.save();

      res.status(201).json(itinerary);
    } catch (error) {
      console.error("Create itinerary error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   PUT /api/itineraries/:id
// @desc    Update itinerary
// @access  Private
router.put("/:id", auth, async (req, res) => {
  try {
    const itinerary = await Itinerary.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    const trip = await Trip.findOne({
      _id: itinerary.tripId,
      createdBy: req.user.id,
    });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    const updatedItinerary = await Itinerary.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedItinerary);
  } catch (error) {
    console.error("Update itinerary error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   DELETE /api/itineraries/:id
// @desc    Delete itinerary
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const itinerary = await Itinerary.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    await Itinerary.findByIdAndDelete(req.params.id);

    res.json({ message: "Itinerary deleted successfully" });
  } catch (error) {
    console.error("Delete itinerary error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/itineraries/:id/activities
// @desc    Add activity to itinerary
// @access  Private
router.post(
  "/:id/activities",
  auth,
  [
    body("title").notEmpty().withMessage("Activity title is required"),
    body("startTime").notEmpty().withMessage("Start time is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const itinerary = await Itinerary.findOne({
        _id: req.params.id,
        createdBy: req.user.id,
      });

      if (!itinerary) {
        return res.status(404).json({ message: "Itinerary not found" });
      }

      itinerary.activities.push(req.body);
      await itinerary.save();

      res.json(itinerary);
    } catch (error) {
      console.error("Add activity error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   PUT /api/itineraries/:id/activities/:activityId
// @desc    Update activity in itinerary
// @access  Private
router.put("/:id/activities/:activityId", auth, async (req, res) => {
  try {
    const itinerary = await Itinerary.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    const activity = itinerary.activities.id(req.params.activityId);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    Object.assign(activity, req.body);
    await itinerary.save();

    res.json(itinerary);
  } catch (error) {
    console.error("Update activity error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   DELETE /api/itineraries/:id/activities/:activityId
// @desc    Delete activity from itinerary
// @access  Private
router.delete("/:id/activities/:activityId", auth, async (req, res) => {
  try {
    const itinerary = await Itinerary.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    itinerary.activities.id(req.params.activityId).remove();
    await itinerary.save();

    res.json(itinerary);
  } catch (error) {
    console.error("Delete activity error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;