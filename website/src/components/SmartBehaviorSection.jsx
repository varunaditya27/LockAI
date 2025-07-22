import React from "react";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper as MuiPaper } from "@mui/material";
import "./SmartBehaviorSection.css";

const behaviorRows = [
  { action: "Authorized knock pattern (timing + spatial)", outcome: "Access granted (Green LED, Servo unlock, log entry)" },
  { action: "Unauthorized or incorrect pattern", outcome: "Access denied (Red LED, lock remains, log entry)" },
  { action: "Remote unlock via Blynk", outcome: "Immediate unlock, auto-lock after timeout, feedback via app and LEDs" },
];

export default function SmartBehaviorSection({ id = "smartbehavior" }) {
  return (
    <Box id={id} className="smart-behavior-section-outer section">
      <Typography variant="h5" fontWeight={700} color="primary" gutterBottom align="center">
        AI-Driven Smart Behavior
      </Typography>
      <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 2 }}>
        LockAI uses embedded AI to distinguish between authorized and unauthorized knock patterns, providing instant, multi-modal feedback and robust security against replay and timing attacks.
      </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: 700, color: '#eaf6fb', background: '#2c5364' }}>Action</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700, color: '#eaf6fb', background: '#2c5364' }}>Outcome</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {behaviorRows.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell align="center" sx={{ fontWeight: 700, color: '#eaf6fb', background: '#2c5364' }}>{row.action}</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: '#eaf6fb', background: '#2c5364' }}>{row.outcome}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
    </Box>
  );
}
