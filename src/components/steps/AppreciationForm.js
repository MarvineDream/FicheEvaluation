"use client";

import { useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

const niveaux = [
  "Objectifs atteints",
  "Objectifs moyennement atteints",
  "Objectifs non atteints",
  "Objectifs dépassés",
];

const AppreciationForm = ({ value, onChange, objectifsFixes = [], objectifsHorsFixes = [] }) => {
  // Fonction pour calculer score pondéré à partir d'objectifs (tableau)
  const calculerScore = (objectifs) => {
    if (!Array.isArray(objectifs) || objectifs.length === 0) return 0;

    let totalPondere = 0;
    let totalPourcentage = 0;

    objectifs.forEach((objectif) => {
      objectif.taches?.forEach((tache) => {
        const note = parseFloat(tache.note || 0);
        const poids = parseFloat(tache.pourcentage || 0);
        totalPondere += note * poids;
        totalPourcentage += poids;
      });
    });

    return totalPourcentage > 0 ? totalPondere / totalPourcentage : 0;
  };

  useEffect(() => {
    const scoreObjectifs = calculerScore(objectifsFixes);
    const scoreHorsObjectifs = calculerScore(objectifsHorsFixes);

    const moyenne = (scoreObjectifs + scoreHorsObjectifs) / ( 
      (scoreObjectifs > 0 ? 1 : 0) + (scoreHorsObjectifs > 0 ? 1 : 0)
    ) || 0;

    const newValue = {
      ...value,
      poste: scoreObjectifs.toFixed(2),
      horsPoste: scoreHorsObjectifs.toFixed(2),
      moyenneGlobale: moyenne.toFixed(2),
    };

    // Mise à jour seulement si changement (éviter boucle infinie)
    if (
      value.poste !== newValue.poste ||
      value.horsPoste !== newValue.horsPoste ||
      value.moyenneGlobale !== newValue.moyenneGlobale
    ) {
      onChange(newValue);
    }
  }, [objectifsFixes, objectifsHorsFixes, onChange, value]);

  const handleChange = (field, val) => {
    const updated = { ...value, [field]: val };
    onChange(updated);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        🌟 Appréciation Globale
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Score Objectifs (%)"
            type="number"
            fullWidth
            value={value.poste || ""}
            InputProps={{ readOnly: true }}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            label="Score Hors Objectifs (%)"
            type="number"
            fullWidth
            value={value.horsPoste || ""}
            InputProps={{ readOnly: true }}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            label="Moyenne Globale"
            type="number"
            fullWidth
            value={value.moyenneGlobale || ""}
            InputProps={{ readOnly: true }}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Niveau d’atteinte</InputLabel>
            <Select
              value={value.niveauAtteinte || ""}
              onChange={(e) => handleChange("niveauAtteinte", e.target.value)}
              label="Niveau d’atteinte"
            >
              {niveaux.map((n) => (
                <MenuItem key={n} value={n}>
                  {n}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Commentaire du manager"
            fullWidth
            multiline
            minRows={3}
            value={value.commentaireManager || ""}
            onChange={(e) => handleChange("commentaireManager", e.target.value)}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AppreciationForm;
