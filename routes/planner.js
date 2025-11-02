import express from "express";
import Landmark from "../models/Landmark.js";

const router = express.Router();

// Helper function to calculate days between two YYYY-MM-DD dates
const calculateDays = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1; // Include both start and end days
};

// @route   GET /api/planner
// @desc    Generate a rule-based itinerary for a trip
// @access  Public
router.get("/", async (req, res) => {
  const { city, startDate, endDate } = req.query;

  if (!city || !startDate || !endDate) {
    return res
      .status(400)
      .json({ message: "Missing required query parameters" });
  }

  try {
    const totalDays = calculateDays(startDate, endDate);
    const cityLower = city.toLowerCase();

    const availableLandmarks = await Landmark.find({ city: cityLower }).lean();

    if (!availableLandmarks.length) {
      return res.json({
        itinerary: [],
        message: "No landmarks to plan activities.",
      });
    }

    const itinerary = [];
    let landmarkIndex = 0;

    for (let day = 1; day <= totalDays; day++) {
      if (landmarkIndex >= availableLandmarks.length) {
        landmarkIndex = 0;
      }

      const landmark = availableLandmarks[landmarkIndex];

      let timeSlot = "Free Time";
      if (day % 3 === 1) timeSlot = "Morning (9:00 AM)";
      else if (day % 3 === 2) timeSlot = "Afternoon (1:00 PM)";
      else timeSlot = "Evening (5:00 PM)";

      itinerary.push({
        day: `Day ${day}`,
        city: city,
        activities: [
          {
            time: timeSlot,
            description: landmark.name,
            category: landmark.category,
          },
        ],
      });

      landmarkIndex++;
    }

    res.json({ itinerary, message: "Itinerary successfully generated." });
  } catch (error) {
    console.error("Planner route error:", error.message);
    res.status(500).json({ message: "Server error generating itinerary" });
  }
});

export default router;