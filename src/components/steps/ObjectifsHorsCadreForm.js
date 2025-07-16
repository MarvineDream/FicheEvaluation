"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const PERIODES = ["Mensuel", "T1", "T2", "T3", "Annuel"];

// Fonction shallowEqual adaptée (objets/plaines)
const shallowEqual = (obj1, obj2) => {
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
    if (obj1[key] !== obj2[key]) return false;
  }
  return true;
};

const ObjectifsForm = ({ value = [], onChange, title = "Objectifs hors cadre" }) => {
  const [objectifs, setObjectifs] = useState(value);
  const isFirstRender = useRef(true);

  // Synchroniser l'état local uniquement si value change réellement (shallow)
  useEffect(() => {
    if (!shallowEqual(value, objectifs)) {
      setObjectifs(value);
    }
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  // Appeler onChange uniquement après le premier rendu
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (onChange) onChange(objectifs);
  }, [objectifs, onChange]);

  const addObjectif = () => {
    setObjectifs((prev) => [
      ...prev,
      {
        activite: "",
        periode: "Mensuel",
        pourcentage: 0,
        sousTaches: [],
      },
    ]);
  };

  const handleChangeObjectif = (index, field, val) => {
    setObjectifs((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const addSousTache = (objIndex) => {
    setObjectifs((prev) => {
      const copy = [...prev];
      const sousTaches = copy[objIndex].sousTaches || [];
      sousTaches.push({ titre: "", note: 1, commentaire: "" });
      copy[objIndex].sousTaches = sousTaches;
      return copy;
    });
  };

  const handleChangeSousTache = (objIndex, stIndex, field, val) => {
    setObjectifs((prev) => {
      const copy = [...prev];
      copy[objIndex].sousTaches[stIndex] = {
        ...copy[objIndex].sousTaches[stIndex],
        [field]: val,
      };
      return copy;
    });
  };

  const removeSousTache = (objIndex, stIndex) => {
    setObjectifs((prev) => {
      const copy = [...prev];
      copy[objIndex].sousTaches = copy[objIndex].sousTaches.filter(
        (_, i) => i !== stIndex
      );
      return copy;
    });
  };

  const removeObjectif = (index) => {
    setObjectifs((prev) => prev.filter((_, i) => i !== index));
  };

  const isHorsCadre = title.toLowerCase().includes("hors cadre");

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, color: "primary.main" }}>
        {title}
      </Typography>

      {isHorsCadre && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Ces objectifs correspondent aux missions ou tâches réalisées en dehors du cadre fixé initialement.
        </Typography>
      )}

      {objectifs.length === 0 && (
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Aucun objectif pour cette catégorie.
        </Typography>
      )}

      {objectifs.map((obj, index) => (
        <Paper
          key={index}
          elevation={2}
          sx={{ p: 2, mb: 3, borderRadius: 2, backgroundColor: "#fafafa" }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                label="Activité"
                fullWidth
                size="small"
                value={obj.activite}
                onChange={(e) => handleChangeObjectif(index, "activite", e.target.value)}
                required
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small" required>
                <InputLabel>Période</InputLabel>
                <Select
                  label="Période"
                  value={obj.periode}
                  onChange={(e) => handleChangeObjectif(index, "periode", e.target.value)}
                >
                  {PERIODES.map((periode) => (
                    <MenuItem key={periode} value={periode}>
                      {periode}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                label="Pourcentage (%)"
                type="number"
                inputProps={{ min: 0, max: 100 }}
                fullWidth
                size="small"
                value={obj.pourcentage}
                onChange={(e) =>
                  handleChangeObjectif(
                    index,
                    "pourcentage",
                    Math.min(100, Math.max(0, Number(e.target.value)))
                  )
                }
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Sous-tâches
              </Typography>

              {(obj.sousTaches || []).map((st, stIndex) => (
                <Paper
                  key={stIndex}
                  variant="outlined"
                  sx={{ p: 1, mb: 1, position: "relative" }}
                >
                  <Grid container spacing={1} alignItems="center">
                    <Grid item xs={12} md={4}>
                      <TextField
                        label="Titre"
                        fullWidth
                        size="small"
                        value={st.titre}
                        onChange={(e) =>
                          handleChangeSousTache(index, stIndex, "titre", e.target.value)
                        }
                      />
                    </Grid>

                    <Grid item xs={12} md={3}>
                      <TextField
                        label="Note (1-5)"
                        type="number"
                        inputProps={{ min: 1, max: 5 }}
                        fullWidth
                        size="small"
                        value={st.note}
                        onChange={(e) =>
                          handleChangeSousTache(
                            index,
                            stIndex,
                            "note",
                            Math.min(5, Math.max(1, Number(e.target.value)))
                          )
                        }
                      />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <TextField
                        label="Commentaire"
                        fullWidth
                        size="small"
                        value={st.commentaire}
                        onChange={(e) =>
                          handleChangeSousTache(index, stIndex, "commentaire", e.target.value)
                        }
                      />
                    </Grid>

                    <Grid item xs={12} md={1} sx={{ textAlign: "right" }}>
                      <IconButton
                        aria-label="Supprimer sous-tâche"
                        color="error"
                        onClick={() => removeSousTache(index, stIndex)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Paper>
              ))}

              <Button
                variant="outlined"
                size="small"
                onClick={() => addSousTache(index)}
                sx={{ mt: 1 }}
              >
                Ajouter une sous-tâche
              </Button>
            </Grid>

            <Grid item xs={12} sx={{ textAlign: "right" }}>
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => removeObjectif(index)}
              >
                Supprimer l&apos;objectif
              </Button>
            </Grid>
          </Grid>
        </Paper>
      ))}

      <Button variant="contained" onClick={addObjectif}>
        Ajouter un objectif
      </Button>
    </Box>
  );
};

export default ObjectifsForm;
