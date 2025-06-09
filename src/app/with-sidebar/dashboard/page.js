"use client";

import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Stack,
  Box,
  CircularProgress,
  Avatar,
  Alert,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function DashboardRHAdmin() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [form, setForm] = useState({
    nom: "",
    email: "",
    password: "",
    role: "",
    departement: ""
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      const res = await fetch("http://localhost:7000/staff/stats", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Erreur stats :", err);
    }
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      const res = await fetch("http://localhost:7000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Erreur");
      }

      setSuccessMsg("✅ Utilisateur créé avec succès !");
      setForm({ nom: "", email: "", password: "", role: "", departement: "" });
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user || !stats) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  // Graphiques
  const contractTypeData = {
    labels: stats.parTypeContrat?.map((t) => t.type) || [],
    datasets: [
      {
        label: "Type de contrat",
        data: stats.parTypeContrat?.map((t) => t.count) || [],
        backgroundColor: ["#1976d2", "#9c27b0", "#ff9800"]
      }
    ]
  };

  const contractStatusData = {
    labels: ["Actifs", "Expirés", "Renouvelés"],
    datasets: [
      {
        label: "Contrats",
        data: [
          stats.contratsActifs ?? 0,
          stats.contratsExpirés ?? 0,
          stats.contratsRenouvelés ?? 0
        ],
        backgroundColor: ["#4caf50", "#f44336", "#ffeb3b"]
      }
    ]
  };

  const staffEvolutionData = {
    labels: stats.evolutionStaff?.map((e) => e.mois) || [],
    datasets: [
      {
        label: "Évolution",
        data: stats.evolutionStaff?.map((e) => e.count) || [],
        borderColor: "#1976d2",
        backgroundColor: "rgba(25,118,210,0.4)",
        fill: true
      }
    ]
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: "#1976d2" }}>
            <PersonIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              Bienvenue, {user.nom}
            </Typography>
            <Typography variant="body2">{user.role}</Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Statistiques principales */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <StatCard title="Total du personnel" value={stats.totalStaff} />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard title="Nouveaux employés" value={stats.nouveauxEmployes} />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard title="Départs récents" value={stats.departRecents} />
        </Grid>
      </Grid>

      {/* Graphiques */}
      <Box mt={6}>
        <Typography variant="h6">📊 Répartition par type de contrat</Typography>
        <Paper sx={{ p: 3, mt: 2 }}>
          <Bar data={contractTypeData} />
        </Paper>
      </Box>

      <Box mt={6}>
        <Typography variant="h6">📈 Évolution du personnel</Typography>
        <Paper sx={{ p: 3, mt: 2 }}>
          <Line data={staffEvolutionData} />
        </Paper>
      </Box>

      <Box mt={6}>
        <Typography variant="h6">📌 Statut des contrats</Typography>
        <Paper sx={{ p: 3, mt: 2 }}>
          <Pie data={contractStatusData} />
        </Paper>
      </Box>

      {/* Détail par département */}
      <Box mt={6}>
        <Typography variant="h6">🧾 Répartition par département</Typography>
        <Paper elevation={2} sx={{ mt: 2 }}>
          <List>
            {stats.parDepartement?.map((dep) => (
              <ListItem key={dep.nom} divider>
                <ListItemText primary={dep.nom} />
                <Typography>{dep.count}</Typography>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>

      {/* Formulaire de création de compte */}
      {(user.role === "admin" || user.role === "RH") && (
        <Box mt={6}>
          <Typography variant="h6" gutterBottom>
            ➕ Créer un nouvel utilisateur
          </Typography>
          {successMsg && <Alert severity="success">{successMsg}</Alert>}
          {errorMsg && <Alert severity="error">{errorMsg}</Alert>}

          <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
            <form onSubmit={handleCreateUser}>
              <Grid container spacing={2}>
                {["nom", "email", "password",].map((field) => (
                  <Grid item xs={12} md={4} key={field}>
                    <TextField
                      label={field.charAt(0).toUpperCase() + field.slice(1)}
                      name={field}
                      value={form[field]}
                      onChange={handleInputChange}
                      fullWidth
                      required
                      type={field === "password" ? "password" : "text"}
                    />
                  </Grid>
                ))}
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth required>
                    <InputLabel>Rôle</InputLabel>
                    <Select
                      name="role"
                      value={form.role}
                      onChange={handleInputChange}
                      label="Rôle"
                    >
                      <MenuItem value="RH">RH</MenuItem>
                      <MenuItem value="Manager">Manager</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                {(form.role === "RH" || form.role === "Manager") && (
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Département"
                      name="departement"
                      value={form.departement}
                      onChange={handleInputChange}
                      fullWidth
                      required
                    />
                  </Grid>
                )}
              </Grid>

              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 3 }}
                disabled={loading}
              >
                {loading ? "Création..." : "Créer l'utilisateur"}
              </Button>
            </form>
          </Paper>
        </Box>
      )}
    </Container>
  );
}

function StatCard({ title, value }) {
  return (
    <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
      <Typography variant="subtitle1" color="textSecondary">
        {title}
      </Typography>
      <Typography variant="h4" fontWeight="bold" color="primary" mt={1}>
        {value}
      </Typography>
    </Paper>
  );
}
