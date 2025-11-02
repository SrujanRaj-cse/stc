import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Alert,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useNavigate } from "react-router-dom";
import { useTrip } from "../contexts/TripContext";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";

export default function CreateTrip() {
  const navigate = useNavigate();
  const { createTrip } = useTrip();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    destination: {
      country: "",
      city: "",
    },
    startDate: dayjs(),
    endDate: dayjs().add(7, "day"),
    budget: {
      total: 0,
      currency: "USD",
      spent: 0,
    },
    travelers: [] as Array<{ name: string; email: string; role: string }>,
    status: "planning" as
      | "planning"
      | "upcoming"
      | "ongoing"
      | "completed"
      | "cancelled",
    tags: [] as string[],
    notes: "",
  });

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const tripData = {
        ...formData,
        startDate: formData.startDate.toISOString(),
        endDate: formData.endDate.toISOString(),
      };

      const newTrip = await createTrip(tripData);
      navigate(`/trips/${newTrip._id}`);
    } catch (err: any) {
      setError(err.message || "Failed to create trip");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box p={4}>
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Create New Trip
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box display="flex" flexDirection="column" gap={2}>
              <TextField
                label="Trip Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                fullWidth
                required
              />

              <TextField
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                fullWidth
              />

              <Box display="flex" gap={2}>
                <TextField
                  label="City"
                  value={formData.destination.city}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      destination: {
                        ...prev.destination,
                        city: e.target.value,
                      },
                    }))
                  }
                  sx={{ flex: 1 }}
                  required
                />
                <TextField
                  label="Country"
                  value={formData.destination.country}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      destination: {
                        ...prev.destination,
                        country: e.target.value,
                      },
                    }))
                  }
                  sx={{ flex: 1 }}
                  required
                />
              </Box>

              <Box display="flex" gap={2}>
                <DatePicker
                  label="Start Date"
                  value={formData.startDate}
                  onChange={(newValue: Dayjs | null) =>
                    newValue &&
                    setFormData((prev) => ({ ...prev, startDate: newValue }))
                  }
                  slotProps={{ textField: { fullWidth: true } }}
                />
                <DatePicker
                  label="End Date"
                  value={formData.endDate}
                  onChange={(newValue: Dayjs | null) =>
                    newValue &&
                    setFormData((prev) => ({ ...prev, endDate: newValue }))
                  }
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Box>

              <TextField
                label="Budget"
                type="number"
                value={formData.budget.total}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    budget: {
                      ...prev.budget,
                      total: parseFloat(e.target.value) || 0,
                    },
                  }))
                }
                fullWidth
              />

              <TextField
                label="Notes"
                multiline
                rows={3}
                value={formData.notes}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, notes: e.target.value }))
                }
                fullWidth
              />

              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={
                  loading ||
                  !formData.name ||
                  !formData.destination.city ||
                  !formData.destination.country
                }
                fullWidth
              >
                {loading ? "Creating..." : "Create Trip"}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </LocalizationProvider>
  );
}
