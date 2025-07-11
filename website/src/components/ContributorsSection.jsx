import React from "react";
import { Box, Typography, Stack, Avatar } from "@mui/material";
import { blue, green, pink, orange } from "@mui/material/colors";
import "./ContributorsSection.css";

const contributors = [
  {
    name: "Abhijay M S",
    color: blue[700],
    desc: "System design, data collection, and documentation."
  },
  {
    name: "Shreyas Nayan Kamat",
    color: green[700],
    desc: "Touch sensor logic, hardware integration, and testing."
  },
  {
    name: "Vaibhav V. S.",
    color: pink[500],
    desc: "Servo control, feedback mechanisms, and code optimization."
  },
  {
    name: "Varun Aditya",
    color: orange[700],
    desc: "Firmware, system integration, and project coordination."
  }
];

export default function ContributorsSection({ id = "contributors" }) {
  return (
    <Box id={id} className="contributors-section-outer section">
      <Typography variant="h4" fontWeight={700} color="primary" gutterBottom align="center">
        Contributors
      </Typography>
      <Stack direction="row" className="contributors-grid">
        {contributors.map((c, idx) => (
          <Box key={idx} className="contributor-item">
            <Avatar className="contributor-avatar" sx={{ bgcolor: c.color }}>
              {c.name.split(' ').map(n => n[0]).join('')}
            </Avatar>
            <Typography variant="h6" className="contributor-name" style={{ color: '#eaf6fb' }}>{c.name}</Typography>
            <Typography variant="body2" className="contributor-desc" style={{ color: '#b0c4d4' }}>{c.desc}</Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
