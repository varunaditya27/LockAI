import React from "react";
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";
import "./BlynkSetupSection.css";

export default function BlynkSetupSection({ id = "blynk" }) {
  return (
    <Box id={id} className="blynk-section-outer section">
      <Typography variant="h4" fontWeight={700} color="primary" gutterBottom align="center">
        Blynk Dashboard Setup
      </Typography>
      <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 2 }}>
        Set up your Blynk app for remote unlocking in just a few steps.
      </Typography>
      <List className="blynk-list">
        <ListItem>
          <ListItemText
            primary={<span style={{ color: '#eaf6fb' }}>Add a Switch widget in your Blynk app</span>}
            secondary={<span style={{ color: '#b0c4d4' }}>Set it to Virtual Pin V0, mode to Switch, and label it 'Remote Unlock'</span>}
          />
        </ListItem>
      </List>
    </Box>
  );
}
