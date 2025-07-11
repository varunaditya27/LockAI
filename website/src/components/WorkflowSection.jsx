import React from "react";
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";
import "./WorkflowSection.css";

const workflow = [
  {
    step: "Sensor Input",
    desc: "User initiates a knock sequence by touching the three capacitive sensors in a specific temporal and spatial pattern. The system records precise timestamps for each activation."
  },
  {
    step: "Feature Extraction",
    desc: "Algorithms analyze the knock sequence to generate a six-dimensional feature vector (temporal gaps and spatial masks). Features are normalized for consistent analysis."
  },
  {
    step: "TinyML Inference",
    desc: "The feature vector is processed by a neural network (TinyML) deployed on the ESP32, generating an anomaly score to classify the pattern as authorized or unauthorized."
  },
  {
    step: "Output Control",
    desc: "Based on the result, the system triggers the green LED and unlocks the servo (access granted) or the red LED (access denied). All attempts are logged for analysis."
  }
];

export default function WorkflowSection({ id = "workflow" }) {
  return (
    <Box id={id} className="workflow-section-outer section">
      <Typography variant="h4" fontWeight={700} color="primary" gutterBottom align="center">
        System Workflow & Working Principle
      </Typography>
      <List className="workflow-list">
        {workflow.map((item, idx) => (
          <ListItem key={idx} alignItems="flex-start">
            <ListItemText
              primary={<span style={{ color: '#eaf6fb', fontWeight: 600 }}>{item.step}</span>}
              secondary={<span style={{ color: '#b0c4d4' }}>{item.desc}</span>}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
