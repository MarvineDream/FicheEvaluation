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
  Paper
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const API_URL = "https://backendeva.onrender.com/staff";

export default function StaffPage() {
  const [staffs, setStaffs] = useState([]);
  const [filterDept, setFilterDept] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

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

  const fetchStaff = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/manager`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setStaffs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erreur de chargement du staff :", error);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

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
    fetchStaff();
  };

  const handleEdit = (staff) => {
    setForm({
      nom: staff.nom,
      prenom: staff.prenom || "",
      email: staff.email,
      poste: staff.poste,
      departement: staff.departement,
      typeContrat: staff.typeContrat,
      dateEmbauche: staff.dateEmbauche?.substring(0, 10),
      dateFinContrat: staff.dateFinContrat?.substring(0, 10) || ""
    });
    setEditingId(staff._id);
    setDrawerOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Supprimer ce membre du staff ?")) {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      fetchStaff();
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
      headerName: "Embauche",
      flex: 1,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString()
    },
    {
      field: "dateFinContrat",
      headerName: "Fin Contrat",
      flex: 1,
      valueFormatter: (params) =>
        params.value ? new Date(params.value).toLocaleDateString() : "-"
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
