import React from "react";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper as MuiPaper } from "@mui/material";
import "./SmartBehaviorSection.css";

const behaviorRows = [
  { action: "Touch 1 sensor", outcome: "Access granted ✅ (Door unlocks, Green LED)" },
  { action: "Touch ≥2 sensors", outcome: "Access denied ❌ (Red LED, Door remains locked)" },
  { action: "Tap Blynk switch (V0)", outcome: "Remote unlock ✅ (Auto-locks after 3s)" },
];

export default function SmartBehaviorSection({ id = "smartbehavior" }) {
  return (
    <Box id={id} className="smart-behavior-section-outer section">
      <Typography variant="h4" fontWeight={700} color="primary" gutterBottom align="center">
        Smart Behavior
      </Typography>
      <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
        The system responds to touch and remote commands with clear, intuitive feedback.
      </Typography>
      <TableContainer component={MuiPaper} className="smart-behavior-table" elevation={0}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: 700 }}>Action</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>Outcome</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {behaviorRows.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell align="center">{row.action}</TableCell>
                <TableCell align="center">{row.outcome}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
