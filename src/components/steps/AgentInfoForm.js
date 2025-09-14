"use client";

import React, { useEffect } from "react";
import { Grid, TextField, Typography, MenuItem } from "@mui/material";

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return !isNaN(date) ? date.toISOString().split("T")[0] : "";
};

// 🔹 Fonction pour calculer l’ancienneté en mois
const calculerAnciennete = (dateEmbauche) => {
  if (!dateEmbauche) return "";
  const debut = new Date(dateEmbauche);
  const maintenant = new Date();
  if (isNaN(debut)) return "";
  const mois =
    (maintenant.getFullYear() - debut.getFullYear()) * 12 +
    (maintenant.getMonth() - debut.getMonth());
  return mois >= 0 ? mois : 0;
};

const AgentInfoForm = ({ value, onChange, staff }) => {
  const handleChange = (field, newValue) => {
    if (onChange) {
      onChange({ ...value, [field]: newValue });
    }
  };

  // ✅ Pré-remplir les infos depuis staff
  useEffect(() => {
    if (!staff) return;

    const prefilled = {
      nom: staff.nom || value?.nom,
      prenom: staff.prenom || value?.prenom,
      emploi: staff.poste || value?.emploi,
      direction:
        (typeof staff.departement === "string"
          ? staff.departement
          : staff.departement?.nom) || value?.direction,
      superieur:
        staff.managerId?.nom
          ? `${staff.managerId.nom} ${staff.managerId.prenom || ""}`
          : value?.superieur,
      typeContrat: staff.typeContrat || value?.typeContrat,
      dateEmbauche: staff.dateEmbauche || value?.dateEmbauche,
      matricule: staff.matricule || value?.matricule,
      telephone: staff.telephone || value?.telephone,
    };

    if (onChange) {
      onChange({ ...value, ...prefilled });
    }
  }, [staff]);

  // ✅ Calcul automatique de l’ancienneté quand dateEmbauche change
  useEffect(() => {
    if (value?.dateEmbauche) {
      const mois = calculerAnciennete(value.dateEmbauche);
      if (mois !== value?.anciennete) {
        handleChange("anciennete", mois);
      }
    }
  }, [value?.dateEmbauche]);

  return (
    <>
      <Typography variant="h6" gutterBottom>
        1. Informations de l’agent évalué
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Nom"
            fullWidth
            value={value?.nom || ""}
            onChange={(e) => handleChange("nom", e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Prénom"
            fullWidth
            value={value?.prenom || ""}
            onChange={(e) => handleChange("prenom", e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Matricule"
            fullWidth
            value={value?.matricule || ""}
            onChange={(e) => handleChange("matricule", e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Téléphone"
            fullWidth
            value={value?.telephone || ""}
            onChange={(e) => handleChange("telephone", e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Emploi occupé"
            fullWidth
            value={value?.emploi || ""}
            onChange={(e) => handleChange("emploi", e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Direction"
            fullWidth
            value={value?.direction || ""}
            onChange={(e) => handleChange("direction", e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Classification"
            fullWidth
            value={value?.classification || ""}
            onChange={(e) => handleChange("classification", e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Échelon / Grade"
            fullWidth
            value={value?.echelon || ""}
            onChange={(e) => handleChange("echelon", e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Supérieur hiérarchique"
            fullWidth
            value={value?.superieur || ""}
            onChange={(e) => handleChange("superieur", e.target.value)}
          />
        </Grid>

        {/* ✅ Type de contrat en Select */}
        <Grid item xs={12} sm={6}>
          <TextField
            select
            label="Type de contrat"
            fullWidth
            value={value?.typeContrat || ""}
            onChange={(e) => handleChange("typeContrat", e.target.value)}
            required
          >
            <MenuItem value="CDD">CDD</MenuItem>
            <MenuItem value="CDI">CDI</MenuItem>
            <MenuItem value="Stagiaire">Stagiaire</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Date d’embauche"
            type="date"
            fullWidth
            value={formatDate(value?.dateEmbauche)}
            onChange={(e) => handleChange("dateEmbauche", e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        {/* ✅ Ancienneté calculée automatiquement */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Ancienneté (mois)"
            fullWidth
            value={value?.anciennete || ""}
            InputProps={{ readOnly: true }}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default AgentInfoForm;
