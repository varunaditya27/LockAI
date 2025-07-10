import React from "react";
import { Box, Typography, Stack, Avatar } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import WifiIcon from "@mui/icons-material/Wifi";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import BuildIcon from "@mui/icons-material/Build";
import CloudDoneIcon from "@mui/icons-material/CloudDone";
import { blue, green, orange, deepPurple } from "@mui/material/colors";
import "./FeaturesSection.css";

const features = [
  { label: "Physical + Remote Door Control", icon: <LockIcon />, color: blue[700] },
  { label: "Wi-Fi Enabled (Blynk-based)", icon: <WifiIcon />, color: green[600] },
  { label: "Clear Visual Feedback with LEDs", icon: <LightbulbIcon />, color: orange[600] },
  { label: "Debounce Protection", icon: <BuildIcon />, color: deepPurple[400] },
  { label: "Easily Extendable", icon: <CloudDoneIcon />, color: blue[400] },
];

export default function FeaturesSection({ id = "features" }) {
  return (
    <Box id={id} className="features-section-outer section">
      <Typography variant="h4" fontWeight={700} color="primary" gutterBottom align="center">
        Key Features
      </Typography>
      <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 2 }}>
        LockAI offers a robust set of features for security, convenience, and extensibility.
      </Typography>
      <Stack direction="row" className="features-grid">
        {features.map((item, idx) => (
          <Box key={idx} className="feature-item">
            <Avatar className="feature-avatar" sx={{ bgcolor: item.color }}>{item.icon}</Avatar>
            <Typography className="feature-label">{item.label}</Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
