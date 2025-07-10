import React from "react";
import { Box, Typography, Avatar } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { blue } from "@mui/material/colors";
import "./HeroSection.css";

export default function HeroSection({ id = "hero" }) {
  return (
    <Box id={id} className="hero-section section">
      <Avatar className="hero-avatar" style={{ backgroundColor: blue[700] }}>
        <LockIcon style={{ fontSize: 60, color: "white" }} />
      </Avatar>
      <Typography variant="h2" className="hero-title" color="primary" gutterBottom align="center">
        LockAI
      </Typography>
      <Typography variant="h5" className="hero-subtitle" color="text.secondary" align="center">
        Smart Touch-Based Door Lock System
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" align="center">
        ESP32 + Servo Motor + Blynk + TTP223 Touch Sensors
      </Typography>
      <Typography variant="body1" className="hero-desc" align="center">
        LockAI is an intelligent, touch-activated door lock system that brings together edge computing, Wi-Fi connectivity, and remote control. Users can unlock doors through physical touch sensors or remotely via the Blynk mobile app.
      </Typography>
    </Box>
  );
}
