import express from "express";
import { body, validationResult } from "express-validator";
import Trip from "../models/Trip.js";
import Itinerary from "../models/Itinerary.js";
import User from "../models/User.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// @route   GET /api/trips
// @desc    Get all trips for authenticated user
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const { status, limit = 10, page = 1 } = req.query;
    const query = { createdBy: req.user.id };

    if (status) {
      query.status = status;
    }

    const trips = await Trip.find(query)
      .sort({ startDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate("createdBy", "name email");

    const total = await Trip.countDocuments(query);

    res.json({
      trips,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("Get trips error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/trips/:id
// @desc    Get single trip
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    }).populate("createdBy", "name email");

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.json(trip);
  } catch (error) {
    console.error("Get trip error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/trips
// @desc    Create new trip
// @access  Private
router.post(
  "/",
  auth,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("destination.country").notEmpty().withMessage("Country is required"),
    body("destination.city").notEmpty().withMessage("City is required"),
    body("startDate").isISO8601().withMessage("Valid start date is required"),
    body("endDate").isISO8601().withMessage("Valid end date is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const tripData = {
        ...req.body,
        createdBy: req.user.id,
      };

      const trip = new Trip(tripData);
      await trip.save();

      // Update user's travel stats
      await User.findByIdAndUpdate(req.user.id, {
        $inc: { "travelStats.totalTrips": 1 },
        $addToSet: { "travelStats.countriesVisited": trip.destination.country },
      });

      res.status(201).json(trip);
    } catch (error) {
      console.error("Create trip error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   PUT /api/trips/:id
// @desc    Update trip
// @access  Private
router.put("/:id", auth, async (req, res) => {
  try {
    const trip = await Trip.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.json(trip);
  } catch (error) {
    console.error("Update trip error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   DELETE /api/trips/:id
// @desc    Delete trip
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const trip = await Trip.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // Delete associated itineraries
    await Itinerary.deleteMany({ tripId: req.params.id });

    res.json({ message: "Trip deleted successfully" });
  } catch (error) {
    console.error("Delete trip error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/trips/:id/itineraries
// @desc    Get trip itineraries
// @access  Private
router.get("/:id/itineraries", auth, async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    const itineraries = await Itinerary.find({ tripId: req.params.id }).sort({
      day: 1,
    });

    res.json(itineraries);
  } catch (error) {
    console.error("Get itineraries error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/trips/stats/summary
// @desc    Get user's travel statistics
// @access  Private
router.get("/stats/summary", auth, async (req, res) => {
  try {
    const stats = await Trip.aggregate([
      { $match: { createdBy: req.user.id } },
      {
        $group: {
          _id: null,
          totalTrips: { $sum: 1 },
          completedTrips: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
          totalDays: {
            $sum: {
              $divide: [
                { $subtract: ["$endDate", "$startDate"] },
                1000 * 60 * 60 * 24,
              ],
            },
          },
          totalBudget: { $sum: "$budget.total" },
          countriesVisited: { $addToSet: "$destination.country" },
        },
      },
    ]);

    const result = stats[0] || {
      totalTrips: 0,
      completedTrips: 0,
      totalDays: 0,
      totalBudget: 0,
      countriesVisited: [],
    };

    res.json(result);
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// --- PACKING LIST ROUTES ---

// @route   POST /api/trips/:id/packing-list
// @desc    Add a packing list item to a trip
// @access  Private
router.post(
  "/:id/packing-list",
  auth,
  [body("item").notEmpty().withMessage("Item name is required")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const trip = await Trip.findOne({
        _id: req.params.id,
        createdBy: req.user.id,
      });

      if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
      }

      const newItem = {
        item: req.body.item,
        packed: false,
      };

      trip.packingList.push(newItem);
      await trip.save();

      res.status(201).json(trip.packingList[trip.packingList.length - 1]);
    } catch (error) {
      console.error("Add packing item error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   PUT /api/trips/:id/packing-list/:itemId
// @desc    Update a packing list item (e.g., toggle packed)
// @access  Private
router.put(
  "/:id/packing-list/:itemId",
  auth,
  [body("packed").isBoolean().withMessage("Packed status must be a boolean")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const trip = await Trip.findOne({
        _id: req.params.id,
        createdBy: req.user.id,
      });

      if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
      }

      const item = trip.packingList.id(req.params.itemId);
      if (!item) {
        return res.status(404).json({ message: "Packing item not found" });
      }

      item.packed = req.body.packed;
      await trip.save();
      res.json(item);
    } catch (error) {
      console.error("Update packing item error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   DELETE /api/trips/:id/packing-list/:itemId
// @desc    Delete a packing list item
// @access  Private
router.delete("/:id/packing-list/:itemId", auth, async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    const item = trip.packingList.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: "Packing item not found" });
    }

    trip.packingList.pull(req.params.itemId);
    await trip.save();

    res.json({ message: "Item removed" });
  } catch (error) {
    console.error("Delete packing item error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;