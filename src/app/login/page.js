"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CircularProgress } from "@mui/material";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Alert,
  Link
} from "@mui/material";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("https://backendeva.onrender.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message || "Erreur de connexion");
      }

      const data = await res.json();
      const { token, user } = data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // 🔁 Redirection en fonction du rôle
      switch (user.role) {
        case "admin":
        case "RH":
          router.push("/with-sidebar/dashboard");
          break;
        case "manager":
          router.push(`/with-sidebar/manager-dashboard?departement=${user.departement}`);
          break;
        default:
          throw new Error("Rôle utilisateur non reconnu");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false); // ⛔ Désactive le chargement dans tous les cas
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h5" fontWeight="bold" align="center" mb={3}>
          Connexion
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 2 }}>
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
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3 }}
            disabled={loading} // Désactive le bouton pendant le chargement
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Se connecter"}
          </Button>
        </Box>

        <Typography align="center" mt={3}>
          Pas encore de compte ?{" "}
          <Link
            href="/register"
            underline="hover"
            sx={{ fontWeight: "bold", cursor: "pointer" }}
          >
            S’inscrire
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
}
