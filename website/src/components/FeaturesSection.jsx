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
  { label: "Dual-factor knock & touch authentication", icon: <LockIcon />, color: blue[700] },
  { label: "TinyML-powered anomaly detection", icon: <BuildIcon />, color: deepPurple[400] },
  { label: "Real-time feedback: LEDs & servo", icon: <LightbulbIcon />, color: orange[600] },
  { label: "IoT-enabled: Wi-Fi, Blynk, Firebase", icon: <WifiIcon />, color: green[600] },
  { label: "Modular, extensible, and low-cost", icon: <CloudDoneIcon />, color: blue[400] },
];

export default function FeaturesSection({ id = "features" }) {
  return (
    <Box id={id} className="features-section-outer section">
      <Typography variant="h4" fontWeight={700} color="primary" gutterBottom align="center">
        Key Features & Objectives
      </Typography>
      <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 2 }}>
        LockAI delivers robust, real-time, and user-friendly security through advanced behavioral biometrics, embedded AI, and seamless IoT integration.
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
