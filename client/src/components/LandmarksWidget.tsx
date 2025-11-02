import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Chip,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";

// Interface for the landmark data we expect from our API
interface Landmark {
  _id: string;
  name: string;
  description: string;
  category: string;
  imageUrl: string | null;
}

// Props for the component
interface LandmarkWidgetProps {
  city: string;
}

const LandmarksWidget: React.FC<LandmarkWidgetProps> = ({ city }) => {
  const [landmarks, setLandmarks] = useState<Landmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLandmarks = async () => {
      if (!city) return;

      setLoading(true);
      setError("");
      try {
        // Call our new backend /api/landmarks route
        const response = await axios.get<Landmark[]>("/api/landmarks", {
          params: { city },
        });
        setLandmarks(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Could not fetch landmarks.");
      } finally {
        setLoading(false);
      }
    };

    fetchLandmarks();
    // This effect runs only when the city prop changes
  }, [city]);

  if (loading) {
    return (
      <Box display="flex" alignItems="center" gap={2}>
        <CircularProgress size={20} />
        <Typography variant="body2" color="text.secondary">
          Loading landmarks...
        </Typography>
      </Box>
    );
  }

  if (error) {
    // We'll show a warning instead of a hard error
    return <Alert severity="warning">{error}</Alert>;
  }

  if (landmarks.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No landmarks found for {city}.
      </Typography>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Landmarks in {city}
      </Typography>
      <Box
        display="flex"
        gap={2}
        overflow="auto"
        pb={1}
        sx={{
          "&::-webkit-scrollbar": { height: 8 },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#e0e0e0",
            borderRadius: 4,
          },
        }}
      >
        {landmarks.map((landmark) => (
          <Card
            key={landmark._id}
            elevation={2}
            sx={{ minWidth: 280, flexShrink: 0 }}
          >
            {landmark.imageUrl && (
              <CardMedia
                component="img"
                height="140"
                image={landmark.imageUrl}
                alt={landmark.name}
              />
            )}
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="subtitle1" fontWeight="bold" noWrap>
                  {landmark.name}
                </Typography>
                <Chip
                  label={landmark.category}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ textTransform: "capitalize" }}
                />
              </Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1, height: 60, overflow: "hidden" }}
              >
                {landmark.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default LandmarksWidget;
