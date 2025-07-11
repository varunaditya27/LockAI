import React from "react";
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";
import "./FutureSection.css";

const future = [
  "Transition to PCB for reliability and commercial viability",
  "Integrate additional sensors (e.g., accelerometers, pressure sensors)",
  "Implement advanced power management for longer battery life",
  "Develop ruggedized enclosures for harsh environments",
  "Add tamper detection and secure element chips",
  "Enable multi-user support and continual learning",
  "Integrate explainable AI and advanced attack detection",
  "Support over-the-air model updates and remote configuration",
  "Develop mobile apps for user management and monitoring",
  "Implement advanced cryptographic techniques for privacy"
];

export default function FutureSection({ id = "future" }) {
  return (
    <Box id={id} className="future-section-outer section">
      <Typography variant="h4" fontWeight={700} color="primary" gutterBottom align="center">
        Future Work & Enhancements
      </Typography>
      <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 2 }}>
        Planned improvements to advance LockAI's security, usability, and scalability.
      </Typography>
      <List className="future-list">
        {future.map((item, idx) => (
          <ListItem key={idx}>
            <ListItemText primary={item} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
