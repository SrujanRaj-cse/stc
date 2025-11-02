import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Divider,
} from "@mui/material";
import axios from "axios";

interface WeatherDay {
  date: string;
  tempMax: number;
  tempMin: number;
  code: number;
}

interface WeatherData {
  weather: {
    temperature_2m_max: number[];
    weathercode: number[];
  };
  timezone: {
    timezone: string;
    utc_offset_seconds: number;
  };
}

interface WeatherWidgetProps {
  city: string;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ city }) => {
  const [data, setData] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<WeatherDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [localTime, setLocalTime] = useState<string>("");

  const getWeatherIcon = (code: number) => {
    if (code >= 200 && code < 300) return "⛈";
    if (code >= 300 && code < 600) return "🌧";
    if (code >= 600 && code < 700) return "❄";
    if (code >= 700 && code < 800) return "🌫";
    if (code === 800) return "☀";
    if (code > 800) return "☁";
    return "🌈";
  };

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get(`/api/weather?city=${city}`);
        setData(res.data);

        const days: WeatherDay[] = res.data.weather.temperature_2m_max
          .slice(0, 5)
          .map((max: number, i: number) => ({
            date: new Date(Date.now() + i * 86400000).toLocaleDateString(),
            tempMax: max,
            tempMin: max - 4,
            code: res.data.weather.weathercode[i] || 800,
          }));
        setForecast(days);
      } catch (err: any) {
        console.error("Weather API Error:", err.message);
        setError("Failed to fetch weather data");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city]);

  useEffect(() => {
    if (!data?.timezone.utc_offset_seconds) return;

    const updateLocalTime = () => {
      const utc = new Date();
      const local = new Date(
        utc.getTime() + data.timezone.utc_offset_seconds * 1000
      );
      setLocalTime(local.toLocaleTimeString());
    };

    updateLocalTime();
    const timer = setInterval(updateLocalTime, 1000);
    return () => clearInterval(timer);
  }, [data]);

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100px"
      >
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Alert severity="error" sx={{ width: "100%" }}>
        {error}
      </Alert>
    );

  if (!data)
    return (
      <Alert severity="warning" sx={{ width: "100%" }}>
        No weather data available.
      </Alert>
    );

  const avgTempMax =
    data.weather.temperature_2m_max.length > 0
      ? (
          data.weather.temperature_2m_max.reduce((a, b) => a + b, 0) /
          data.weather.temperature_2m_max.length
        ).toFixed(1)
      : "N/A";

  const mainCode = data.weather.weathercode[0] || 800;
  const icon = getWeatherIcon(mainCode);

  const offsetHours = data.timezone.utc_offset_seconds / 3600;
  const offsetSign = offsetHours >= 0 ? "+" : "-";
  const offsetStr = `${offsetSign}${Math.abs(offsetHours)
    .toFixed(0)
    .padStart(2, "0")}:00`;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Weather in {city}
      </Typography>

      {/* TODAY’S WEATHER */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ background: "#f9f9f9", p: 2, borderRadius: 2 }}
      >
        <Box>
          <Typography>Average Max Temperature: {avgTempMax}°C</Typography>
          <Typography>Timezone Offset: UTC{offsetStr}</Typography>
          <Typography>Current Local Time: {localTime}</Typography>
        </Box>

        <Box textAlign="center" sx={{ mr: 3 }}>
          <Typography sx={{ fontSize: "60px", textAlign: "center" }}>
            {icon}
          </Typography>
          <Typography variant="body2">Today’s Weather</Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* NEXT 5 DAYS FORECAST */}
      <Typography variant="subtitle1" gutterBottom>
        Next 5 Days Forecast
      </Typography>

      <Box
        display="grid"
        gridTemplateColumns="repeat(auto-fill, minmax(120px, 1fr))"
        gap={2}
      >
        {forecast.map((day, i) => (
          <Box
            key={i}
            sx={{
              p: 1.5,
              textAlign: "center",
              borderRadius: 2,
              backgroundColor: "#f3f4f6",
              boxShadow: 1,
            }}
          >
            <Typography variant="body2">{day.date}</Typography>
            <Typography sx={{ fontSize: "32px", my: 1 }}>
              {getWeatherIcon(day.code)}
            </Typography>
            <Typography variant="body2">
              {day.tempMax.toFixed(1)}°C / {day.tempMin.toFixed(1)}°C
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default WeatherWidget;
