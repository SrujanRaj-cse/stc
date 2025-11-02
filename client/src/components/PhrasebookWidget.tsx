import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Tabs,
  Tab,
} from "@mui/material";
import { VolumeUp } from "@mui/icons-material";

// Interface for a single phrase
interface Phrase {
  _id: string;
  category: string;
  originalText: string;
  translation: string;
  notes?: string;
}

// Props for the component
interface PhrasebookWidgetProps {
  language: string; // e.g., "japanese"
}

// Helper to play audio
const playAudio = (url: string) => {
  new Audio(url).play();
};

// Helper to group phrases by category
const groupByCategory = (phrases: Phrase[]) => {
  return phrases.reduce((acc, phrase) => {
    (acc[phrase.category] = acc[phrase.category] || []).push(phrase);
    return acc;
  }, {} as Record<string, Phrase[]>);
};

const PhrasebookWidget: React.FC<PhrasebookWidgetProps> = ({ language }) => {
  const [phrases, setPhrases] = useState<Record<string, Phrase[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [currentTab, setCurrentTab] = useState(0);

  useEffect(() => {
    const fetchPhrases = async () => {
      if (!language) return;
      setLoading(true);
      setError("");
      try {
        const response = await axios.get<Phrase[]>("/api/phrases", {
          params: { language },
        });

        const grouped = groupByCategory(response.data);
        const categoryKeys = Object.keys(grouped);

        setPhrases(grouped);
        setCategories(categoryKeys);
        setCurrentTab(0); // Reset to first tab
      } catch (err: any) {
        setError(err.response?.data?.message || "Could not fetch phrases.");
      } finally {
        setLoading(false);
      }
    };
    fetchPhrases();
  }, [language]);

  if (loading) {
    return (
      <Box display="flex" alignItems="center" gap={2}>
        <CircularProgress size={20} />
        <Typography variant="body2" color="text.secondary">
          Loading phrasebook...
        </Typography>
      </Box>
    );
  }
  if (error) {
    return <Alert severity="warning">{error}</Alert>;
  }
  if (categories.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No phrases found for this language.
      </Typography>
    );
  }

  const currentCategory = categories[currentTab];
  const currentPhrases = phrases[currentCategory];

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Smart Local Phrasebook
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs
          value={currentTab}
          onChange={(e, newValue) => setCurrentTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {categories.map((category) => (
            <Tab
              label={category}
              key={category}
              sx={{ textTransform: "capitalize" }}
            />
          ))}
        </Tabs>
      </Box>

      <List disablePadding>
        {currentPhrases.map((phrase, index) => (
          <React.Fragment key={phrase._id}>
            <ListItem>
              <ListItemText
                primary={phrase.originalText}
                secondary={phrase.translation}
              />
            </ListItem>
            {index < currentPhrases.length - 1 && <Divider component="li" />}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default PhrasebookWidget;
