import React from "react";
import { Box, Typography, Stack, Avatar, Divider } from "@mui/material";
import HardwareIcon from "@mui/icons-material/Hardware";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import MemoryIcon from "@mui/icons-material/Memory";
import WifiIcon from "@mui/icons-material/Wifi";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import { blue, green, orange, deepPurple, yellow } from "@mui/material/colors";
import "./HardwareSection.css";

export default function HardwareSection({ id = "hardware" }) {
  return (
    <Box id={id} className="hardware-section-outer section">
      <Typography variant="h4" fontWeight={700} color="primary" gutterBottom align="center">
        Hardware Architecture
      </Typography>
      <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 2 }}>
        The LockAI hardware integrates an ESP32-WROOM-32 microcontroller, three TTP223 capacitive touch sensors for knock pattern input, high-brightness LEDs for feedback, and an SG90 servo motor for lock actuation. The modular design ensures reliable, real-time sensor processing and TinyML inference, with robust power management and breadboard-based prototyping for rapid development and testing.
      </Typography>
      <Stack direction="row" className="hardware-grid">
        <Box className="hardware-item">
          <Avatar className="hardware-avatar" sx={{ bgcolor: blue[700] }}><HardwareIcon /></Avatar>
          <Typography className="hardware-label">ESP32-WROOM-32</Typography>
        </Box>
        <Box className="hardware-item">
          <Avatar className="hardware-avatar" sx={{ bgcolor: orange[600] }}><MemoryIcon /></Avatar>
          <Typography className="hardware-label">SG90 Servo Motor</Typography>
        </Box>
        <Box className="hardware-item">
          <Avatar className="hardware-avatar" sx={{ bgcolor: green[600] }}><TouchAppIcon /></Avatar>
          <Typography className="hardware-label">TTP223 Touch Sensors (x3)</Typography>
        </Box>
        <Box className="hardware-item">
          <Avatar className="hardware-avatar" sx={{ bgcolor: yellow[700] }}><LightbulbIcon /></Avatar>
          <Typography className="hardware-label">LED Indicators</Typography>
        </Box>
        <Box className="hardware-item">
          <Avatar className="hardware-avatar" sx={{ bgcolor: deepPurple[400] }}><WifiIcon /></Avatar>
          <Typography className="hardware-label">Wi-Fi Connectivity</Typography>
        </Box>
      </Stack>
      <Divider sx={{ mt: 4, maxWidth: 320, mx: "auto" }} />
      <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
        The hardware is optimized for low-latency, energy-efficient operation, supporting real-time authentication and robust feedback in diverse environments.
      </Typography>
    </Box>
  );
}
