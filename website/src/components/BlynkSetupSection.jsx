import React from "react";
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";
import "./BlynkSetupSection.css";

export default function BlynkSetupSection({ id = "blynk" }) {
  return (
    <Box id={id} className="blynk-section-outer section">
      <Typography variant="h4" fontWeight={700} color="primary" gutterBottom align="center">
        Blynk Mobile Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 2 }}>
        The Blynk app provides a user-friendly interface for remote unlocking, monitoring, and feedback. Set up a Switch widget (Virtual Pin V0) to control the lock, and view real-time status updates and logs.
      </Typography>
      <List className="blynk-list">
        <ListItem>
          <ListItemText
            primary={<span style={{ color: '#eaf6fb' }}>Add a Switch widget (V0) in Blynk</span>}
            secondary={<span style={{ color: '#b0c4d4' }}>Label it 'Remote Unlock' and monitor access logs in the app</span>}
          />
        </ListItem>
      </List>
    </Box>
  );
}
