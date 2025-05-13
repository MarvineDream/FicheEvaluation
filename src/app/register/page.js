"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Alert,
  Link,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
} from "@mui/material";

export default function RegisterPage() {
  const router = useRouter();
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [departement, setDepartement] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if ( !nom.trim() ||!email.trim() ||!password ||!confirmPassword ||!role.trim()) 
     {
      setError("Tous les champs sont requis.");
      return;
     }
    

    if ((role === "RH" || role === "Manager") && !departement) {
      setError("Le champ 'Département' est requis pour ce rôle.");
      return;
    }

    if (password !== confirmPassword) {
      setError("❌ Les mots de passe ne correspondent pas !");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        nom,
        email,
        password,
        role,
        ...(role === "RH" || role === "Manager" ? { departement } : {})
      };

      const res = await fetch("https://backendeva.onrender.com/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom,
          email,
          password,
          role: role.toUpperCase(),
          departement: role === "Manager" || role === "RH" ? departement : undefined,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
      
        // Affichage d'un message spécifique si possible
        if (errorData?.message?.toLowerCase().includes("email")) {
          throw new Error("❌ Cet email est déjà utilisé.");
        }
      
        throw new Error(errorData.message || "❌ Une erreur est survenue lors de l'inscription.");
      }
      

      alert("✅ Inscription réussie !");
      router.push("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="RH">RH</MenuItem>
              <MenuItem value="Manager">Manager</MenuItem>
            </Select>
          </FormControl>
          {(role === "RH" || role === "Manager") && (
            <TextField
              label="Département"
              value={departement}
              onChange={(e) => setDepartement(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "➕ S’inscrire"
            )}
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
