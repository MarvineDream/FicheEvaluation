'use client';

import { useEffect, useState } from "react";
import {
  Container, Typography, Paper, Stack, Box,
  CircularProgress, Avatar, Alert, Grid,
  TextField, Button, FormControl, InputLabel,
  Select, MenuItem, List, ListItem, ListItemText,
  useMediaQuery
} from "@mui/material";
import { useTheme } from '@mui/material/styles';

import {
  User, UsersRound, TrendingUp,
  BarChart3, LineChart, PieChart
} from "lucide-react";

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

import { Bar, Line, Pie } from "react-chartjs-2";

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

  const [data, setData] = useState([]);
  const [departements, setDepartements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [staffEvolutionData, setStaffEvolutionData] = useState([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
    fetchStats();
  }, []);


  useEffect(() => {
    const fetchDepartements = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("user"))?.token;
        const res = await fetch("https://backendeva.onrender.com/departement", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setDepartements(data);
      } catch (error) {
        console.error("Erreur lors du chargement des départements :", error);
      }
    };

    fetchDepartements();
  }, []);


  const fetchStats = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      const res = await fetch("https://backendeva.onrender.com/staff/stats", {
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
      const res = await fetch("https://backendeva.onrender.com/auth/creer", {
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://backendeva.onrender.com/staff/evolution', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        // Adapter les données pour Chart.js
        const labels = data?.map((item) => item.mois) || [];
        const values = data?.map((item) => item.total) || [];


        setStaffEvolutionData({
          labels,
          datasets: [
            {
              label: 'Nombre de personnels',
              data: values,
              fill: false,
              borderColor: 'rgb(34,197,94)',
              tension: 0.3,
            },
          ],
        });
      } catch (error) {
        console.error('Erreur chargement staff evolution :', error);
      }
    };

    fetchData();
  }, []);

  if (!user || !stats) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  const contractTypeData = {
    labels: stats.parTypeContrat?.map((t) => t.type) || [],
    datasets: [{
      label: "Type de contrat",
      data: stats.parTypeContrat?.map((t) => t.count) || [],
      backgroundColor: ["#4CAF50", "#81C784", "#A5D6A7"],
      borderRadius: 6
    }]
  };

  const staffEvolutionChartData = {
    labels: staffEvolutionData.labels || [],
    datasets: [
      {
        label: "Évolution du personnel",
        data: staffEvolutionData.datasets?.length > 0
          ? staffEvolutionData.datasets[0].data
          : [],
        borderColor: "#2E7D32",
        backgroundColor: "rgba(46,125,50,0.3)",
        fill: true,
        tension: 0.4,
      },
    ],
  };


  const contractStatusData = {
    labels: ["Actifs", "Expirés", "Renouvelés"],
    datasets: [{
      label: "Contrats",
      data: [
        stats.contratsActifs ?? 0,
        stats.contratsExpirés ?? 0,
        stats.contratsRenouvelés ?? 0
      ],
      backgroundColor: ["#66BB6A", "#EF5350", "#FFCA28"],
      borderWidth: 1
    }]
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: "#2E7D32" }}>
            <User />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              Bienvenue, {user.nom}
            </Typography>
            <Typography variant="body2">{user.role}</Typography>
          </Box>
        </Stack>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <StatCard title="Total du personnel" value={stats.totalStaff} Icon={UsersRound} />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard title="Nouveaux employés" value={stats.nouveauxEmployes} Icon={User} />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard title="Départs récents" value={stats.departRecents} Icon={TrendingUp} />
        </Grid>
      </Grid>

      <Box mt={6}>
        <Typography variant="h6" className="flex items-center gap-2">
          <BarChart3 className="text-green-600" /> Répartition par type de contrat
        </Typography>
        <Paper sx={{ p: 3, mt: 2 }}>
          <Bar data={contractTypeData} options={{ responsive: true, maintainAspectRatio: !isMobile }} />
        </Paper>
      </Box>

      <Box mt={6}>
        <Typography variant="h6" className="flex items-center gap-2">
          <LineChart className="text-green-600" /> Évolution du personnel
        </Typography>

        <Paper sx={{ p: 3, mt: 2 }}>
          {staffEvolutionData?.labels?.length > 0 ? (
            <Line
              data={staffEvolutionChartData}
              options={{
                responsive: true,
                maintainAspectRatio: !isMobile,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: true, text: 'Personnel par mois' },
                },
                scales: {
                  x: {
                    title: { display: true, text: 'Mois' },
                  },
                  y: {
                    title: { display: true, text: 'Effectif' },
                    beginAtZero: true,
                  },
                },
              }}
            />
          ) : (
            <Typography>Chargement des données...</Typography>
          )}
        </Paper>

      </Box>



      <Box mt={6}>
        <Typography variant="h6">🧾 Répartition par département</Typography>
        <Paper sx={{ mt: 2 }}>
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

      {user.role === "RH" && (
        <Box mt={6}>
          <Typography variant="h6" gutterBottom>
            ➕ Créer un nouvel utilisateur
          </Typography>
          {successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}
          {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}

          <Paper sx={{ p: 3, mt: 2 }}>
            <form onSubmit={handleCreateUser}>
              <Grid container spacing={2}>
                {["nom", "email", "password"].map((field) => (
                  <Grid item xs={12} md={4} key={field}>
                    <TextField
                      label={field.charAt(0).toUpperCase() + field.slice(1)}
                      name={field}
                      type={field === "password" ? "password" : "text"}
                      value={form[field]}
                      onChange={handleInputChange}
                      fullWidth
                      required
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

                {form.role === "Manager" && (
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth required>
                      <InputLabel>Département</InputLabel>
                      <Select
                        name="departement"
                        value={form.departement}
                        onChange={handleInputChange}
                        label="Département"
                      >
                        {Array.isArray(departements) && departements.map((dep) => (
                          <MenuItem key={dep._id} value={dep._id}>
                            {dep.name || dep.nom}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
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

function StatCard({ title, value, Icon }) {
  return (
    <Paper elevation={3} sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
      <Box display="flex" justifyContent="center" mb={1}>
        <Icon size={30} className="text-green-600" />
      </Box>
      <Typography variant="subtitle1" color="textSecondary">
        {title}
      </Typography>
      <Typography variant="h4" fontWeight="bold" color="primary" mt={1}>
        {value}
      </Typography>
    </Paper>
  );
}
