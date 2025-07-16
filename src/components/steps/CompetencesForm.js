"use client";

import { useState, useEffect, useRef } from "react";
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
} from "@mui/material";

export const noteOptions = [
  "Très Bien",
  "Bien",
  "Passable",
  "Insuffisant",
  "Pas Concerné",
];

const CompetencesForm = ({ value, onChange }) => {
  const [competences, setCompetences] = useState(() => value || {});
  const isFirstRender = useRef(true);

  // Met à jour l'état local si value change (hors cycle initial)
  useEffect(() => {
    if (!shallowEqualArrayObject(value, competences)) {
      setCompetences(value);
    }
  }, [value, competences]);

  // Notifie le parent uniquement après le premier rendu
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (onChange) onChange(competences);
  }, [competences, onChange]);

  const handleChange = (categorie, index, field, val) => {
    setCompetences((prev) => {
      const updatedCategorie = [...prev[categorie]];
      updatedCategorie[index] = { ...updatedCategorie[index], [field]: val };
      return { ...prev, [categorie]: updatedCategorie };
    });
  };

  const renderSection = (label, key, data = []) => (
    <Paper elevation={2} sx={{ p: 3, mb: 5, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ color: "primary.main" }}>
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
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography fontWeight="bold">{item.critere}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </Grid>

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

                <Grid item xs={12} sm={6} md={4}>
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

  return (
    <Box sx={{ width: "100%", maxWidth: 1100, mx: "auto", px: 2, py: 4 }}>
      {renderSection("Savoir", "savoir", competences.savoir)}
      {renderSection("Savoir-Faire", "savoirFaire", competences.savoirFaire)}
      {renderSection("Savoir-Être", "savoirEtre", competences.savoirEtre)}
      {renderSection("Discipline", "discipline", competences.discipline)}
    </Box>
  );
};

// Fonction de comparaison d'objets simples avec tableaux imbriqués
function shallowEqualArrayObject(obj1, obj2) {
  if (obj1 === obj2) return true;
  if (
    typeof obj1 !== "object" ||
    typeof obj2 !== "object" ||
    obj1 === null ||
    obj2 === null
  )
    return false;

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) return false;

  for (let key of keys1) {
    const val1 = obj1[key];
    const val2 = obj2[key];

    if (Array.isArray(val1) && Array.isArray(val2)) {
      if (val1.length !== val2.length) return false;
      for (let i = 0; i < val1.length; i++) {
        if (JSON.stringify(val1[i]) !== JSON.stringify(val2[i])) return false;
      }
    } else if (val1 !== val2) {
      return false;
    }
  }

  return true;
}

export default CompetencesForm;
