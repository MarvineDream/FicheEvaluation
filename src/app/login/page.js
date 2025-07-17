'use client';

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
  CircularProgress,
  Link
} from "@mui/material";
import Image from "next/image";

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
      const res = await fetch("http://localhost:7000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message || "Erreur de connexion");
      }

      const { token, user } = await res.json();
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", user.role);

      switch (user.role) {
        case "admin":
        case "RH":
          router.push("/with-sidebar/dashboard");
          break;
        case "Manager":
          router.push(`/with-sidebar/manager-dashboard?departement=${user.departement}`);
          break;
        default:
          throw new Error("Rôle utilisateur non reconnu");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: `url('/istockphoto-931429246-612x612.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 3,
            backdropFilter: "blur(10px)",
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid #2e7d32',
          }}
        >
          <Box mb={2} textAlign="center">
            <Image
              src="/logo-bamboo.svg"
              alt="Logo Bamboo"
              width={80}
              height={80}
            />
          </Box>

          <Typography
            variant="h5"
            fontWeight="bold"
            align="center"
            mb={2}
            sx={{ color: "#2e7d32" }}
          >
            Connexion
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleLogin}>
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
              sx={{
                mt: 2,
                backgroundColor: '#2e7d32',
                '&:hover': {
                  backgroundColor: '#1b5e20',
                },
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} sx={{ color: "#ffffff" }} /> : "Se connecter"}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
