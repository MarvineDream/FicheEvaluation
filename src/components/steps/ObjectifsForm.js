"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Grid,
  IconButton,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Alert,
} from "@mui/material";
import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";

const periodes = ["Mensuel", "T1", "T2", "T3", "Annuel"];

const mentions = [
  { label: "Très bien", value: 5 },
  { label: "Assez bien", value: 4 },
  { label: "Bien", value: 3 },
  { label: "Passable", value: 2 },
  { label: "Pas concerné", value: 1 },
];

const ObjectifsForm = ({ value, onChange }) => {
  const [objectifs, setObjectifs] = useState(value || []);
  const [error, setError] = useState("");

  const sommePourcentages = objectifs.reduce(
    (acc, obj) => acc + (Number(obj.pourcentage) || 0),
    0
  );

  const updateObjectifs = (updated) => {
    setObjectifs(updated);
    onChange(updated);
  };

  const handleChange = (index, field, val) => {
    const updated = [...objectifs];
    updated[index][field] = val;

    if (field === "pourcentage") {
      const nouvelleSomme = updated.reduce(
        (acc, obj) => acc + (Number(obj.pourcentage) || 0),
        0
      );
      if (nouvelleSomme > 100) {
        setError("La somme des pourcentages ne doit pas dépasser 100%");
        return;
      } else {
        setError("");
      }
    }

    updateObjectifs(updated);
  };

  const handleSousTacheChange = (objIndex, subIndex, field, val) => {
    const updated = [...objectifs];
    if (!updated[objIndex].sousTaches) updated[objIndex].sousTaches = [];
    updated[objIndex].sousTaches[subIndex][field] = val;
    updateObjectifs(updated);
  };

  const handleAddSousTache = (objIndex) => {
    const updated = [...objectifs];
    if (!updated[objIndex].sousTaches) updated[objIndex].sousTaches = [];
    updated[objIndex].sousTaches.push({ nomSousTache: "", note: 3 });
    updateObjectifs(updated);
  };

  const handleRemoveSousTache = (objIndex, subIndex) => {
    const updated = [...objectifs];
    updated[objIndex].sousTaches.splice(subIndex, 1);
    updateObjectifs(updated);
  };

  const handleAddObjectif = () => {
    const newObj = {
      activite: "",
      periode: "",
      pourcentage: 0,
      sousTaches: [],
    };
    updateObjectifs([...objectifs, newObj]);
  };

  const handleRemoveObjectif = (index) => {
    const updated = [...objectifs];
    updated.splice(index, 1);
    setError("");
    updateObjectifs(updated);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Objectifs
      </Typography>

      <Typography sx={{ mb: 1, fontWeight: "bold" }}>
        Somme des pourcentages : {sommePourcentages}%
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {objectifs.map((obj, index) => (
        <Box
          key={index}
          sx={{ border: "1px solid #ccc", p: 2, mb: 3, borderRadius: 2 }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nom de l'objectif"
                fullWidth
                value={obj.activite}
                onChange={(e) => handleChange(index, "activite", e.target.value)}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Période</InputLabel>
                <Select
                  value={obj.periode}
                  onChange={(e) => handleChange(index, "periode", e.target.value)}
                  label="Période"
                >
                  {periodes.map((p) => (
                    <MenuItem key={p} value={p}>
                      {p}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                label="Pourcentage (%)"
                type="number"
                inputProps={{ min: 0, max: 100 }}
                fullWidth
                value={obj.pourcentage}
                onChange={(e) => {
                  let val = parseInt(e.target.value, 10);
                  if (isNaN(val)) val = 0;
                  if (val > 100) val = 100;
                  if (val < 0) val = 0;
                  handleChange(index, "pourcentage", val);
                }}
              />
            </Grid>
          </Grid>

          <Box mt={2} ml={2}>
            <Typography variant="subtitle1">Sous-tâches</Typography>
            {obj.sousTaches && obj.sousTaches.length > 0 ? (
              obj.sousTaches.map((st, subIndex) => (
                <Grid
                  container
                  spacing={1}
                  key={subIndex}
                  alignItems="center"
                  sx={{ mb: 1 }}
                >
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Titre"
                      fullWidth
                      value={st.nomSousTache}
                      onChange={(e) =>
                        handleSousTacheChange(index, subIndex, "nomSousTache", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <FormControl fullWidth>
                      <InputLabel>Note</InputLabel>
                      <Select
                        value={st.note}
                        onChange={(e) =>
                          handleSousTacheChange(index, subIndex, "note", parseInt(e.target.value, 10))
                        }
                        label="Note"
                      >
                        {mentions.map((m) => (
                          <MenuItem key={m.value} value={m.value}>
                            {m.label} ({m.value})
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6} sm={2}>
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveSousTache(index, subIndex)}
                    >
                      <RemoveCircleOutline />
                    </IconButton>
                  </Grid>
                </Grid>
              ))
            ) : (
              <Typography color="text.secondary" sx={{ ml: 1 }}>
                Aucune sous-tâche
              </Typography>
            )}

            <Button
              startIcon={<AddCircleOutline />}
              onClick={() => handleAddSousTache(index)}
              size="small"
              sx={{ mt: 1 }}
              variant="outlined"
            >
              Ajouter une sous-tâche
            </Button>
          </Box>

          <Box sx={{ textAlign: "right", mt: 2 }}>
            <IconButton color="error" onClick={() => handleRemoveObjectif(index)}>
              <RemoveCircleOutline />
            </IconButton>
          </Box>
        </Box>
      ))}

      <Button
        startIcon={<AddCircleOutline />}
        onClick={handleAddObjectif}
        variant="outlined"
      >
        Ajouter un objectif
      </Button>
    </Box>
  );
};

export default ObjectifsForm;
