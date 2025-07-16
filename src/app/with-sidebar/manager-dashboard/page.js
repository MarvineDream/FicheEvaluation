"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  CircularProgress,
  Avatar,
  Stack,
  useMediaQuery
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Users, ClipboardList, Clock, User2 } from "lucide-react";

const API_URL = "https://backendeva.onrender.com";

export default function ManagerDashboardPage() {
  const [staffs, setStaffs] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const getRandomStatus = () => {
    const list = ["En attente", "En cours", "Envoyée"];
    return list[Math.floor(Math.random() * list.length)];
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Aucun token trouvé");
        const res = await fetch(`${API_URL}/departement`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok || !Array.isArray(data)) throw new Error("Erreur de récupération");
        setDepartments(data);
      } catch (error) {
        console.error("Departement fetch error:", error);
      }
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (storedUser && token) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      const fetchStaff = async () => {
        try {
          const res = await fetch(`${API_URL}/staff/manager`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          setStaffs(
            Array.isArray(data)
              ? data.map((s) => ({ ...s, statutEvaluation: getRandomStatus() }))
              : []
          );
        } catch (err) {
          console.error("Erreur staff:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchStaff();
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <Box minHeight="80vh" display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  const contractsExpiringSoon = staffs.filter((s) => {
    if (!s.dateFinContrat) return false;
    const diff = (new Date(s.dateFinContrat) - new Date()) / (1000 * 60 * 60 * 24);
    return diff <= 30 && diff >= 0;
  });

  const getNomDepartement = (id) => {
    const departement = departments.find((d) => d._id === id);
    return departement ? departement.nom : "Inconnu";
  };

  const StatCard = ({ Icon, title, value }) => (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 4, textAlign: "center" }}>
      <Icon size={32} className="text-green-600 mb-2" />
      <Typography variant="subtitle2" color="text.secondary">{title}</Typography>
      <Typography variant="h4" fontWeight="bold" color="primary" mt={1}>{value}</Typography>
    </Paper>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 4 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: "#1976d2" }}><User2 /></Avatar>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              Bonjour, {user?.nom}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manager – {getNomDepartement(user?.departement)}
            </Typography>
          </Box>
        </Stack>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}><StatCard title="Collaborateurs" value={staffs.length} Icon={Users} /></Grid>
        <Grid item xs={12} md={4}><StatCard title="Évaluations en attente" value={staffs.filter(s => s.statutEvaluation === "En attente").length} Icon={ClipboardList} /></Grid>
        <Grid item xs={12} md={4}><StatCard title="Contrats expirants" value={contractsExpiringSoon.length} Icon={Clock} /></Grid>
      </Grid>

      <Box mt={6}>
        <Typography variant="h6" gutterBottom>📅 Contrats proches de léchéance</Typography>
        <Paper elevation={2} sx={{ p: 2, borderRadius: 3 }}>
          <List>
            {contractsExpiringSoon.length === 0 ? (
              <ListItem><ListItemText primary="Aucun contrat proche de l’échéance" /></ListItem>
            ) : (
              contractsExpiringSoon.map((s) => (
                <ListItem key={s._id} divider>
                  <ListItemText
                    primary={`${s.nom} ${s.prenom} – ${s.poste}`}
                    secondary={`Fin : ${new Date(s.dateFinContrat).toLocaleDateString("fr-FR")}`}
                  />
                  <Button variant="outlined" size="small" href={`/with-sidebar/evaluation?staffId=${s._id}`}>
                    Évaluer
                  </Button>
                </ListItem>
              ))
            )}
          </List>
        </Paper>
      </Box>

      <Box mt={6}>
        <Typography variant="h6" gutterBottom>👥 Liste des collaborateurs</Typography>
        <Paper elevation={2} sx={{ borderRadius: 3 }}>
          <List>
            {staffs.map((s) => (
              <ListItem key={s._id} divider>
                <ListItemText
                  primary={`${s.nom} ${s.prenom} – ${s.poste}`}
                  secondary={`Département : ${getNomDepartement(s.departement)}`}
                />
                <Typography
                  variant="caption"
                  sx={{
                    px: 2,
                    py: 0.5,
                    borderRadius: 2,
                    color: "#fff",
                    bgcolor:
                      s.statutEvaluation === "En attente"
                        ? "#f57c00"
                        : s.statutEvaluation === "En cours"
                        ? "#1976d2"
                        : "#388e3c",
                  }}
                >
                  {s.statutEvaluation}
                </Typography>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
    </Container>
  );
}
