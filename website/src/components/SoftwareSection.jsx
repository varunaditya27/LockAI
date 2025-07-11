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
        Software Architecture
      </Typography>
      <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 2 }}>
        The LockAI software implements a multi-layered architecture: sensor management, feature extraction, TinyML inference (Edge Impulse + TensorFlow Lite), and system control. Real-time, interrupt-driven detection and robust state machines ensure reliable knock pattern recognition and feedback. The modular codebase supports future enhancements and on-device learning.
      </Typography>
      <Stack direction="row" className="software-grid">
        <Box className="software-item">
          <Avatar className="software-avatar" sx={{ bgcolor: blue[700] }}>
            <CodeIcon />
          </Avatar>
          <Typography className="software-label">TinyML (Edge Impulse, TFLite)</Typography>
        </Box>
        <Box className="software-item">
          <Avatar className="software-avatar" sx={{ bgcolor: green[600] }}>
            <BuildIcon />
          </Avatar>
          <Typography className="software-label">Real-time C++/Arduino</Typography>
        </Box>
      </Stack>
      <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
        The system is designed for sub-50ms authentication, robust error handling, and extensibility for future IoT and security features.
      </Typography>
    </Box>
  );
}
