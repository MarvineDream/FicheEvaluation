"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Container, TextField, Button, Typography, Box, Paper, Alert, Link, MenuItem, Select, InputLabel, FormControl } from "@mui/material";

export default function RegisterPage() {
  const router = useRouter();
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [departement, setDepartement] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("❌ Les mots de passe ne correspondent pas !");
      return;
    }

    try {
      const res = await fetch("https://backendeva.onrender.com/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom,
          email,
          password,
          role,
          departement: role === "manager" ? departement : null
        })
      });

      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message || "Erreur lors de l'inscription");
      }

      alert("✅ Inscription réussie !");
      router.push("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h5" fontWeight="bold" align="center" mb={3}>
          Créer un compte
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <Box component="form" onSubmit={handleRegister} noValidate sx={{ mt: 2 }}>
          <TextField
            label="Nom complet"
            value={nom}
            fullWidth
            margin="normal"
            onChange={(e) => setNom(e.target.value)}
            required
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            fullWidth
            margin="normal"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Mot de passe"
            type="password"
            value={password}
            fullWidth
            margin="normal"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <TextField
            label="Confirmer le mot de passe"
            type="password"
            value={confirmPassword}
            fullWidth
            margin="normal"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <FormControl fullWidth margin="normal" required>
            <InputLabel>Rôle</InputLabel>
            <Select
              value={role}
              label="Rôle"
              onChange={(e) => setRole(e.target.value)}
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="rh">RH</MenuItem>
              <MenuItem value="manager">Manager</MenuItem>
            </Select>
          </FormControl>

          {role === "manager" && (
            <TextField
              label="Département"
              value={departement}
              fullWidth
              margin="normal"
              onChange={(e) => setDepartement(e.target.value)}
              required
            />
          )}

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
            ➕ S’inscrire
          </Button>
        </Box>

        <Typography align="center" mt={3}>
          Déjà un compte ?{" "}
          <Link href="/login" underline="hover" sx={{ fontWeight: "bold" }}>
            Se connecter
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
}
