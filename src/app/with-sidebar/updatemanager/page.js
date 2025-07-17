"use client";

import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Alert
} from "@mui/material";

export default function UpdateManagerPage() {
  const [managers, setManagers] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [departement, setDepartement] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchManagers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:7000/users?role=MANAGER", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setManagers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:7000/users/manager/${selectedId}/departement`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ departement })
        }
      );

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Erreur");

      setMessage("✅ Département mis à jour.");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Attribuer un département à un manager
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}
        {message && <Alert severity="success">{message}</Alert>}

        <form onSubmit={handleUpdate}>
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Manager</InputLabel>
            <Select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              label="Manager"
            >
              {managers.map((m) => (
                <MenuItem key={m._id} value={m._id}>
                  {m.nom} ({m.email})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Nouveau Département"
            fullWidth
            margin="normal"
            required
            value={departement}
            onChange={(e) => setDepartement(e.target.value)}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            disabled={!selectedId || !departement}
          >
            Mettre à jour
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
