import React, { useEffect, useState } from "react";
import { Box, Typography, Stack, Switch, Paper, CircularProgress } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import WifiIcon from "@mui/icons-material/Wifi";
import { green, red } from "@mui/material/colors";
import "./RemoteAccessSection.css";

const BLYNK_BASE_URL = "https://blynk.cloud/external/api";
const BLYNK_TOKEN = "vtd8JpWgEHlCEZ8kZod_MGJE3HN1wjIr";

function fetchBlynkStatus() {
  return Promise.all([
    fetch(`${BLYNK_BASE_URL}/get?token=${BLYNK_TOKEN}&V0`).then(r => r.json()),
    fetch(`${BLYNK_BASE_URL}/get?token=${BLYNK_TOKEN}&V1`).then(r => r.json()),
    fetch(`${BLYNK_BASE_URL}/get?token=${BLYNK_TOKEN}&V2`).then(r => r.json()),
  ]).then(([lock, autolock, status]) => ({
    lock: Array.isArray(lock) ? lock[0] : lock,
    autolock: Array.isArray(autolock) ? autolock[0] : autolock,
    status: Array.isArray(status) ? status[0] : status,
  }));
}

function setBlynkValue(pin, value) {
  return fetch(`${BLYNK_BASE_URL}/update?token=${BLYNK_TOKEN}&${pin}=${value}`);
}

export default function RemoteAccessSection({ id = "remoteaccess" }) {
  const [loading, setLoading] = useState(true);
  const [lock, setLock] = useState(null); // 0 = locked, 1 = unlocked
  const [autolock, setAutolock] = useState(null); // 0 = off, 1 = on
  const [status, setStatus] = useState("");
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    let active = true;
    function poll() {
      fetchBlynkStatus()
        .then(({ lock, autolock, status }) => {
          if (!active) return;
          setLock(Number(lock));
          setAutolock(Number(autolock));
          setStatus(status);
          setLoading(false);
        })
        .catch(e => {
          if (!active) return;
          setError("Unable to fetch live status. Please check your connection.");
          setLoading(false);
        });
    }
    poll();
    const interval = setInterval(poll, 3000);
    return () => { active = false; clearInterval(interval); };
  }, []);

  const handleLockToggle = async (e) => {
    setActionLoading(true);
    try {
      await setBlynkValue("V0", e.target.checked ? 1 : 0);
      setLock(e.target.checked ? 1 : 0);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAutolockToggle = async (e) => {
    setActionLoading(true);
    try {
      await setBlynkValue("V1", e.target.checked ? 1 : 0);
      setAutolock(e.target.checked ? 1 : 0);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Box id={id} className="remote-access-section section" sx={{ mb: 4, maxWidth: 420, mx: "auto" }}>
      <Typography variant="h4" fontWeight={700} align="center" sx={{ mb: 2 }}>
        LockAI Node <span style={{ fontSize: 18, verticalAlign: 'middle' }}>•</span>
      </Typography>
      <Paper elevation={3} sx={{ p: 3, mb: 2, background: "rgba(30,50,70,0.92)" }}>
        {loading ? (
          <Stack alignItems="center" spacing={2}>
            <CircularProgress color="info" />
            <Typography color="text.secondary">Loading live status...</Typography>
          </Stack>
        ) : error ? (
          <Typography color="error" align="center">{error}</Typography>
        ) : (
          <>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
              <Box sx={{ textAlign: 'center', flex: 1 }}>
                <Typography variant="subtitle1" sx={{ mb: 1, color: '#fff' }}>Door Control</Typography>
                <Switch
                  checked={lock === 1}
                  onChange={handleLockToggle}
                  color="default"
                  disabled={actionLoading}
                  sx={{
                    '& .MuiSwitch-thumb': {
                      backgroundColor: lock === 1 ? green[500] : red[500],
                    },
                    '& .Mui-checked .MuiSwitch-thumb': {
                      backgroundColor: green[500],
                    },
                    '& .MuiSwitch-track': {
                      backgroundColor: lock === 1 ? green[200] : red[200],
                      opacity: 1,
                    },
                  }}
                />
              </Box>
              <Box sx={{ textAlign: 'center', flex: 1 }}>
                <Typography variant="subtitle1" sx={{ mb: 1, color: '#fff' }}>Auto-Lock Timer</Typography>
                <Switch
                  checked={autolock === 1}
                  onChange={handleAutolockToggle}
                  color="success"
                  disabled={actionLoading}
                  sx={{
                    '& .MuiSwitch-thumb': {
                      backgroundColor: autolock === 1 ? green[500] : red[500],
                    },
                    '& .Mui-checked .MuiSwitch-thumb': {
                      backgroundColor: green[500],
                    },
                    '& .MuiSwitch-track': {
                      backgroundColor: autolock === 1 ? green[200] : red[200],
                      opacity: 1,
                    },
                  }}
                />
              </Box>
            </Stack>
            <Typography variant="subtitle1" align="center" sx={{ color: '#e0e0e0', mb: 2 }}>
              System Status
            </Typography>
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
              <LockIcon sx={{ color: lock === 1 ? green[500] : red[500], fontSize: 24 }} />
              <Typography variant="body1" sx={{ color: '#fff', fontWeight: 600, fontSize: 18 }}>
                {lock === 1 ? 'UNLOCKED' : 'LOCKED'}
              </Typography>
              <span style={{ fontSize: 18, color: '#fff' }}>•</span>
              <WifiIcon sx={{ color: green[400], fontSize: 22, ml: 1, mr: 0.5 }} />
              <Typography variant="body1" sx={{ color: '#fff', fontWeight: 500, fontSize: 17 }}>
                WiFi: OK
              </Typography>
            </Stack>
          </>
        )}
      </Paper>
    </Box>
  );
} 