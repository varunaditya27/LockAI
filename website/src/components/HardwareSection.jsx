import React from "react";
import { Box, Typography, Stack, Avatar, Divider } from "@mui/material";
import HardwareIcon from "@mui/icons-material/Hardware";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import MemoryIcon from "@mui/icons-material/Memory";
import WifiIcon from "@mui/icons-material/Wifi";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import { blue, green, orange, deepPurple, yellow } from "@mui/material/colors";
import "./HardwareSection.css";

const hardware = [
  { label: "ESP32 Dev Board", icon: <HardwareIcon />, color: blue[700] },
  { label: "SG90 Servo Motor", icon: <MemoryIcon />, color: orange[600] },
  { label: "TTP223 Touch Sensors (x3)", icon: <TouchAppIcon />, color: green[600] },
  { label: "LED Indicators", icon: <LightbulbIcon />, color: yellow[700] },
  { label: "Wi-Fi", icon: <WifiIcon />, color: deepPurple[400] },
];

export default function HardwareSection({ id = "hardware" }) {
  return (
    <Box id={id} className="hardware-section-outer section">
      <Typography variant="h4" fontWeight={700} color="primary" gutterBottom align="center">
        Hardware Components
      </Typography>
      <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 2 }}>
        The LockAI system brings together robust hardware for reliability and smart control.
      </Typography>
      <Stack direction="row" className="hardware-grid">
        {hardware.map((item, idx) => (
          <Box key={idx} className="hardware-item">
            <Avatar className="hardware-avatar" sx={{ bgcolor: item.color }}>{item.icon}</Avatar>
            <Typography className="hardware-label">{item.label}</Typography>
          </Box>
        ))}
      </Stack>
      <Divider sx={{ mt: 4, maxWidth: 320, mx: "auto" }} />
    </Box>
  );
}
