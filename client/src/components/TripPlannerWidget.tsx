import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Button, // <--- ADDED THIS IMPORT
} from "@mui/material";
import { Schedule, LocationOn } from "@mui/icons-material";

// Interfaces for the itinerary data
interface Activity {
  time: string;
  description: string;
  category: string;
}

interface DayPlan {
  day: string; // e.g., "Day 1"
  city: string;
  activities: Activity[];
}

interface TripPlannerWidgetProps {
  city: string;
  startDate: string;
  endDate: string;
}

const TripPlannerWidget: React.FC<TripPlannerWidgetProps> = ({
  city,
  startDate,
  endDate,
}) => {
  const [itinerary, setItinerary] = useState<DayPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentDay, setCurrentDay] = useState<number>(1); // currentDay is defined here

  useEffect(() => {
    const fetchItinerary = async () => {
      if (!city || !startDate || !endDate) return;

      setLoading(true);
      setError("");
      try {
        const response = await axios.get<{ itinerary: DayPlan[] }>(
          "/api/planner",
          {
            params: { city, startDate, endDate },
          }
        );
        setItinerary(response.data.itinerary);
      } catch (err: any) {
        setError(
          err.response?.data?.message || "Could not generate itinerary."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchItinerary();
  }, [city, startDate, endDate]);

  if (loading) {
    return (
      <Box display="flex" alignItems="center" gap={2}>
        <CircularProgress size={20} />
        <Typography variant="body2" color="text.secondary">
          Generating personalized itinerary...
        </Typography>
      </Box>
    );
  }
  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }
  if (itinerary.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        Cannot generate itinerary. Please add more landmarks for {city}.
      </Typography>
    );
  }

  const todayPlan = itinerary.find((p) => p.day === `Day ${currentDay}`);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Mini Trip Planner
      </Typography>

      {/* Day Selector Tabs/Buttons */}
      <Box sx={{ display: "flex", gap: 1, overflowX: "auto", pb: 1 }}>
        {itinerary.map((plan, index) => (
          <Button // <-- This component is now imported
            key={plan.day}
            variant={currentDay === index + 1 ? "contained" : "outlined"}
            onClick={() => setCurrentDay(index + 1)}
            size="small"
            sx={{ flexShrink: 0 }}
          >
            {plan.day}
          </Button>
        ))}
      </Box>

      {/* Daily Itinerary List */}
      {todayPlan && (
        <List sx={{ mt: 2 }} disablePadding>
          {todayPlan.activities.map((activity, index) => (
            <React.Fragment key={index}>
              <ListItem sx={{ alignItems: "flex-start" }}>
                <LocationOn sx={{ mt: 0.5, mr: 1, color: "primary.main" }} />
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {activity.description}
                      </Typography>
                      <Chip
                        label={activity.category}
                        size="small"
                        variant="outlined"
                        sx={{ textTransform: "capitalize" }}
                      />
                    </Box>
                  }
                  secondary={
                    <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
                      <Schedule fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {activity.time}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              {index < todayPlan.activities.length - 1 && (
                <Divider component="li" />
              )}
            </React.Fragment>
          ))}
        </List>
      )}
      {!todayPlan && (
        <Alert severity="info" sx={{ mt: 2 }}>
          No activities planned for this day.
        </Alert>
      )}
    </Box>
  );
};

export default TripPlannerWidget;
