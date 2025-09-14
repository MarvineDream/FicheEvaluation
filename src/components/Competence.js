"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  MenuItem,
  InputLabel,
  Select,
  FormControl,
  Paper,
  Divider,
  LinearProgress,
} from "@mui/material";

// Options de notes
export const noteOptions = [
  "Très Bien",
  "Bien",
  "Passable",
  "Insuffisant",
  "Pas Concerné",
];

// Table de correspondance
const noteValues = {
  "Très Bien": 5,
  "Bien": 4,
  "Passable": 3,
  "Insuffisant": 2,
  "Pas Concerné": null,
};

// Catégories
const categories = [
  { key: "savoir", label: "Savoir" },
  { key: "savoirFaire", label: "Savoir-Faire" },
  { key: "savoirEtre", label: "Savoir-Être" },
  { key: "discipline", label: "Discipline" },
];

// ✅ Données par défaut avec description
const defaultCompetences = {
  savoir: [
    {
      critere: "Connaissances théoriques",
      description: "Maîtrise des concepts essentiels",
      note: "",
      axeAmelioration: "",
    },
  ],
  savoirFaire: [
    {
      critere: "Application pratique",
      description: "Capacité à mettre en pratique ses connaissances",
      note: "",
      axeAmelioration: "",
    },
  ],
  savoirEtre: [
    {
      critere: "Comportement professionnel",
      description: "Attitude et esprit d'équipe",
      note: "",
      axeAmelioration: "",
    },
  ],
  discipline: [
    {
      critere: "Respect des règles",
      description: "Ponctualité et rigueur dans le travail",
      note: "",
      axeAmelioration: "",
    },
  ],
};

const CompetencesForm = ({ value, onChange }) => {
  const [competences, setCompetences] = useState(
    () => value || defaultCompetences
  );
  const isFirstRender = useRef(true);

  // Sync avec le parent
  useEffect(() => {
    if (!deepEqual(competences, value)) {
      setCompetences(value || defaultCompetences);
    }
  }, [value, competences]);

  // Notify parent après le premier rendu
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (onChange && !deepEqual(competences, value)) {
      onChange(competences);
    }
  }, [competences, onChange, value]);

  // Mise à jour d'un champ
  const handleChange = (categorie, index, field, val) => {
    setCompetences((prev) => {
      const updatedCategorie = [...(prev[categorie] || [])];
      updatedCategorie[index] = {
        ...updatedCategorie[index],
        [field]: val,
      };
      return { ...prev, [categorie]: updatedCategorie };
    });
  };

  // Calcul des scores
  const { sectionScores, globalScore } = useMemo(() => {
    const scores = {};
    let allNotes = [];

    categories.forEach(({ key }) => {
      const items = competences[key] || [];
      const notes = items
        .map((item) =>
          item.note && item.note !== "Pas Concerné"
            ? noteValues[item.note]
            : null
        )
        .filter((v) => v !== null);

      if (notes.length > 0) {
        const avg = notes.reduce((a, b) => a + b, 0) / notes.length;
        scores[key] = Math.round((avg / 5) * 100);
        allNotes.push(...notes);
      } else {
        scores[key] = null;
      }
    });

    const global =
      allNotes.length > 0
        ? Math.round(
            (allNotes.reduce((a, b) => a + b, 0) / allNotes.length / 5) * 100
          )
        : null;

    return { sectionScores: scores, globalScore: global };
  }, [competences]);

  // Rendu section
  const renderSection = (label, key, data = []) => (
    <Paper
      elevation={2}
      sx={{ p: 3, mb: 5, borderRadius: 2, backgroundColor: "#fff" }}
    >
      <Typography
        variant="h6"
        gutterBottom
        sx={{ color: "primary.main", fontWeight: "bold" }}
      >
        {label}
      </Typography>

      {data.length === 0 ? (
        <Typography color="text.secondary">Aucune donnée</Typography>
      ) : (
        data.map((item, index) => {
          const noteId = `${key}-${index}-note`;
          return (
            <Box
              key={`${key}-${index}`}
              sx={{
                mb: 3,
                p: 2,
                border: "1px solid #eee",
                borderRadius: 1,
                backgroundColor: "#fafafa",
              }}
            >
              <Grid container spacing={2} alignItems="center">
                {/* Critère + description */}
                <Grid item xs={12} md={4}>
                  <Typography fontWeight="bold">{item.critere}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description || "Description manquante"}
                  </Typography>
                </Grid>

                {/* Note */}
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel id={`${noteId}-label`}>Note</InputLabel>
                    <Select
                      labelId={`${noteId}-label`}
                      id={noteId}
                      value={item.note || ""}
                      label="Note"
                      onChange={(e) =>
                        handleChange(key, index, "note", e.target.value)
                      }
                    >
                      {noteOptions.map((note) => (
                        <MenuItem key={note} value={note}>
                          {note}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Axe d'amélioration */}
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Axe d'amélioration"
                    fullWidth
                    size="small"
                    value={item.axeAmelioration || ""}
                    onChange={(e) =>
                      handleChange(key, index, "axeAmelioration", e.target.value)
                    }
                  />
                </Grid>
              </Grid>
            </Box>
          );
        })
      )}

      {/* Score section */}
      <Box sx={{ mt: 2 }}>
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: "bold", textAlign: "right" }}
        >
          Score {label} :{" "}
          {sectionScores[key] !== null
            ? `${sectionScores[key]}%`
            : "Non évalué"}
        </Typography>
        {sectionScores[key] !== null && (
          <LinearProgress
            variant="determinate"
            value={sectionScores[key]}
            sx={{ height: 8, borderRadius: 5, mt: 1 }}
          />
        )}
      </Box>
    </Paper>
  );

  return (
    <Box sx={{ width: "100%", maxWidth: 1100, mx: "auto", px: 2, py: 4 }}>
      {categories.map(({ label, key }) =>
        renderSection(label, key, competences[key])
      )}

      <Divider sx={{ my: 3 }} />

      {/* Score global */}
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
          Score global compétences :{" "}
          {globalScore !== null ? `${globalScore}%` : "Non évalué"}
        </Typography>
        {globalScore !== null && (
          <LinearProgress
            variant="determinate"
            value={globalScore}
            sx={{ height: 12, borderRadius: 6 }}
          />
        )}
      </Box>
    </Box>
  );
};

// Comparaison profonde
function deepEqual(a, b) {
  if (a === b) return true;
  if (!a || !b || typeof a !== "object" || typeof b !== "object") return false;
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (const key of keysA) {
    const valA = a[key],
      valB = b[key];
    if (Array.isArray(valA) && Array.isArray(valB)) {
      if (valA.length !== valB.length) return false;
      for (let i = 0; i < valA.length; i++)
        if (!deepEqual(valA[i], valB[i])) return false;
    } else if (!deepEqual(valA, valB)) return false;
  }
  return true;
}

export default CompetencesForm;
