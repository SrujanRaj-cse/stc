import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { useTrip } from "../contexts/TripContext";
import { Trip } from "../types/trip"; // Import the Trip type

// Dashboard component - no props needed, uses context
const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { trips, fetchTrips, loading } = useTrip();
  const [stats, setStats] = useState({
    totalTrips: 0,
    completedTrips: 0,
    totalDays: 0,
    totalBudget: 0,
    countriesVisited: [] as string[],
  });

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  useEffect(() => {
    // Calculate stats from trips
    const calculatedStats = trips.reduce(
      (acc: any, trip: Trip) => {
        // Added Trip type here
        acc.totalTrips += 1;
        if (trip.status === "completed") {
          acc.completedTrips += 1;
        }
        const startDate = new Date(trip.startDate);
        const endDate = new Date(trip.endDate);
        const days = Math.ceil(
          (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        acc.totalDays += days;
        acc.totalBudget += trip.budget.total;
        if (!acc.countriesVisited.includes(trip.destination.country)) {
          acc.countriesVisited.push(trip.destination.country);
        }
        return acc;
      },
      {
        totalTrips: 0,
        completedTrips: 0,
        totalDays: 0,
        totalBudget: 0,
        countriesVisited: [] as string[],
      }
    );
    setStats(calculatedStats);
  }, [trips]);

  if (loading) {
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
  }

  return (
    <Box p={4} display="flex" flexDirection="column" gap={4}>
      <Typography variant="h4" gutterBottom>
        Welcome back, {user?.name}!
      </Typography>

      {/* Stats Cards */}
      <Box display="flex" flexWrap="wrap" gap={3}>
        <Card sx={{ flex: "1 1 200px" }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Trips
            </Typography>
            <Typography variant="h4">{stats.totalTrips}</Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: "1 1 200px" }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Countries Visited
            </Typography>
            <Typography variant="h4">
              {stats.countriesVisited.length}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: "1 1 200px" }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Days Traveled
            </Typography>
            <Typography variant="h4">{stats.totalDays}</Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: "1 1 200px" }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Budget
            </Typography>
            <Typography variant="h4">
              ${stats.totalBudget.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Recent Trips */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Trips
          </Typography>
          {trips.length === 0 ? (
            <Alert severity="info">
              No trips yet. Create your first trip to get started!
            </Alert>
          ) : (
            <Box display="flex" flexDirection="column" gap={2}>
              {trips.slice(0, 3).map(
                (
                  trip: Trip // Added Trip type here
                ) => (
                  <Box
                    key={trip._id}
                    p={2}
                    border="1px solid #e0e0e0"
                    borderRadius={1}
                  >
                    <Typography variant="h6">{trip.name}</Typography>
                    <Typography color="text.secondary">
                      {trip.destination.city}, {trip.destination.country}
                    </Typography>
                    <Typography variant="body2">
                      {new Date(trip.startDate).toLocaleDateString()} -{" "}
                      {new Date(trip.endDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                )
              )}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;
