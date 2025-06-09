"use client";

import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  Drawer,
  IconButton,
  MenuItem,
  Select,
  Alert
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EvaluationStepper from '@/components/EvaluationStepper';

const API_URL = "http://localhost:7000";

export default function StaffPage() {
  const [staffs, setStaffs] = useState([]);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [error, setError] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);

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

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      setUserRole(parsed.role);
    }
  }, []);

  useEffect(() => {
    if (!userRole) return;

    const fetchStaff = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const route = userRole === "RH" || userRole === "admin" ? "/staff/All" : "/staff/manager";

        const res = await fetch(`${API_URL}${route}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();
        setStaffs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("Erreur de chargement du personnel");
      }
    };

    fetchStaff();
  }, [userRole]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API_URL}/staff/${editingId}` : `${API_URL}/staff`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      if (!res.ok) throw new Error("Erreur lors de l'enregistrement");

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
      window.location.reload();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (staff) => {
    setForm({
      nom: staff.nom,
      prenom: staff.prenom || "",
      email: staff.email,
      poste: staff.poste,
      departement: staff.departement,
      typeContrat: staff.typeContrat,
      dateEmbauche: staff.dateEmbauche?.substring(0, 10) || "",
      dateFinContrat: staff.dateFinContrat?.substring(0, 10) || ""
    });
    setEditingId(staff._id);
    setDrawerOpen(true);
  };

  const handleDelete = async (id) => {
    if (userRole !== "RH" && userRole !== "admin") return;
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_URL}/staff/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("Erreur suppression");
      setStaffs(staffs.filter((s) => s._id !== id));
    } catch (err) {
      setError("Erreur de suppression");
    }
  };

  const columns = [
    { field: "nom", headerName: "Nom", flex: 1 },
    { field: "prenom", headerName: "Prénom", flex: 1 },
    { field: "email", headerName: "Email", flex: 1.5 },
    { field: "poste", headerName: "Poste", flex: 1 },
    { field: "departement", headerName: "Département", flex: 1 },
    { field: "typeContrat", headerName: "Contrat", flex: 1 },
    {
      field: "dateEmbauche", headerName: "Date Embauche", flex: 1,
      valueFormatter: (params) => {
        return params.value ? new Date(params.value).toLocaleDateString("fr-FR") : "-";
      }
    },
    {
      field: "dateFinContrat", headerName: "Fin Contrat", flex: 1,
      valueFormatter: (params) => {
        return params.value ? new Date(params.value).toLocaleDateString("fr-FR") : "-";
      }
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          {(userRole === "RH" || userRole === "admin") && (
            <>
              <IconButton onClick={() => handleEdit(params.row)}><EditIcon color="primary" /></IconButton>
              <IconButton onClick={() => handleDelete(params.row._id)}><DeleteIcon color="error" /></IconButton>
            </>
          )}
          <Button
            size="small"
            onClick={() => setSelectedStaff(params.row)}
            variant="outlined"
            color="success"
          >
            Évaluer
          </Button>
        </>
      )
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Gestion du Personnel</Typography>
      {error && <Alert severity="error">{error}</Alert>}

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <TextField
          label="Filtrer par département"
          value={filterDept}
          onChange={(e) => setFilterDept(e.target.value)}
        />
        {(userRole === "RH" || userRole === "admin") && (
          <Button variant="contained" onClick={() => setDrawerOpen(true)}>
            Ajouter
          </Button>
        )}
      </Box>

      <Paper sx={{ height: 500 }}>
        <DataGrid
          rows={staffs.filter((s) => s.departement.toLowerCase().includes(filterDept.toLowerCase()))}
          columns={columns}
          getRowId={(row) => row._id}
        />
      </Paper>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 400, p: 3 }}>
          <Typography variant="h6">{editingId ? "Modifier" : "Ajouter un membre"}</Typography>
          <form onSubmit={handleSubmit}>
            {["nom", "prenom", "email", "poste", "departement"].map((field) => (
              <TextField
                key={field}
                name={field}
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                value={form[field]}
                onChange={handleChange}
                fullWidth
                required
                sx={{ mb: 2 }}
              />
            ))}
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
              label="Fin de contrat"
              type="date"
              value={form.dateFinContrat}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
            <Button type="submit" fullWidth variant="contained">
              {editingId ? "Modifier" : "Ajouter"}
            </Button>
          </form>
        </Box>
      </Drawer>

      {selectedStaff && selectedStaff._id && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Évaluation de {selectedStaff.nom} {selectedStaff.prenom}
          </Typography>
          <EvaluationStepper
            staff={selectedStaff}
            periodeEvaluation="Annuel"
            token={localStorage.getItem("token")}
          />
          <Button sx={{ mt: 2 }} onClick={() => setSelectedStaff(null)}>
            Fermer l&apos;évaluation
          </Button>
        </Box>
      )}
    </Container>
  );
}
