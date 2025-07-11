import React from "react";
import { Box, Typography, Stack, IconButton, Tooltip } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EmailIcon from "@mui/icons-material/Email";
import "./Footer.css";

export default function Footer() {
  return (
    <Box className="footer-section-outer">
      <Box className="footer-glass">
        <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" className="footer-brand">
          <LockIcon className="footer-logo-glow" fontSize="large" />
          <Typography variant="h6" className="footer-title">LockAI</Typography>
        </Stack>
        <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" className="footer-socials">
          <Tooltip title="GitHub">
            <IconButton href="https://github.com/varunaditya27" target="_blank" rel="noopener" className="footer-social-btn" aria-label="GitHub"><GitHubIcon /></IconButton>
          </Tooltip>
          <Tooltip title="LinkedIn">
            <IconButton href="https://www.linkedin.com/in/varunaditya27/" target="_blank" rel="noopener" className="footer-social-btn" aria-label="LinkedIn"><LinkedInIcon /></IconButton>
          </Tooltip>
          <Tooltip title="Contact">
            <IconButton href="mailto:varunaditya27@gmail.com" className="footer-social-btn" aria-label="Email"><EmailIcon /></IconButton>
          </Tooltip>
        </Stack>
        <Typography variant="caption" className="footer-caption">
          Project report: "An AI and IoT-Driven Knock-and-Touch Access System for Secure Smart Environments"<br/>
          RV College of Engineering, 2024 &nbsp;|&nbsp; Educational & non-commercial use only &nbsp;|&nbsp; &copy; 2024 LockAI Team
        </Typography>
      </Box>
    </Box>
  );
}
