import express from "express";
import axios from "axios";

const router = express.Router();

// GET /api/weather?city=Tokyo
router.get("/", async (req, res) => {
  try {
    const { city } = req.query;
    if (!city) return res.status(400).json({ error: "City required" });

    const apiKey = process.env.WEATHER_API_KEY;
    console.log("🌦 Fetching weather for:", city);
    console.log("✅ Using API key:", apiKey?.slice(0, 6) + "...");

    // Step 1: Geocoding
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
      city
    )}&limit=1&appid=${apiKey}`;

    const geoResponse = await axios.get(geoUrl);
    const geoData = geoResponse.data;
    if (!geoData || geoData.length === 0)
      return res.status(404).json({ error: "City not found" });

    const { lat, lon } = geoData[0];

    // Step 2: Forecast (free tier)
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const forecastResponse = await axios.get(forecastUrl);
    const forecastData = forecastResponse.data;

    if (!forecastData.list) {
      return res.status(500).json({ error: "Weather data unavailable" });
    }

    // Step 3: Group by date → max temp/day
    const grouped = {};
    forecastData.list.forEach((item) => {
      const day = item.dt_txt.split(" ")[0];
      if (!grouped[day]) grouped[day] = [];
      grouped[day].push(item.main.temp);
    });

    const temperature_2m_max = Object.values(grouped).map((temps) =>
      Math.max(...temps)
    );
    const weathercode = forecastData.list.map((item) => item.weather[0].id);

    // Get icon + description from first entry
    const firstWeather = forecastData.list[0].weather[0];
    const weatherIcon = `https://openweathermap.org/img/wn/${firstWeather.icon}@2x.png`;
    const weatherDesc = firstWeather.description;

    // Step 4: Send formatted response
    res.json({
      weather: {
        temperature_2m_max,
        weathercode,
        icon: weatherIcon,
        description: weatherDesc,
      },
      timezone: {
        name: forecastData.city.name,
        country: forecastData.city.country,
        utc_offset_seconds: forecastData.city.timezone,
      },
    });
  } catch (err) {
    console.error("Weather API Error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;