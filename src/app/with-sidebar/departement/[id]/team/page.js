'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Typography, Box, Grid, Paper, Button, Avatar, Stack } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import WorkIcon from '@mui/icons-material/Work';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import BadgeIcon from '@mui/icons-material/Badge';

const API_BASE = 'http://localhost:7000';

export default function DepartmentTeamPage() {
  const { id } = useParams();
  const router = useRouter();
  const [employees, setEmployees] = useState([]);
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!id || !token) return;

    const fetchData = async () => {
      try {
        const deptRes = await fetch(`${API_BASE}/departement/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const deptData = await deptRes.json();
        setDepartment(deptData);

        const staffRes = await fetch(`${API_BASE}/staff/All`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const staffData = await staffRes.json();

        const filtered = staffData.filter(emp => {
          const dep = emp.departement;
          const depId = typeof dep === 'string' ? dep : dep?._id;
          return depId?.toString() === id?.toString();
        });

        setEmployees(filtered);
      } catch (error) {
        console.error('❌ Erreur récupération données équipe:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <Typography>Chargement de l’équipe...</Typography>;
  if (!department) return <Typography>Département introuvable.</Typography>;

  return (
    <Box p={4}>
      {/* 🔙 Bouton retour */}
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={() => router.back()}
        sx={{ mb: 3 }}
      >
        Retour
      </Button>

      {/* Titre */}
      <Typography variant="h4" fontWeight="bold" color="#4caf50" gutterBottom>
        <PeopleIcon sx={{ mr: 1 }} />
        Équipe du département : {department.name}
      </Typography>

      {employees.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          Aucun employé dans ce département.
        </Typography>
      ) : (
        <Grid container spacing={4} mt={2}>
          {employees.map(emp => (
            <Grid item xs={12} sm={6} md={4} key={emp._id}>
              <Paper
                elevation={4}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  transition: '0.3s',
                  '&:hover': { boxShadow: 8, transform: 'translateY(-3px)' },
                }}
              >
                {/* Avatar ou logo */}
                <Avatar
                  sx={{ width: 64, height: 64, mb: 2, bgcolor: 'primary.light' }}
                >
                  {emp.nom?.[0] || <PeopleIcon />}
                </Avatar>

                {/* Nom et poste */}
                <Typography variant="h6" fontWeight="bold">
                  {emp.nom} {emp.prenom}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  <WorkIcon fontSize="small" sx={{ mr: 0.5 }} />
                  {emp.poste || 'N/A'}
                </Typography>

                <Stack spacing={0.5}>
                  <Typography variant="body2" color="text.secondary">
                    <BadgeIcon fontSize="small" sx={{ mr: 0.5 }} />
                    Type de contrat : {emp.typeContrat || 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <MailOutlineIcon fontSize="small" sx={{ mr: 0.5 }} />
                    {emp.email}
                  </Typography>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
