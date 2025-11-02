import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import axios from "../services/api";

export default function Profile() {
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    preferences: {
      currency: user?.preferences?.currency || "USD",
      language: user?.preferences?.language || "en",
      notifications: {
        email: user?.preferences?.notifications?.email || true,
        push: user?.preferences?.notifications?.push || true,
      },
    },
  });

  const handleSave = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await axios.put("/api/auth/profile", profileData);
      setMessage("Profile updated successfully!");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Box p={4}>
        <Alert severity="error">User not found</Alert>
      </Box>
    );
  }

  return (
    <Box p={4} display="flex" flexDirection="column" gap={4}>
      <Typography variant="h4" gutterBottom>
        Profile Settings
      </Typography>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Personal Information
          </Typography>
          <Box display="flex" flexDirection="column" gap={2} mt={2}>
            <TextField
              label="Full Name"
              value={profileData.name}
              onChange={(e) =>
                setProfileData((prev) => ({ ...prev, name: e.target.value }))
              }
              fullWidth
            />
            <TextField
              label="Email Address"
              type="email"
              value={profileData.email}
              onChange={(e) =>
                setProfileData((prev) => ({ ...prev, email: e.target.value }))
              }
              fullWidth
            />
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Preferences
          </Typography>
          <Box display="flex" flexDirection="column" gap={2} mt={2}>
            <TextField
              label="Currency"
              value={profileData.preferences.currency}
              onChange={(e) =>
                setProfileData((prev) => ({
                  ...prev,
                  preferences: {
                    ...prev.preferences,
                    currency: e.target.value,
                  },
                }))
              }
              fullWidth
            />
            <TextField
              label="Language"
              value={profileData.preferences.language}
              onChange={(e) =>
                setProfileData((prev) => ({
                  ...prev,
                  preferences: {
                    ...prev.preferences,
                    language: e.target.value,
                  },
                }))
              }
              fullWidth
            />
          </Box>
        </CardContent>
      </Card>

      <Box display="flex" justifyContent="flex-end">
        <Button variant="contained" onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </Box>

      {message && <Alert severity="success">{message}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}
    </Box>
  );
}
