'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Typography, Box, Grid, Paper, Button } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const API_BASE = 'https://backendeva.onrender.com';

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

      <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
        <PeopleIcon sx={{ mr: 1 }} />
        Équipe du département : {department.name}
      </Typography>

      {employees.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          Aucun employé dans ce département.
        </Typography>
      ) : (
        <Grid container spacing={3} mt={2}>
          {employees.map(emp => (
            <Grid item xs={12} sm={6} md={4} key={emp._id}>
              <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="h6">
                  {emp.nom} {emp.prenom}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {emp.poste}
                </Typography>
                <Typography variant="body2">
                  Type de contrat : {emp.typeContrat || 'N/A'}
                </Typography>
                <Typography variant="body2">
                  Email : {emp.email}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
