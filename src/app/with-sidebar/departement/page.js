'use client';

import React, { useEffect, useState } from 'react';
import BusinessIcon from '@mui/icons-material/Business';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/navigation';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Grid, Paper, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Select, MenuItem, InputLabel, FormControl, IconButton, Box
} from '@mui/material';

const API_BASE = 'http://localhost:7000';

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [users, setUsers] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);

  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newManagerId, setNewManagerId] = useState('');

  const fetchData = React.useCallback(async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) return;

    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [depsRes, empRes, usersRes] = await Promise.all([
        fetch(`${API_BASE}/departement`, { headers }),
        fetch(`${API_BASE}/staff/All`, { headers }),
        fetch(`${API_BASE}/auth/users`, { headers }),
      ]);

      const depsData = await depsRes.json();
      const empData = await empRes.json();
      const usersData = await usersRes.json();

      setUsers(usersData);
      setDepartments(depsData);
      setEmployees(empData);
    } catch (error) {
      console.error("Erreur fetchData:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getStats = (depId) => {
    const filtered = employees.filter(e => {
      const depMatch = typeof e.departement === 'object' ? e.departement._id === depId : e.departement === depId;
      return depMatch;
    });

    return {
      cdi: filtered.filter(e => e.typeContrat === 'CDI').length,
      cdd: filtered.filter(e => e.typeContrat === 'CDD').length,
      stage: filtered.filter(e => e.typeContrat === 'Stagiaire').length,
    };
  };

  const resetForm = () => {
    setNewName('');
    setNewDescription('');
    setNewManagerId('');
  };

  const handleCreate = async () => {
    if (!newName.trim()) return alert("Le nom est requis");
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${API_BASE}/departement`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: newName,
          description: newDescription,
          managerId: newManagerId || null,
        }),
      });

      if (!res.ok) throw new Error('Erreur lors de la création');
      await fetchData();
      resetForm();
      setOpenCreate(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = async () => {
    if (!newName.trim() || !selectedDept) return;
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${API_BASE}/departement/${selectedDept._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: newName,
          description: newDescription,
          managerId: newManagerId || null,
        }),
      });

      if (!res.ok) throw new Error('Erreur lors de la modification');
      await fetchData();
      resetForm();
      setOpenEdit(false);
      setSelectedDept(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    if (!window.confirm("Supprimer ce département ?")) return;

    try {
      const res = await fetch(`${API_BASE}/departement/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Erreur lors de la suppression');
      setDepartments(prev => prev.filter(d => d._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const openEditDialog = (dep) => {
    setSelectedDept(dep);
    setNewName(dep.name);
    setNewDescription(dep.description);
    setNewManagerId(dep.managerId?._id || '');
    setOpenEdit(true);
  };

  return (
    <Box p={2}>

      {/* HEADER RESPONSIVE */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
        flexDirection={{ xs: "column", md: "row" }}
        gap={2}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          color="#4caf50"
          textAlign={{ xs: "center", md: "left" }}
        >
          <BusinessIcon style={{ marginBottom: -4, marginRight: 8 }} />
          Départements
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenCreate(true)}
          sx={{
            backgroundColor: "#57E613",
            "&:hover": { backgroundColor: "#4cc210" },
          }}
        >
          Nouveau département
        </Button>
      </Box>

      {/* LISTE DES DEPARTEMENTS */}
      <Grid container spacing={3} justifyContent="center">
        {departments.map(dep => {
          const stats = getStats(dep._id);
          const manager = users.find(u => u._id === (dep.managerId?._id || dep.managerId));

          return (
            <Grid item xs={12} sm={10} md={6} lg={4} key={dep._id}>
              <StatCard
                dep={dep}
                manager={manager}
                stats={stats}
                openEditDialog={openEditDialog}
                handleDelete={handleDelete}
              />
            </Grid>
          );
        })}
      </Grid>

      {/* CREATION */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} fullWidth maxWidth="sm">
        <DialogTitle>Nouveau département</DialogTitle>
        <DialogContent>
          <DeptForm {...{ newName, newDescription, newManagerId, setNewName, setNewDescription, setNewManagerId, users }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreate(false)}>Annuler</Button>
          <Button
            variant="contained"
            onClick={handleCreate}
            sx={{
              backgroundColor: '#57E613',
              '&:hover': { backgroundColor: '#4cc210' },
            }}
          >
            Créer
          </Button>
        </DialogActions>
      </Dialog>

      {/* EDITION */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth maxWidth="sm">
        <DialogTitle>Modifier département</DialogTitle>
        <DialogContent>
          <DeptForm {...{ newName, newDescription, newManagerId, setNewName, setNewDescription, setNewManagerId, users }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Annuler</Button>
          <Button
            variant="contained"
            onClick={handleEdit}
            sx={{
              backgroundColor: '#4caf50',
              '&:hover': { backgroundColor: '#4cc210' },
            }}
          >
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

/* COMPONENTS */

function StatCard({ dep, manager, stats, openEditDialog, handleDelete }) {
  const router = useRouter();

  return (
    <Paper
      sx={{
        p: 3,
        position: 'relative',
        borderRadius: 3,
        backgroundColor: '#f9f9f9',
        boxShadow: 3,
        transition: '0.3s',
        '&:hover': { boxShadow: 6 },
      }}
    >
      <Typography variant="h6" gutterBottom color="#4caf50">{dep.name}</Typography>
      <Typography variant="body2" color="#4caf50">
        Créé le {new Date(dep.createdAt).toLocaleDateString('fr-FR')}
      </Typography>

      <Box mt={2}>
        <Typography variant="subtitle2">Manager</Typography>
        <Typography variant="body2">
          {manager ? `${manager.nom}` : 'Aucun'}
        </Typography>
      </Box>

      <Box mt={2}>
        <Typography variant="subtitle2">Effectifs</Typography>
        <Typography variant="body2" sx={{ mt: 0.5 }}>
          <strong style={{ color: '#57E613' }}>CDI</strong>: {stats.cdi} &nbsp;|&nbsp;
          <strong style={{ color: '#2196f3' }}>CDD</strong>: {stats.cdd} &nbsp;|&nbsp;
          <strong style={{ color: '#ff9800' }}>Stage</strong>: {stats.stage}
        </Typography>
      </Box>

      <Box mt={3} display="flex" justifyContent="space-between" flexWrap="wrap" gap={1}>
        <Button
          variant="outlined"
          size="small"
          onClick={() => router.push(`/with-sidebar/departement/${dep._id}/team`)}
          sx={{
            color: '#57E613',
            borderColor: '#57E613',
            '&:hover': {
              backgroundColor: 'rgba(87, 230, 19, 0.08)',
              borderColor: '#4cc210',
              color: '#4cc210'
            }
          }}
        >
          Voir l&apos;équipe
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={() => openEditDialog(dep)}
          sx={{
            backgroundColor: '#4caf50',
            '&:hover': { backgroundColor: '#4cc210' }
          }}
        >
          Modifier
        </Button>
      </Box>

      <Box position="absolute" top={8} right={8}>
        <IconButton onClick={() => openEditDialog(dep)}><EditIcon /></IconButton>
        <IconButton onClick={() => handleDelete(dep._id)}><DeleteIcon /></IconButton>
      </Box>
    </Paper>
  );
}

function DeptForm({ newName, newDescription, newManagerId, setNewName, setNewDescription, setNewManagerId, users }) {
  return (
    <>
      <TextField fullWidth label="Nom du département" value={newName} onChange={e => setNewName(e.target.value)} margin="normal" />
      <TextField fullWidth label="Description" value={newDescription} onChange={e => setNewDescription(e.target.value)} margin="normal" multiline rows={3} />
      <FormControl fullWidth margin="normal">
        <InputLabel>Manager (optionnel)</InputLabel>
        <Select value={newManagerId} onChange={e => setNewManagerId(e.target.value)}>
          <MenuItem value="">Aucun</MenuItem>
          {users.map(user => (
            <MenuItem key={user._id} value={user._id}>
              {user.nom} {user.prenom}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
}
