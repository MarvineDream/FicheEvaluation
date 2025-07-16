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

const API_BASE = 'https://backendeva.onrender.com';

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

    if (!token) {
      console.error("Token manquant");
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [depsRes, empRes, usersRes] = await Promise.all([
        fetch(`${API_BASE}/departement`, { headers }),
        fetch(`${API_BASE}/staff/All`, { headers }),
        fetch(`${API_BASE}/auth/users`, { headers }),
      ]);

      if (!depsRes.ok || !empRes.ok || !usersRes.ok) {
        throw new Error('Erreur lors du chargement des données');
      }

      const depsData = await depsRes.json();
      const empData = await empRes.json();
      const usersData = await usersRes.json(); 

      setUsers(usersData); 
      setDepartments(depsData);
      setEmployees(empData);
    } catch (error) {
      console.error("Erreur fetchData:", error);
      alert("Erreur réseau ou réponse invalide");
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

  console.log(`[getStats] Département ${depId} → ${filtered.length} employés trouvés`);

  const cdi = filtered.filter(e => e.typeContrat === 'CDI').length;
const cdd = filtered.filter(e => e.typeContrat === 'CDD').length;
const stage = filtered.filter(e => e.typeContrat === 'Stagiaire').length;

  console.log(`[getStats] CDI: ${cdi}, CDD: ${cdd}, Stage: ${stage}`);

  return { cdi, cdd, stage };
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
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
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
      alert("Erreur lors de la création");
    }
  };

  const handleEdit = async () => {
    if (!newName.trim() || !selectedDept) return;

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE}/departement/${selectedDept._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
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
      alert("Erreur lors de la modification");
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
      alert("Erreur lors de la suppression");
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
      <Box p={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold" color="primary">
          <BusinessIcon style={{ marginBottom: -4, marginRight: 8 }} />
          Départements
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenCreate(true)}>
          Nouveau département
        </Button>
      </Box>

      <Grid container spacing={2} mb={4}>
        <Grid item xs={12} md={3}>
          <StatCard label="Départements" value={departments.length} />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard label="Employés" value={employees.length} />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard label="Avec Manager" value={departments.filter(d => d.managerId).length} />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            label="Moyenne / Département"
            value={departments.length ? Math.round(employees.length / departments.length) : 0}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {departments.map(dep => {
          const stats = getStats(dep._id);
          const manager = users.find(u => u._id === (dep.managerId?._id || dep.managerId));

          return (
            <Grid item xs={12} md={6} lg={4} key={dep._id}>
              <StatCard 
                key={dep._id} 
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

      <Dialog open={openCreate} onClose={() => setOpenCreate(false)}>
        <DialogTitle>Nouveau département</DialogTitle>
        <DialogContent>
          <DeptForm {...{ newName, newDescription, newManagerId, setNewName, setNewDescription, setNewManagerId, users }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreate(false)}>Annuler</Button>
          <Button variant="contained" onClick={handleCreate}>Créer</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>Modifier département</DialogTitle>
        <DialogContent>
          <DeptForm {...{ newName, newDescription, newManagerId, setNewName, setNewDescription, setNewManagerId, users }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Annuler</Button>
          <Button variant="contained" onClick={handleEdit}>Enregistrer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function StatCard({ dep, manager, stats, openEditDialog, handleDelete }) {
  const router = useRouter();


  if (!dep) {
    return null; // Ne rien rendre si dep est undefined
  }

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
      <Typography variant="h6" gutterBottom color="primary">{dep.name}</Typography>
      <Typography variant="body2" color="text.secondary">
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
          <strong style={{ color: '#4caf50' }}>CDI</strong>: {stats.cdi} &nbsp;|&nbsp;
          <strong style={{ color: '#2196f3' }}>CDD</strong>: {stats.cdd} &nbsp;|&nbsp;
          <strong style={{ color: '#ff9800' }}>Stage</strong>: {stats.stage}
        </Typography>
      </Box>

      <Box mt={3} display="flex" justifyContent="space-between">
        <Button 
          variant="outlined" 
          size="small" 
          onClick={() => router.push(`/departement/${dep._id}/team`)}

        >
          Voir l&apos;équipe
        </Button>
        <Button 
          variant="contained" 
          size="small" 
          onClick={() => openEditDialog(dep)}
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
      <TextField
        fullWidth label="Nom du département" value={newName}
        onChange={e => setNewName(e.target.value)} margin="normal"
      />
      <TextField
        fullWidth label="Description" value={newDescription}
        onChange={e => setNewDescription(e.target.value)} margin="normal"
      />
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

