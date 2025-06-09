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
  Stack
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

const API_URL = "http://localhost:7000";

export default function ManagerDashboardPage() {
  const [staffs, setStaffs] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getRandomStatus = () => {
    const list = ["En attente", "En cours", "Envoyée"];
    return list[Math.floor(Math.random() * list.length)];
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      const fetchStaff = async () => {
        try {
          const res = await fetch(`${API_URL}/staff/manager`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (!res.ok) {
            throw new Error("Erreur de récupération du staff");
          }

          const data = await res.json();

          const enriched = Array.isArray(data)
            ? data.map((s) => ({
                ...s,
                statutEvaluation: getRandomStatus()
              }))
            : [];

          setStaffs(enriched);
        } catch (err) {
          console.error("Erreur chargement staff :", err);
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
    const fin = new Date(s.dateFinContrat);
    const diff = (fin - new Date()) / (1000 * 60 * 60 * 24); // jours
    return diff <= 30 && diff >= 0;
  });

  const evaluationsEnAttente = staffs.filter((s) => s.statutEvaluation === "En attente");
  const evaluationsEnvoyees = staffs.filter((s) => s.statutEvaluation === "Envoyée");

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Profil utilisateur */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: "#1976d2" }}>
            <PersonIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              Bonjour, {user?.nom}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manager – Département {user?.departement}
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Statistiques */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <StatCard title="Collaborateurs" value={staffs.length} />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard title="Évaluations en attente" value={evaluationsEnAttente.length} />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard title="Évaluations envoyées" value={evaluationsEnvoyees.length} />
        </Grid>
      </Grid>

      {/* Contrats expirants */}
      <Box mt={6}>
        <Typography variant="h6" gutterBottom>
          📅 Contrats expirant sous 30 jours
        </Typography>
        <Paper elevation={3}>
          <List>
            {contractsExpiringSoon.length === 0 && (
              <ListItem>
                <ListItemText primary="Aucun contrat proche de l’échéance" />
              </ListItem>
            )}
            {contractsExpiringSoon.map((s) => (
              <ListItem key={s._id} divider>
                <ListItemText
                  primary={`${s.nom} ${s.prenom} – ${s.poste}`}
                  secondary={`Fin : ${new Date(s.dateFinContrat).toLocaleDateString("fr-FR")}`}
                />
                <Button variant="outlined" size="small" href={`/with-sidebar/evaluation?staffId=${s._id}`}>
                  Évaluer
                </Button>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>

      {/* Liste des collaborateurs */}
      <Box mt={6}>
        <Typography variant="h6" gutterBottom>
          👥 Équipe à évaluer
        </Typography>
        <Paper elevation={2}>
          <List>
            {staffs.map((s) => (
              <ListItem key={s._id} divider>
                <ListItemText
                  primary={`${s.nom} ${s.prenom} – ${s.poste}`}
                  secondary={`Département : ${s.departement}`}
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
                        ? "orange"
                        : s.statutEvaluation === "En cours"
                        ? "blue"
                        : "green"
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

function StatCard({ title, value }) {
  return (
    <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
      <Typography variant="subtitle2" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="h4" fontWeight="bold" color="primary" mt={1}>
        {value}
      </Typography>
    </Paper>
  );
}
