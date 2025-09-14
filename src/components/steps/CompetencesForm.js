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
} from "@mui/material";
import initialCompetences from "@/components/steps/initialCompetences";

export const noteOptions = [
  { label: "Très Bien", value: 5 },
  { label: "Bien", value: 4 },
  { label: "Passable", value: 3 },
  { label: "Insuffisant", value: 2 },
  { label: "Pas Concerné", value: 1 },
];

// 🔧 Fusionne données initiales + value venant du parent
function mergeCompetences(value = {}) {
  return {
    savoir: value?.savoir?.length ? value.savoir : initialCompetences.savoir,
    savoirFaire: value?.savoirFaire?.length
      ? value.savoirFaire
      : initialCompetences.savoirFaire,
    savoirEtre: value?.savoirEtre?.length
      ? value.savoirEtre
      : initialCompetences.savoirEtre,
    valeursHardie: value?.valeursHardie?.length
      ? value.valeursHardie
      : initialCompetences.valeursHardie,
    discipline: value?.discipline?.length
      ? value.discipline
      : initialCompetences.discipline,
  };
}

const CompetencesForm = ({ value, onChange }) => {
  const [competences, setCompetences] = useState(() => mergeCompetences(value));
  const isFirstRender = useRef(true);

  // --- Synchronisation avec parent
  useEffect(() => {
    const merged = mergeCompetences(value);
    if (!deepEqual(competences, merged)) {
      setCompetences(merged);
    }
  }, [value]);

  // --- Notifie le parent
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (onChange && !deepEqual(competences, value)) {
      onChange(competences);
    }
  }, [competences, onChange]);

  // --- Mise à jour locale
  const handleChange = (categorie, index, field, val) => {
    setCompetences((prev) => {
      const updatedCategorie = [...(prev[categorie] || [])];
      updatedCategorie[index] = { ...updatedCategorie[index], [field]: val };
      return { ...prev, [categorie]: updatedCategorie };
    });
  };

  // ✅ Calcul note par bloc
  const calculerNoteBloc = (bloc = []) => {
    const notes = bloc
      .map((item) => Number(item.note) || 0)
      .filter((n) => n > 0); // ignore vides
    if (notes.length === 0) return 0;
    return (notes.reduce((a, b) => a + b, 0) / notes.length).toFixed(2);
  };

  // ✅ Calcul note globale (moyenne des blocs)
  const noteGlobaleCompetences = useMemo(() => {
    const blocs = [
      "savoir",
      "savoirFaire",
      "savoirEtre",
      "valeursHardie",
      "discipline",
    ];

    const notesBlocs = blocs.map((b) => calculerNoteBloc(competences[b]));
    const notesValides = notesBlocs.filter((n) => n > 0);

    if (notesValides.length === 0) return 0;
    return (
      notesValides.reduce((sum, n) => sum + parseFloat(n), 0) /
      notesValides.length
    ).toFixed(2);
  }, [competences]);

  // --- Rend une section dynamique avec note
  const renderSection = (label, key, data = []) => {
    const noteBloc = calculerNoteBloc(data);

    return (
      <Paper elevation={2} sx={{ p: 3, mb: 5, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ color: "primary.main" }}>
          {label} (Note : {noteBloc} / 5)
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
                  <Grid item xs={12} md={5}>
                    <Typography fontWeight="bold">{item.critere}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                  </Grid>

                  {/* Note */}
                  <Grid item xs={6} sm={4} md={2}>
                    <FormControl size="small" sx={{ minWidth: 140 }}>
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
                        {noteOptions.map((opt) => (
                          <MenuItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Axe d'amélioration */}
                  <Grid item xs={12} sm={8} md={5}>
                    <TextField
                      label="Axe d'amélioration"
                      fullWidth
                      size="small"
                      value={item.axeAmelioration || ""}
                      onChange={(e) =>
                        handleChange(
                          key,
                          index,
                          "axeAmelioration",
                          e.target.value
                        )
                      }
                    />
                  </Grid>
                </Grid>
              </Box>
            );
          })
        )}
      </Paper>
    );
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 1100, mx: "auto", px: 2, py: 4 }}>
      {renderSection("Savoir", "savoir", competences.savoir || [])}
      {renderSection(
        "Savoir-Faire",
        "savoirFaire",
        competences.savoirFaire || []
      )}
      {renderSection(
        "Savoir-Être",
        "savoirEtre",
        competences.savoirEtre || []
      )}
      {renderSection(
        "Valeurs Hardie",
        "valeursHardie",
        competences.valeursHardie || []
      )}
      {renderSection(
        "Discipline",
        "discipline",
        competences.discipline || []
      )}

      <Divider sx={{ my: 3 }} />
      <Typography variant="h5" align="center" color="secondary">
        🌍 Note Globale Compétences : {noteGlobaleCompetences} / 5
      </Typography>
    </Box>
  );
};

// 🔒 Comparaison profonde
function deepEqual(a, b) {
  if (a === b) return true;
  if (
    typeof a !== "object" ||
    typeof b !== "object" ||
    a === null ||
    b === null
  )
    return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    const valA = a[key];
    const valB = b[key];

    if (Array.isArray(valA) && Array.isArray(valB)) {
      if (valA.length !== valB.length) return false;
      for (let i = 0; i < valA.length; i++) {
        if (!deepEqual(valA[i], valB[i])) return false;
      }
    } else if (!deepEqual(valA, valB)) {
      return false;
    }
  }
  return true;
}

export default CompetencesForm;
