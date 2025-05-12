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
  Divider,
  List,
  ListItem,
  ListItemText,
  Grid
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
  const [stats, setStats] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const fetchStats = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const token = storedUser ? JSON.parse(storedUser).token : null;
    
        const res = await fetch("https://backendeva.onrender.com/staff/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
    
        if (!res.ok) {
          throw new Error(`Erreur HTTP: ${res.status}`);
        }
    
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

  const contractTypeData = {
    labels: Array.isArray(stats.parTypeContrat) ? stats.parTypeContrat.map((t) => t.type) : [],
    datasets: [
      {
        label: "Type de contrat",
        data: Array.isArray(stats.parTypeContrat) ? stats.parTypeContrat.map((t) => t.count) : [],
        backgroundColor: ["#1976d2", "#9c27b0", "#ff9800"]
      }
    ]
  };
  
  const contractStatusData = {
    labels: ["Actifs", "Expirés", "Renouvelés"],
    datasets: [
      {
        label: "Statut des contrats",
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
    labels: Array.isArray(stats.evolutionStaff) ? stats.evolutionStaff.map((e) => e.mois) : [],
    datasets: [
      {
        label: "Évolution du personnel",
        data: Array.isArray(stats.evolutionStaff) ? stats.evolutionStaff.map((e) => e.count) : [],
        borderColor: "#1976d2",
        backgroundColor: "rgba(25, 118, 210, 0.5)",
        fill: true
      }
    ]
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

      {/* 📊 Statistiques générales */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <StatCard title="Total du personnel" value={stats.totalStaff} />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard title="Nouveaux employés ce mois-ci" value={stats.nouveauxEmployes} />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard title="Départs récents" value={stats.departRecents} />
        </Grid>
      </Grid>

      {/* 📈 Graphiques */}
      <Box mt={6}>
        <Typography variant="h6" gutterBottom>
          Répartition par type de contrat
        </Typography>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Bar data={contractTypeData} options={{ responsive: true }} />
        </Paper>
      </Box>

      <Box mt={6}>
        <Typography variant="h6" gutterBottom>
          Évolution du personnel
        </Typography>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Line data={staffEvolutionData} options={{ responsive: true }} />
        </Paper>
      </Box>

      <Box mt={6}>
        <Typography variant="h6" gutterBottom>
          Statut des contrats
        </Typography>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Pie data={contractStatusData} options={{ responsive: true }} />
        </Paper>
      </Box>

      {/* 🧾 Détail par département */}
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
