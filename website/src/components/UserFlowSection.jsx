import React from "react";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import "./UserFlowSection.css";

const userFlowRows = [
  { action: "Touch sensors in your unique knock pattern", outcome: "System authenticates using TinyML and unlocks if authorized (Green LED, Servo unlock)" },
  { action: "Incorrect or unauthorized pattern", outcome: "Access denied (Red LED, Servo remains locked)" },
  { action: "Remote unlock via Blynk app", outcome: "Immediate unlock, with feedback and auto-lock after timeout" },
];

export default function UserFlowSection({ id = "userflow" }) {
  return (
    <Box id={id} className="userflow-section-outer section">
      <Typography variant="h4" fontWeight={700} color="primary" gutterBottom align="center">
        User Interaction Flow
      </Typography>
      <TableContainer className="userflow-table">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: 700, color: '#eaf6fb', background: 'none' }}>Action</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700, color: '#eaf6fb', background: 'none' }}>Outcome</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userFlowRows.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell align="center" sx={{ color: '#eaf6fb', background: 'none' }}>{row.action}</TableCell>
                <TableCell align="center" sx={{ color: '#eaf6fb', background: 'none' }}>{row.outcome}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
