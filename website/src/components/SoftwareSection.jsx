import React from "react";
import { Box, Typography, Stack, Avatar } from "@mui/material";
import CodeIcon from "@mui/icons-material/Code";
import BuildIcon from "@mui/icons-material/Build";
import { blue, green } from "@mui/material/colors";
import "./SoftwareSection.css";

export default function SoftwareSection({ id = "software" }) {
  return (
    <Box id={id} className="software-section-outer section">
      <Typography variant="h4" fontWeight={700} color="primary" gutterBottom align="center">
        Software & Libraries
      </Typography>
      <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 2 }}>
        Developed in clean and modular C++ code, using robust libraries for connectivity and control.
      </Typography>
      <Stack direction="row" className="software-grid">
        <Box className="software-item">
          <Avatar className="software-avatar" sx={{ bgcolor: blue[700] }}>
            <CodeIcon />
          </Avatar>
          <Typography className="software-label">Arduino IDE</Typography>
        </Box>
        <Box className="software-item">
          <Avatar className="software-avatar" sx={{ bgcolor: green[600] }}>
            <BuildIcon />
          </Avatar>
          <Typography className="software-label">WiFi.h, ESP32Servo.h, BlynkSimpleEsp32.h</Typography>
        </Box>
      </Stack>
    </Box>
  );
}
