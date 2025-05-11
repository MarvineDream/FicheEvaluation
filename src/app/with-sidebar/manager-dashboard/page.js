"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Chip,
  Stack,
  Grid as MuiGrid,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const getRandomStatus = () => {
  const statuses = ["En attente", "En cours", "Envoyée"];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

export default function ManagerDashboardPage() {
  const [staff, setStaff] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await fetch("https://backendeva.onrender.com/staff");
        const data = await res.json();
        const staffArray = Array.isArray(data)
          ? data.map((s) => ({
              ...s,
              statutEvaluation: getRandomStatus()
            }))
          : [];

        setStaff(staffArray);

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
              backgroundColor: "#1976d2"
            }
          ]
        });
      } catch (err) {
        console.error("Erreur chargement staff:", err);
        setStaff([]);
      }
    };

    fetchStaff();
  }, []);

  const isExpiringSoon = (dateStr) => {
    if (!dateStr) return false;
    const now = new Date();
    const date = new Date(dateStr);
    const diff = (date - now) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 7;
  };

  const expiringStaff = staff.filter((s) => isExpiringSoon(s.dateFinContrat));
  const evalEnAttente = staff.filter((s) => s.statutEvaluation === "En attente");
  const evalEnvoyees = staff.filter((s) => s.statutEvaluation === "Envoyée");

  const columns = [
    { field: "nom", headerName: "Nom", flex: 1 },
    { field: "prenom", headerName: "Prénom", flex: 1 },
    { field: "emploi", headerName: "Emploi", flex: 1 },
    { field: "departement", headerName: "Département", flex: 1 },
    {
      field: "dateFinContrat",
      headerName: "Fin de contrat",
      flex: 1,
      valueFormatter: ({ value }) => (value ? new Date(value).toLocaleDateString() : "—")
    },
    {
      field: "statutEvaluation",
      headerName: "Évaluation",
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === "Envoyée"
              ? "success"
              : params.value === "En attente"
              ? "warning"
              : "info"
          }
        />
      )
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Tableau de bord Manager
      </Typography>

      {/* Résumé */}
      <Stack direction="row" spacing={2} useFlexGap flexWrap="wrap" mb={3}>
        <StatCard title="Total collaborateurs" value={staff.length} />
        <StatCard title="Contrats expirant sous 7j" value={expiringStaff.length} />
        <StatCard title="Évaluations à remplir" value={evalEnAttente.length} />
        <StatCard title="Évaluations envoyées" value={evalEnvoyees.length} />
      </Stack>

      {/* Graphique */}
      <Box my={4}>
        <Typography variant="h6" gutterBottom>
          Répartition par type de contrat
        </Typography>
        <Paper elevation={2} sx={{ p: 2 }}>
          <Bar data={chartData} />
        </Paper>
      </Box>

      {/* Liste des collaborateurs */}
      <Box my={4}>
        <Typography variant="h6" gutterBottom>
          Équipe sous votre responsabilité
        </Typography>
        <Paper elevation={2} sx={{ height: 500 }}>
          <DataGrid
            rows={staff}
            columns={columns}
            getRowId={(row) => row._id}
            pageSize={10}
            disableRowSelectionOnClick
          />
        </Paper>
      </Box>

      {/* Accès rapide */}
      <Box mt={4} display="flex" flexWrap="wrap" gap={2}>
        <Button variant="contained" color="primary" href="/with-sidebar/evaluation">
          ➕ Remplir une évaluation
        </Button>
        <Button variant="outlined" color="secondary" href="/with-sidebar/staff">
          👥 Gérer mon équipe
        </Button>
        <Button variant="outlined" href="/with-sidebar/historique">
          📄 Historique des évaluations
        </Button>
      </Box>
    </Container>
  );
}

function StatCard({ title, value }) {
  return (
    <Paper elevation={3} sx={{ p: 2, minWidth: 220 }}>
      <Typography variant="subtitle2" color="textSecondary">
        {title}
      </Typography>
      <Typography variant="h5" fontWeight="bold">
        {value}
      </Typography>
    </Paper>
  );
}
