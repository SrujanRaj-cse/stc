import React, { useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Trip } from "../types/trip"; // Import the Trip type
import { useTrip } from "../contexts/TripContext";

// TripList component - uses context instead of props
const TripList: React.FC = () => {
  const navigate = useNavigate();
  const { trips, fetchTrips, loading } = useTrip();

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  return (
    <Box p={4} display="flex" flexDirection="column" gap={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" gutterBottom>
          My Trips
        </Typography>
        <Button variant="contained" onClick={() => navigate("/create-trip")}>
          New Trip
        </Button>
      </Box>

      {loading ? (
        <Alert severity="info">Loading trips...</Alert>
      ) : trips.length === 0 ? (
        <Alert severity="info">
          No trips yet. Create your first trip to get started!
        </Alert>
      ) : (
        <Box display="flex" flexWrap="wrap" gap={3}>
          {trips.map((trip: Trip) => (
              <Card
                key={trip._id}
                sx={{ flex: "1 1 300px", cursor: "pointer" }}
                onClick={() => navigate(`/trips/${trip._id}`)}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {trip.name}
                  </Typography>
                  <Typography color="text.secondary" gutterBottom>
                    {trip.destination.city}, {trip.destination.country}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {new Date(trip.startDate).toLocaleDateString()} -{" "}
                    {new Date(trip.endDate).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="primary">
                    ${trip.budget.total} • {trip.status}
                  </Typography>
                </CardContent>
              </Card>
            )
          )}
        </Box>
      )}
    </Box>
  );
};

export default TripList;
