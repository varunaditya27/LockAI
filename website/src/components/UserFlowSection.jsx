import React from "react";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import "./UserFlowSection.css";

const userFlowRows = [
  { action: "Touch 1 sensor", outcome: "Access granted 2" },
  { action: "Touch 2 sensors", outcome: "Access denied 2c" },
  { action: "Tap Blynk switch (V0)", outcome: "Remote unlock 2" },
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
