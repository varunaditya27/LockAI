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
        Remote Control via Blynk
      </Typography>
      <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 2 }}>
        Unlock your door from anywhere using the Blynk app. Real-time feedback is provided in the app and via onboard LEDs.
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
          <Typography className="remote-label">Cloud Control</Typography>
        </Box>
        <Box className="remote-icon-item">
          <Avatar className="remote-avatar" sx={{ bgcolor: blue[400] }}>
            <SwitchIcon />
          </Avatar>
          <Typography className="remote-label">Virtual Pin V0</Typography>
        </Box>
      </Stack>
      <Typography variant="body1" className="remote-desc">
        Just add a Switch widget in your Blynk app, set it to Virtual Pin V0, and label it "Remote Unlock".
      </Typography>
    </Box>
  );
}
