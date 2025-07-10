import React from "react";
import { Box, Typography, Stack, Avatar, Link, Tooltip } from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { blue, pink, green, orange } from "@mui/material/colors";
import "./ContributorsSection.css";

const contributors = [
  {
    name: "Varun Aditya",
    img: "/src/assets/varun.jpg",
    color: blue[700],
    desc: "Project lead, firmware, and system integration.",
    linkedin: "https://www.linkedin.com/in/varunaditya27/"
  },
  {
    name: "Shreyas Kamat",
    img: "/src/assets/shreyas.jpg",
    color: green[700],
    desc: "Touch sensor logic, hardware wiring, and testing.",
    linkedin: "https://www.linkedin.com/in/shreyas-nayan-kamat/"
  },
  {
    name: "Abhijay MS",
    img: "/src/assets/abhijay.jpg",
    color: pink[500],
    desc: "Blynk integration, UI/UX, and documentation.",
    linkedin: "https://www.linkedin.com/in/abhijay-ms/"
  },
  {
    name: "Vaibhav VS",
    img: "/src/assets/vaibhav.jpg",
    color: orange[700],
    desc: "Servo control, LED feedback, and code optimization.",
    linkedin: "https://www.linkedin.com/in/vaibhav-vs/"
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
            <Avatar
              src={c.img}
              alt={c.name}
              className="contributor-avatar"
              sx={{ bgcolor: c.color }}
            />
            <Typography variant="h6" className="contributor-name" style={{ color: '#eaf6fb' }}>{c.name}</Typography>
            <Typography variant="body2" className="contributor-desc" style={{ color: '#b0c4d4' }}>{c.desc}</Typography>
            <Tooltip title="LinkedIn">
              <Link href={c.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`LinkedIn profile of ${c.name}`} className="contributor-linkedin">
                <LinkedInIcon sx={{ fontSize: 32 }} />
              </Link>
            </Tooltip>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
