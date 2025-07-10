import React, { useState, useEffect, useRef } from "react";
import { Box, List, ListItem, ListItemIcon, ListItemText, IconButton, Drawer, Tooltip } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import MemoryIcon from "@mui/icons-material/Memory";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import CodeIcon from "@mui/icons-material/Code";
import TimelineIcon from "@mui/icons-material/Timeline";
import BuildIcon from "@mui/icons-material/Build";
import GroupIcon from "@mui/icons-material/Group";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import MenuIcon from "@mui/icons-material/Menu";
import './Sidebar.css';

const sections = [
  { id: "hero", label: "Home", icon: <LockIcon /> },
  { id: "hardware", label: "Hardware", icon: <MemoryIcon /> },
  { id: "remote", label: "Remote", icon: <PhoneIphoneIcon /> },
  { id: "smartbehavior", label: "Behavior", icon: <EmojiObjectsIcon /> },
  { id: "features", label: "Features", icon: <BuildIcon /> },
  { id: "software", label: "Software", icon: <CodeIcon /> },
  { id: "userflow", label: "User Flow", icon: <TimelineIcon /> },
  { id: "workflow", label: "Workflow", icon: <RocketLaunchIcon /> },
  { id: "blynk", label: "Blynk", icon: <PhoneIphoneIcon /> },
  { id: "future", label: "Future", icon: <EmojiObjectsIcon /> },
  { id: "contributors", label: "Contributors", icon: <GroupIcon /> },
];

export default function Sidebar() {
  const [active, setActive] = useState("hero");
  const [mobileOpen, setMobileOpen] = useState(false);
  const listRef = useRef();

  useEffect(() => {
    const handleScroll = () => {
      let found = "hero";
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) found = section.id;
        }
      }
      setActive(found);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNav = (id) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  // Calculate indicator position
  // const activeIdx = sections.findIndex(s => s.id === active);
  // const indicatorTop = 8 + activeIdx * 52; // 8px top margin + 52px per item (item height + margin)

  return (
    <>
      <Box className="sidebar-root">
        <Box className="sidebar-logo" onClick={() => handleNav("hero")}>LockAI</Box>
        <div className="sidebar-list" ref={listRef} style={{ position: 'relative' }}>
          {/* Removed sidebar-indicator */}
          {sections.map((section) => (
            <Tooltip title={section.label} placement="right" key={section.id} arrow>
              <ListItem
                button
                className={`sidebar-item${active === section.id ? " active" : ""}`}
                onClick={() => handleNav(section.id)}
                aria-label={section.label}
              >
                <ListItemIcon className="sidebar-icon">{section.icon}</ListItemIcon>
                <ListItemText primary={section.label} className="sidebar-label" />
              </ListItem>
            </Tooltip>
          ))}
        </div>
      </Box>
      <IconButton className="sidebar-mobile-btn" onClick={() => setMobileOpen(true)} aria-label="Open navigation">
        <MenuIcon />
      </IconButton>
      <Drawer anchor="left" open={mobileOpen} onClose={() => setMobileOpen(false)} className="sidebar-mobile-drawer">
        <Box className="sidebar-root sidebar-mobile">
          <Box className="sidebar-logo" onClick={() => handleNav("hero")}>LockAI</Box>
          <List className="sidebar-list">
            {sections.map((section) => (
              <Tooltip title={section.label} placement="right" key={section.id} arrow>
                <ListItem
                  button
                  className={`sidebar-item${active === section.id ? " active" : ""}`}
                  onClick={() => handleNav(section.id)}
                  aria-label={section.label}
                >
                  <ListItemIcon className="sidebar-icon">{section.icon}</ListItemIcon>
                  <ListItemText primary={section.label} className="sidebar-label" />
                </ListItem>
              </Tooltip>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
} 