"use client";

import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  Box,
  CircularProgress,
  Avatar,
  Divider,
  Stack
} from "@mui/material";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";
import PersonIcon from "@mui/icons-material/Person";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const fetchStats = async () => {
      try {
        const res = await fetch("https://backendeva.onrender.com/staff/stats");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Erreur de chargement des stats", err);
      }
    };

    fetchStats();
  }, []);

  if (!stats || !user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  const chartData = {
    labels: stats.parDepartement.map((d) => d.nom),
    datasets: [
      {
        label: "Nombre de staff",
        data: stats.parDepartement.map((d) => d.count),
        backgroundColor: "#1976d2"
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* 👤 Profil utilisateur */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: "#1976d2" }}>
            <PersonIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              Bienvenue, {user.nom}
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* 📊 Statistiques globales */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <StatCard title="Total du personnel" value={stats.totalStaff} />
        </Grid>
        <Grid item xs={12} md={6}>
          <StatCard title="Contrats expirant sous 30 jours" value={stats.contratsExpirants.length} />
        </Grid>
      </Grid>

      {/* 📈 Graphique */}
      <Box mt={6}>
        <Typography variant="h6" gutterBottom>
          Répartition par département
        </Typography>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Bar data={chartData} options={chartOptions} />
        </Paper>
      </Box>

      {/* 🧾 Liste des départements */}
      <Box mt={6}>
        <Typography variant="h6" gutterBottom>
          Détail par département
        </Typography>
        <Paper elevation={2}>
          <List>
            {stats.parDepartement.map((dep) => (
              <ListItem key={dep.nom} divider>
                <ListItemText primary={dep.nom} />
                <Typography variant="body1">{dep.count}</Typography>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
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
