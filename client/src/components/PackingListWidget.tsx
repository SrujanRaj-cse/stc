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
  ListItemIcon,
  Checkbox,
  Button,
} from "@mui/material";
import { CloudDownload } from "@mui/icons-material";

// --- PDF LIBRARY IMPORTS ---
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
// ---------------------------

interface Item {
  name: string;
  category: string;
  required: boolean;
  packed: boolean; // Add state for packing
}

interface PackingListWidgetProps {
  city: string;
  country: string;
  avgTempMax: number;
  isRainy: boolean;
}

const PackingListWidget: React.FC<PackingListWidgetProps> = ({
  city,
  country,
  avgTempMax,
  isRainy,
}) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // --- NEW: Ref for the content area to capture ---
  const printRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchChecklist = async () => {
      if (!city || !avgTempMax) return;

      setLoading(true);
      setError("");
      try {
        const response = await axios.get<Item[]>("/api/checklist", {
          params: {
            city,
            country,
            avgTempMax,
            isRainy: isRainy ? "true" : "false",
          },
        });

        const listItems = response.data.map((item) => ({
          ...item,
          packed: false,
        }));
        setItems(listItems);
      } catch (err: any) {
        setError(
          err.response?.data?.message || "Could not generate packing list."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchChecklist();
  }, [city, country, avgTempMax, isRainy]);

  // Handle user checking an item
  const handleToggle = (name: string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.name === name ? { ...item, packed: !item.packed } : item
      )
    );
  };

  // --- PDF Export Function (SRS REQ_03) ---
  const handleExportPDF = async () => {
    if (!printRef.current) return;

    // Temporarily hide the Export button so it doesn't appear in the PDF screenshot
    const exportButton = document.getElementById("export-button");
    if (exportButton) exportButton.style.display = "none";

    try {
      const canvas = await html2canvas(printRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      // Standard A4 dimensions in mm: 210 x 297
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`PackingList_${city}.pdf`);

      alert(`Exported Packing List for ${city}!`);
    } catch (e) {
      console.error("PDF Export failed:", e);
      alert(
        "Failed to generate PDF. Check if jsPDF and html2canvas are installed."
      );
    } finally {
      // Show the button again
      if (exportButton) exportButton.style.display = "flex";
    }
  };
  // ------------------------------------------

  if (loading) {
    return (
      <Box display="flex" alignItems="center" gap={2}>
        <CircularProgress size={20} />
        <Typography sx={{ ml: 2 }}>Generating Checklist...</Typography>
      </Box>
    );
  }
  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  // Group items by category (Clothing, Essentials, etc.)
  const groupedItems = items.reduce((acc, item) => {
    (acc[item.category] = acc[item.category] || []).push(item);
    return acc;
  }, {} as Record<string, Item[]>);

  return (
    // Attach the ref to the root Box to define the printable area
    <Box ref={printRef}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Packing Checklist</Typography>
        <Button
          id="export-button" // ID used to hide the button during capture
          variant="contained"
          size="small"
          startIcon={<CloudDownload />}
          onClick={handleExportPDF} // The handler is attached here
        >
          Export PDF
        </Button>
      </Box>

      {items.length === 0 && (
        <Alert severity="info" sx={{ mt: 1 }}>
          Returning basic list. Template not found for these conditions.
        </Alert>
      )}

      {Object.entries(groupedItems).map(([category, list]) => (
        <Box key={category} mt={2}>
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            sx={{ textTransform: "capitalize" }}
          >
            {category}
          </Typography>
          <List dense>
            {list.map((item) => (
              <ListItem
                key={item.name}
                onClick={() => handleToggle(item.name)}
                sx={{ cursor: "pointer", py: 0 }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Checkbox
                    edge="start"
                    checked={item.packed}
                    tabIndex={-1}
                    disableRipple
                  />
                </ListItemIcon>
                <ListItemText
                  primary={item.name}
                  secondary={item.required ? "Required" : "Optional"}
                  sx={{ textDecoration: item.packed ? "line-through" : "none" }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      ))}
    </Box>
  );
};

export default PackingListWidget;
