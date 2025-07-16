"use client";

import React from "react";
import { Grid, TextField, Typography } from "@mui/material";

const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toISOString().split("T")[0];
};

const AgentInfoForm = ({ value }) => {
  return (
    <>
      <Typography variant="h6" gutterBottom>
        🧑 Informations de l’agent
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField label="Nom" fullWidth value={value?.nom || ""} disabled />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField label="Prénom" fullWidth value={value?.prenom || ""} disabled />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField label="Email" fullWidth value={value?.email || ""} disabled />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField label="Poste" fullWidth value={value?.emploi || ""} disabled />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField label="Département" fullWidth value={value?.direction || ""} disabled />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField label="Type de contrat" fullWidth value={value?.typeContrat || ""} disabled />
        </Grid>

        {(value?.typeContrat === "CDI" || value?.typeContrat === "CDD") && (
          <>
            <Grid item xs={12} sm={6}>
              <TextField label="Date d'embauche" fullWidth value={formatDate(value?.dateEmbauche)} disabled />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Date de fin de contrat" fullWidth value={formatDate(value?.dateFinContrat)} disabled />
            </Grid>
          </>
        )}

        {value?.typeContrat === "Stagiaire" && (
          <>
            <Grid item xs={12} sm={6}>
              <TextField label="Date de début de stage" fullWidth value={formatDate(value?.dateDebutStage)} disabled />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Date de fin de stage" fullWidth value={formatDate(value?.dateFinStage)} disabled />
            </Grid>
          </>
        )}
      </Grid>
    </>
  );
};

export default AgentInfoForm;
