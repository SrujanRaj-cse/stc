import express from "express";
import axios from "axios";

const router = express.Router();

// ✅ Get keys from environment variables
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const OPENCAGE_API_KEY = process.env.OPENCAGE_API_KEY;

// 🔹 Helper to process hourly OpenWeatherMap data into daily summary (remains unchanged)
const transformOwmToDaily = (list, startDate) => {
  const dailyData = {};
  const dates = [];

  list.forEach((item) => {
    const date = item.dt_txt.substring(0, 10);
    if (!dailyData[date]) {
      dailyData[date] = {
        max: -Infinity,
        min: Infinity,
        weathercode: 0,
        count: 0,
      };
      dates.push(date);
    }
    dailyData[date].max = Math.max(dailyData[date].max, item.main.temp_max);
    dailyData[date].min = Math.min(dailyData[date].min, item.main.temp_min);
    if (item.dt_txt.includes("12:00:00") || dailyData[date].count === 0) {
      dailyData[date].weathercode = item.weather[0].id === 800 ? 0 : 2;
    }
    dailyData[date].count++;
  });

  const times = [];
  const maxTemps = [];
  const minTemps = [];
  const weatherCodes = [];

  dates
    .filter((d) => d >= startDate)
    .forEach((date) => {
      times.push(date);
      maxTemps.push(dailyData[date].max);
      minTemps.push(dailyData[date].min);
      weatherCodes.push(dailyData[date].weathercode);
    });

  return {
    time: times,
    temperature_2m_max: maxTemps,
    temperature_2m_min: minTemps,
    weathercode: weatherCodes,
  };
};

// 🧭 GET /api/weather
router.get("/", async (req, res) => {
  const { city, startDate, endDate } = req.query;
  // Fallback to the known timezone for your destination (Tokyo)
  const defaultTimezone = "Asia/Tokyo";

  // ✅ 1. Validate all required parameters and API keys immediately
  if (
    !city ||
    !startDate ||
    !endDate ||
    !OPENWEATHER_API_KEY ||
    !OPENCAGE_API_KEY
  ) {
    console.error("Missing API Keys or Query Params! Check .env file.");
    return res.status(400).json({
      message:
        "Missing required query parameters or API Keys (OpenWeather/OpenCage).",
    });
  }

  try {
    // --- 1️⃣ Geocode the city (Core Step) ---
    const geoResponse = await axios.get(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
        city
      )}&limit=1&appid=${OPENWEATHER_API_KEY}`
    );

    const location = geoResponse.data?.[0];
    if (!location) {
      return res.status(404).json({ message: `City "${city}" not found.` });
    }

    const { lat, lon, name } = location;

    // --- 2️⃣ Fetch the 5-day forecast (Core Step) ---
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );

    // --- 3️⃣ Transform data into daily summary ---
    const dailyWeather = transformOwmToDaily(
      weatherResponse.data.list,
      startDate
    );

    // --- 4️⃣ Lookup timezone name using OpenCage (Non-Core Step) ---
    let timezoneName = defaultTimezone;
    try {
      const timezoneLookupResponse = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${OPENCAGE_API_KEY}&no_annotations=1`
      );

      timezoneName =
        timezoneLookupResponse.data.results?.[0]?.annotations?.timezone?.name ||
        defaultTimezone;
    } catch (opencageError) {
      // Log the error. This is usually where the failure occurs (bad OpenCage key)
      console.error(
        "OpenCage API error (Falling back to default timezone):",
        opencageError.message
      );
    }

    // --- 5️⃣ Get timezone details (Non-Core Step) ---
    let timezoneDetails = null;
    try {
      // Use the obtained or default timezone name
      const timezoneDetailsResponse = await axios.get(
        `https://worldtimeapi.org/api/timezone/${timezoneName}`
      );
      timezoneDetails = timezoneDetailsResponse.data;
    } catch (worldtimeError) {
      // Log the error. timezoneDetails remains null, which causes "Destination time unavailable."
      console.error(
        "WorldTime API error (Sending null to frontend):",
        worldtimeError.message
      );
    }

    // --- 6️⃣ Send combined response ---
    res.json({
      city: name,
      weather: dailyWeather,
      // If the API failed, timezone will be null, which the frontend handles.
      timezone: timezoneDetails,
    });
  } catch (error) {
    // Catch critical failures (Geocoding/Weather failed)
    console.error(
      "Critical API request error (Geocoding/Weather):",
      error.message
    );
    res.status(500).json({
      message:
        "Server error fetching core weather or geocoding data. Check OpenWeather API key.",
    });
  }
});

export default router;
