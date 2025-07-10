import React from "react";
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";
import "./FutureSection.css";

const future = [
  "Replace manual touches with knock detection via onboard ML",
  "Add access logs via Firebase or SD card",
  "Support for biometric or NFC unlock",
  "OTA firmware updates"
];

export default function FutureSection({ id = "future" }) {
  return (
    <Box id={id} className="future-section-outer section">
      <Typography variant="h4" fontWeight={700} color="primary" gutterBottom align="center">
        Future Improvements
      </Typography>
      <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 2 }}>
        Planned upgrades to make LockAI even smarter and more secure.
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
