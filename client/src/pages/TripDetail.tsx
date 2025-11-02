// src/pages/TripDetail.tsx
import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useTrip } from "../contexts/TripContext";

import WeatherWidget from "../components/WeatherWidget";
import LandmarksWidget from "../components/LandmarksWidget";
import PhrasebookWidget from "../components/PhrasebookWidget";
import TripPlannerWidget from "../components/TripPlannerWidget";
import PackingListWidget from "../components/PackingListWidget";
import { Trip } from "../types/trip";

const calculateDays = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
};

const TripDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentTrip, fetchTrip, loading } = useTrip();

  const [avgTempMax, setAvgTempMax] = useState<number>(0);
  const [isRainy, setIsRainy] = useState<boolean>(false);

  useEffect(() => {
    if (id) fetchTrip(id);
  }, [id, fetchTrip]);

  // language selection for phrasebook
  const languageMap: { [key: string]: string } = {
    japan: "japanese",
    france: "french",
    italy: "italian",
    india: "hindi",
    usa: "english",
    uk: "english",
    australia: "english",
    egypt: "arabic",
    brazil: "portuguese",
    china: "chinese",
  };

  const tripLanguage =
    languageMap[currentTrip?.destination.country.toLowerCase() || ""] ||
    "english";

  // Fetch weather separately for packing calculation
  useEffect(() => {
    const fetchWeather = async () => {
      if (!currentTrip) return;
      try {
        const axios = (await import("../services/api")).default;
        const res = await axios.get(`/api/weather?city=${currentTrip.destination.city}`);
        const data = res.data;
        if (data.weather) {
          const temps = data.weather.temperature_2m_max || [];
          const codes = data.weather.weathercode || [];

          const avg =
            temps.length > 0
              ? temps.reduce((a: number, b: number) => a + b, 0) / temps.length
              : 0;
          setAvgTempMax(Math.round(avg));

          const rainy = codes.some(
            (code: number) =>
              (code >= 51 && code <= 65) ||
              (code >= 80 && code <= 82) ||
              code >= 95
          );
          setIsRainy(rainy);
        }
      } catch (err) {
        console.error("Failed to fetch weather for packing list", err);
      }
    };

    fetchWeather();
  }, [currentTrip]);

  if (loading || !currentTrip)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <CircularProgress />
      </Box>
    );

  if (!id)
    return (
      <Box p={4}>
        <Alert severity="error">Invalid Trip ID</Alert>
        <Button onClick={() => navigate("/trips")} sx={{ mt: 2 }}>
          Back to Trips
        </Button>
      </Box>
    );

  return (
    <Box p={4} display="flex" flexDirection="column" gap={4}>
      {/* HEADER */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Box>
          <Typography variant="h4">{currentTrip.name}</Typography>
          <Typography color="text.secondary">
            {currentTrip.description}
          </Typography>
          <Typography color="primary">Status: {currentTrip.status}</Typography>
        </Box>
        <Button variant="outlined" onClick={() => navigate("/trips")}>
          Back to Trips
        </Button>
      </Box>

      {/* WEATHER */}
      <Card>
        <CardContent>
          <WeatherWidget city={currentTrip.destination.city} />
        </CardContent>
      </Card>

      {/* PACKING LIST */}
      <Card>
        <CardContent>
          <PackingListWidget
            city={currentTrip.destination.city}
            country={currentTrip.destination.country}
            avgTempMax={avgTempMax}
            isRainy={isRainy}
          />
        </CardContent>
      </Card>

      {/* ITINERARY */}
      <Card>
        <CardContent>
          <TripPlannerWidget
            city={currentTrip.destination.city}
            startDate={currentTrip.startDate}
            endDate={currentTrip.endDate}
          />
        </CardContent>
      </Card>

      {/* PHRASEBOOK */}
      <Card>
        <CardContent>
          <PhrasebookWidget language={tripLanguage} />
        </CardContent>
      </Card>

      {/* LANDMARKS */}
      <Card>
        <CardContent>
          <LandmarksWidget city={currentTrip.destination.city} />
        </CardContent>
      </Card>
    </Box>
  );
};

export default TripDetail;
