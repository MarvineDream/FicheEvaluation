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
  BarChart3, LineChart
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

import { Bar, Line } from "react-chartjs-2";

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

  const [departements, setDepartements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [staffEvolutionData, setStaffEvolutionData] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // ✅ Helper pour récupérer le token
  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchDepartements = async () => {
      try {
        const token = getToken();
        if (!token) throw new Error("Token manquant, reconnectez-vous.");

        const res = await fetch("http://localhost:7000/departement", {
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
      const token = getToken();
      if (!token) throw new Error("Token manquant, reconnectez-vous.");

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
      const token = getToken();
      if (!token) throw new Error("Token manquant, reconnectez-vous.");

      const res = await fetch("http://localhost:7000/auth/creer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Erreur lors de la création");
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
    const fetchEvolution = async () => {
      try {
        const token = getToken();
        if (!token) throw new Error("Token manquant, reconnectez-vous.");

        const response = await fetch("http://localhost:7000/staff/evolution", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        const labels = data?.map((item) => item.mois) || [];
        const values = data?.map((item) => item.total) || [];

        setStaffEvolutionData({
          labels,
          datasets: [
            {
              label: "Nombre de personnels",
              data: values,
              fill: true,
              borderColor: "rgb(34,197,94)",
              backgroundColor: "rgba(34,197,94,0.3)",
              tension: 0.3,
            },
          ],
        });
      } catch (error) {
        console.error("Erreur chargement staff evolution :", error);
      }
    };

    fetchEvolution();
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
      {/* Profil utilisateur */}
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

      {/* Stats */}
      <Grid container spacing={3} justifyContent="center" alignItems="stretch">
        <Grid item xs={12} sm={6} md={4}>
          <StatCard title="Total du personnel" value={stats.totalStaff} Icon={UsersRound} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard title="Nouveaux employés" value={stats.nouveauxEmployes ?? 0} Icon={User} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Employés évalués ce mois"
            value={stats.evaluationsCeMois ?? 0}
            Icon={TrendingUp}
          />
        </Grid>
      </Grid>


      {/* Graphique : type de contrat */}
      <Box mt={6}>
        <Typography variant="h6" className="flex items-center gap-2">
          <BarChart3 className="text-green-600" /> Répartition par type de contrat
        </Typography>
        <Paper sx={{ p: 3, mt: 2 }}>
          <Bar data={contractTypeData} options={{ responsive: true, maintainAspectRatio: !isMobile }} />
        </Paper>
      </Box>

      {/* Graphique : évolution personnel */}
      <Box mt={6}>
        <Typography variant="h6" className="flex items-center gap-2">
          <LineChart className="text-green-600" /> Évolution du personnel
        </Typography>
        <Paper sx={{ p: 3, mt: 2 }}>
          {staffEvolutionData ? (
            <Line
              data={staffEvolutionData}
              options={{
                responsive: true,
                maintainAspectRatio: !isMobile,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: true, text: 'Personnel par mois' },
                },
                scales: {
                  x: { title: { display: true, text: 'Mois' } },
                  y: { beginAtZero: true, title: { display: true, text: 'Effectif' } },
                },
              }}
            />
          ) : (
            <Typography>Chargement des données...</Typography>
          )}
        </Paper>
      </Box>

      {/* Répartition par département */}
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

      {/* Formulaire création utilisateur */}
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
