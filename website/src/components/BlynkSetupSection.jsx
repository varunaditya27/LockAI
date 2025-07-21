import React from "react";
import { Box, Typography } from "@mui/material";
import "./BlynkSetupSection.css";

export default function BlynkSetupSection({ id = "blynk" }) {
  return (
    <Box id={id} className="blynk-section-outer section">
      <Typography variant="h4" fontWeight={700} color="primary" gutterBottom align="center">
        Blynk Mobile Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 2 }}>
        The Blynk app provides a simple dashboard for remote control and monitoring of your LockAI device. The dashboard includes:
      </Typography>
      <ul style={{ color: '#fff', fontSize: '1.08rem', maxWidth: 500, margin: '0 auto 2rem auto', paddingLeft: 24 }}>
        <li>Door Control (lock/unlock switch)</li>
        <li>Auto-Lock Timer (enable/disable switch)</li>
        <li>System Status (shows lock state and WiFi status)</li>
      </ul>
      <Typography variant="body2" color="text.secondary" align="center">
        For detailed setup instructions and advanced features, please refer to the GitHub repository.
      </Typography>
    </Box>
  );
}
