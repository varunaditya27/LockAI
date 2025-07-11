import React from "react";
import { Box, Typography, Stack, Avatar } from "@mui/material";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import CloudDoneIcon from "@mui/icons-material/CloudDone";
import SwitchIcon from "@mui/icons-material/ToggleOn";
import { blue, green } from "@mui/material/colors";
import "./RemoteControlSection.css";

export default function RemoteControlSection({ id = "remote" }) {
  return (
    <Box id={id} className="remote-section-outer section">
      <Typography variant="h4" fontWeight={700} color="primary" gutterBottom align="center">
        IoT & Remote Control
      </Typography>
      <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 2 }}>
        LockAI supports remote unlocking and monitoring via the Blynk mobile app, leveraging real-time Wi-Fi connectivity. All access attempts are logged to Firebase, and users receive immediate feedback through both the app and onboard LEDs. This integration enables secure, convenient, and extensible control from anywhere.
      </Typography>
      <Stack direction="row" className="remote-icons">
        <Box className="remote-icon-item">
          <Avatar className="remote-avatar" sx={{ bgcolor: blue[700] }}>
            <PhoneIphoneIcon />
          </Avatar>
          <Typography className="remote-label">Blynk App</Typography>
        </Box>
        <Box className="remote-icon-item">
          <Avatar className="remote-avatar" sx={{ bgcolor: green[600] }}>
            <CloudDoneIcon />
          </Avatar>
          <Typography className="remote-label">Firebase Logging</Typography>
        </Box>
        <Box className="remote-icon-item">
          <Avatar className="remote-avatar" sx={{ bgcolor: blue[400] }}>
            <SwitchIcon />
          </Avatar>
          <Typography className="remote-label">Remote Unlock</Typography>
        </Box>
      </Stack>
      <Typography variant="body1" className="remote-desc">
        The system is designed for extensibility, supporting future integration with additional IoT platforms and advanced remote management features.
      </Typography>
    </Box>
  );
}
