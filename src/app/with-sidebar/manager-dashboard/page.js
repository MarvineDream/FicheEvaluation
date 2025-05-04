"use client";

import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  Button,
  Chip,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function ManagerDashboardPage() {
  const [staff, setStaff] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await fetch("https://backendeva.onrender.com/staff");
        const data = await res.json();

        const staffArray = Array.isArray(data) ? data : [];

        // Statistiques des types de contrat
        const counts = staffArray.reduce((acc, s) => {
          acc[s.typeContrat] = (acc[s.typeContrat] || 0) + 1;
          return acc;
        }, {});

        setChartData({
          labels: Object.keys(counts),
          datasets: [
            {
              label: "Nombre d'agents",
              data: Object.values(counts),
              backgroundColor: "#2196f3",
            },
          ],
        });

        setStaff(staffArray);
      } catch (error) {
        console.error("Erreur chargement staff manager", error);
        setStaff([]);
      }
    };

    fetchStaff();
  }, []);

  const isContractExpiring = (dateStr) => {
    const now = new Date();
    const contractDate = new Date(dateStr);
    const diff = (contractDate - now) / (1000 * 60 * 60 * 24);
    return diff <= 30;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Tableau de bord Manager
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <StatCard title="Total du personnel" value={staff.length} />
        </Grid>
        <Grid item xs={12} md={6}>
          <StatCard
            title="Contrats expirant sous 30 jours"
            value={staff.filter((s) => isContractExpiring(s.dateFinContrat)).length}
          />
        </Grid>
      </Grid>

      <Box mt={6}>
        <Typography variant="h6" gutterBottom>
          Répartition des types de contrats
        </Typography>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Bar data={chartData} />
        </Paper>
      </Box>

      <Box mt={6}>
        <Typography variant="h6" gutterBottom>
          Équipe sous votre responsabilité
        </Typography>
        <Paper elevation={1}>
          <List>
            {staff.map((agent) => (
              <ListItem
                key={agent._id}
                divider
                secondaryAction={
                  <Chip
                    label={isContractExpiring(agent.dateFinContrat) ? "Contrat expirant" : "Actif"}
                    color={isContractExpiring(agent.dateFinContrat) ? "warning" : "success"}
                  />
                }
              >
                <ListItemText
                  primary={`${agent.nom} ${agent.prenom}`}
                  secondary={`Poste: ${agent.emploi} | Département: ${agent.departement}`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>

      <Box mt={6} display="flex" gap={2}>
        <Button variant="contained" color="primary" href="/with-sidebar/evaluation">
          ➕ Remplir une évaluation
        </Button>
        <Button variant="outlined" color="secondary" href="/with-sidebar/staff">
          👥 Gérer mon équipe
        </Button>
      </Box>
    </Container>
  );
}

function StatCard({ title, value }) {
  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="subtitle1">{title}</Typography>
      <Typography variant="h5" fontWeight="bold">
        {value}
      </Typography>
    </Paper>
  );
}
