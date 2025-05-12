"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
  Paper,
  Alert
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const API_URL = "https://backendeva.onrender.com";

export default function StaffPage() {
  const [staffs, setStaffs] = useState([]);
  const [filterDept, setFilterDept] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    poste: "",
    departement: "",
    typeContrat: "CDD",
    dateEmbauche: "",
    dateFinContrat: ""
  });

  const fetchUserRole = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API_URL}/staff/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("Erreur lors de la récupération du rôle");

      const data = await res.json();
      setUserRole(data.role || "");
    } catch (error) {
      console.error(error);
      setError("Impossible de récupérer le rôle de l'utilisateur.");
    }
  };

  const fetchStaff = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      let route = "/staff/Manager";
      if (userRole === "RH" || userRole === "admin") {
        route = "/staff/All";
      }

      const res = await fetch(`${API_URL}${route}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("Erreur lors de la récupération du staff");

      const data = await res.json();
      setStaffs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setError("Erreur de chargement des données du personnel.");
    }
  };

  useEffect(() => {
    fetchUserRole();
  }, []);

  useEffect(() => {
    if (userRole) fetchStaff();
  }, [userRole]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `${API_URL}/staff/${editingId}`
      : `${API_URL}/staff`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      if (!res.ok) throw new Error("Erreur lors de l'enregistrement.");

      setForm({
        nom: "",
        prenom: "",
        email: "",
        poste: "",
        departement: "",
        typeContrat: "CDD",
        dateEmbauche: "",
        dateFinContrat: ""
      });
      setEditingId(null);
      setDrawerOpen(false);
      setError("");
      fetchStaff();
    } catch (err) {
      console.error(err);
      setError("Erreur lors de l'ajout ou modification du staff.");
    }
  };

  // Fonction utilitaire pour convertir dd/MM/yyyy → yyyy-MM-dd
const convertToISO = (dateStr) => {
  if (!dateStr) return "";
  const [day, month, year] = dateStr.split("/");
  return `${year}-${month}-${day}`;
};

const handleEdit = (staff) => {
  setForm({
    nom: staff.nom,
    prenom: staff.prenom || "",
    email: staff.email,
    poste: staff.poste,
    departement: staff.departement,
    typeContrat: staff.typeContrat,
    dateEmbauche: staff.dateEmbauche
      ? convertToISO(staff.dateEmbauche)
      : "",
    dateFinContrat: staff.dateFinContrat
      ? convertToISO(staff.dateFinContrat)
      : "",
  });
  setEditingId(staff._id);
  setDrawerOpen(true);
  setError("");
};

  const handleDelete = async (id) => {
    const confirmDelete = confirm("Supprimer ce membre du staff ?");
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/staff/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("Erreur lors de la suppression.");
      fetchStaff();
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la suppression du membre.");
    }
  };

  const filteredStaffs = staffs.filter((s) =>
    s.departement.toLowerCase().includes(filterDept.toLowerCase())
  );

  const columns = [
    { field: "nom", headerName: "Nom", flex: 1 },
    { field: "prenom", headerName: "Prénom", flex: 1 },
    { field: "email", headerName: "Email", flex: 1.5 },
    { field: "poste", headerName: "Poste", flex: 1 },
    { field: "departement", headerName: "Département", flex: 1 },
    { field: "typeContrat", headerName: "Contrat", flex: 1 },
    {
      field: "dateEmbauche",
      headerName: "date Embauche",
      flex: 1,
      valueFormatter: (params) =>
        new Date(params.value).toLocaleDateString("fr-FR")
    },
    {
      field: "dateFinContrat",
      headerName: "Fin Contrat",
      flex: 1,
      valueFormatter: (params) =>
        params.value ? new Date(params.value).toLocaleDateString("fr-FR") : "-"
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleEdit(params.row)}>
            <EditIcon color="primary" />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row._id)}>
            <DeleteIcon color="error" />
          </IconButton>
        </>
      )
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Gestion du Personnel
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <TextField
          label="Filtrer par département"
          value={filterDept}
          onChange={(e) => setFilterDept(e.target.value)}
          sx={{ width: "50%" }}
        />
        <Button variant="contained" onClick={() => setDrawerOpen(true)}>
          Ajouter un membre
        </Button>
      </Box>

      <Paper elevation={3} sx={{ height: 550 }}>
        <DataGrid
          rows={filteredStaffs}
          columns={columns}
          getRowId={(row) => row._id}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
          disableSelectionOnClick
        />
      </Paper>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 400, p: 3 }}>
          <Typography variant="h6" gutterBottom>
            {editingId ? "Modifier le staff" : "Ajouter un membre"}
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField name="nom" label="Nom" value={form.nom} onChange={handleChange} fullWidth required sx={{ mb: 2 }} />
            <TextField name="prenom" label="Prénom" value={form.prenom} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
            <TextField name="email" label="Email" value={form.email} onChange={handleChange} fullWidth required sx={{ mb: 2 }} />
            <TextField name="poste" label="Poste" value={form.poste} onChange={handleChange} fullWidth required sx={{ mb: 2 }} />
            <TextField name="departement" label="Département" value={form.departement} onChange={handleChange} fullWidth required sx={{ mb: 2 }} />
            <Select
              name="typeContrat"
              value={form.typeContrat}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
            >
              <MenuItem value="CDD">CDD</MenuItem>
              <MenuItem value="CDI">CDI</MenuItem>
              <MenuItem value="Stagiaire">Stagiaire</MenuItem>
            </Select>
            <TextField
              name="dateEmbauche"
              label="Date d'embauche"
              type="date"
              value={form.dateEmbauche}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
            <TextField
              name="dateFinContrat"
              label="Date de fin de contrat"
              type="date"
              value={form.dateFinContrat}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
            <Button type="submit" variant="contained" fullWidth>
              {editingId ? "Modifier" : "Ajouter"}
            </Button>
          </form>
        </Box>
      </Drawer>
    </Container>
  );
}
