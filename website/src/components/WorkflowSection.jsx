import React from "react";
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";
import "./WorkflowSection.css";

export default function WorkflowSection({ id = "workflow" }) {
  return (
    <Box id={id} className="workflow-section-outer section">
      <Typography variant="h4" fontWeight={700} color="primary" gutterBottom align="center">
        Functional Workflow
      </Typography>
      <List className="workflow-list">
        <ListItem>
          <ListItemText
            primary={<span style={{ color: '#eaf6fb' }}>setup()</span>}
            secondary={<span style={{ color: '#b0c4d4' }}>Initializes Wi-Fi, Blynk, Servo, LEDs, and Touch inputs</span>}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={<span style={{ color: '#eaf6fb' }}>loop()</span>}
            secondary={<span style={{ color: '#b0c4d4' }}>Monitors touch input, runs Blynk background process, checks and responds to sensor conditions</span>}
          />
        </ListItem>
      </List>
    </Box>
  );
}
