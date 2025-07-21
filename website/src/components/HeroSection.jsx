import React from "react";
import { Box, Typography, Avatar } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { blue } from "@mui/material/colors";
import "./HeroSection.css";

export default function HeroSection({ id = "hero" }) {
  return (
    <Box id={id} className="hero-section section">
      <Typography variant="h2" className="hero-title" color="primary" gutterBottom align="center">
        LockAI: AI & IoT-Driven Knock-and-Touch Access System
      </Typography>
      <Typography variant="h5" className="hero-subtitle" color="text.secondary" align="center">
        Intelligent, Dual-Factor Physical Security for Smart Environments
      </Typography>
      <Typography variant="body1" className="hero-desc" align="center" sx={{ mt: 2 }}>
        LockAI is a compact, intelligent access control system that enhances physical security using a dual-factor verification system based on knock patterns and finger count. It leverages embedded AI (TinyML) on an ESP32 microcontroller to identify valid touch sequences across three capacitive sensors. Real-time connectivity, logging to Firebase, and mobile visualization via Blynk make LockAI a customizable, low-cost, IoT-enabled smart locking solution for lockers, drawers, and personal security systems.
      </Typography>
    </Box>
  );
}
