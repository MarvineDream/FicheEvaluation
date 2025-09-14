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

// Niveaux qualitatifs
const niveaux = [
  "Objectifs atteints",
  "Objectifs moyennement atteints",
  "Objectifs faiblement atteints",
  "Objectifs non atteints",
];

// Table de correspondance notes textuelles → valeurs numériques
const noteValues = {
  "Très Bien": 5,
  "Bien": 4,
  "Passable": 3,
  "Insuffisant": 2,
  "Pas Concerné": 1,
};

const AppreciationForm = ({
  value,
  onChange,
  objectifsFixes = [],
  objectifsHorsFixes = [],
  competences = {},
}) => {
  // 🔹 Calcul score pondéré des objectifs (fixes ou hors)
  const calculerScoreObjectifs = (objectifs) => {
    if (!Array.isArray(objectifs) || objectifs.length === 0) return 0;

    let total = 0;
    let totalPoids = 0;

    objectifs.forEach((objectif) => {
      objectif.sousTaches?.forEach((tache) => {
        const note = noteValues[tache.note] || parseFloat(tache.note) || 0;
        const poids = parseFloat(objectif.pourcentage || 0);
        total += note * (poids / 100);
        totalPoids += poids / 100;
      });
    });

    return totalPoids > 0 ? total / totalPoids : 0;
  };

  // 🔹 Calcul score moyen compétences
  const calculerScoreCompetences = () => {
    const notes = [];
    Object.keys(competences).forEach((cat) => {
      competences[cat].forEach((c) => {
        if (c.note) {
          const val = noteValues[c.note] || parseFloat(c.note) || 0;
          if (val > 0) notes.push(val);
        }
      });
    });
    return notes.length ? notes.reduce((a, b) => a + b, 0) / notes.length : 0;
  };

  // 🔹 Déterminer le niveau d’atteinte en fonction de la moyenne
  const calculerNiveauAtteinte = (moyenne) => {
    if (moyenne >= 4.5) return "Objectifs atteints";       // ~100%
    if (moyenne >= 3.5) return "Objectifs moyennement atteints"; // ~85%
    if (moyenne >= 2.5) return "Objectifs faiblement atteints"; // ~51%
    return "Objectifs non atteints";                        // <50%
  };

  // 🔹 Mise à jour automatique des scores
  useEffect(() => {
    const scoreFixes = calculerScoreObjectifs(objectifsFixes);
    const scoreHors = calculerScoreObjectifs(objectifsHorsFixes); // bonus
    const scoreComp = calculerScoreCompetences();

    // Moyenne globale pondérée : Objectifs 80%, Compétences 20%
    const moyenneGlobale = scoreFixes * 0.8 + scoreComp * 0.2;

    const newValue = {
      ...value,
      poste: scoreFixes.toFixed(2),
      horsPoste: scoreHors.toFixed(2),
      competences: scoreComp.toFixed(2),
      moyenneGlobale: moyenneGlobale.toFixed(2),
      niveauAtteinte: calculerNiveauAtteinte(moyenneGlobale),
    };

    if (JSON.stringify(value) !== JSON.stringify(newValue)) {
      onChange(newValue);
    }
  }, [objectifsFixes, objectifsHorsFixes, competences]);

  // 🔹 Gestion des champs éditables
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
            label="Score Objectifs Fixes"
            fullWidth
            value={value.poste || ""}
            InputProps={{ readOnly: true }}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            label="Score Compétences"
            fullWidth
            value={value.competences || ""}
            InputProps={{ readOnly: true }}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            label="Moyenne Globale"
            fullWidth
            value={value.moyenneGlobale || ""}
            InputProps={{ readOnly: true }}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            label="Score Objectifs Hors Poste (Bonus)"
            fullWidth
            value={value.horsPoste || ""}
            InputProps={{ readOnly: true }}
            helperText="Score hors poste utilisé comme indicateur pour promotion"
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
