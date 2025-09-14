"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  IconButton,
  Button,
  MenuItem,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const periodes = ["Mensuel", "T1", "T2", "T3", "Annuel"];

export default function ObjectifsHorsCadreForm({ data, onChange }) {
  const [objectifs, setObjectifs] = useState(data || []);

  const handleChangeObjectif = (index, field, value) => {
    const newObjectifs = [...objectifs];
    newObjectifs[index][field] = value;
    setObjectifs(newObjectifs);
    onChange(newObjectifs);
  };

  const handleChangeSousTache = (objIndex, stIndex, field, value) => {
    const newObjectifs = [...objectifs];
    newObjectifs[objIndex].sousTaches[stIndex][field] = value;
    setObjectifs(newObjectifs);
    onChange(newObjectifs);
  };

  const addObjectif = () => {
    setObjectifs([
      ...objectifs,
      {
        activite: "",
        periode: "",
        pourcentage: 0,
        sousTaches: [],
      },
    ]);
  };

  const removeObjectif = (index) => {
    const newObjectifs = objectifs.filter((_, i) => i !== index);
    setObjectifs(newObjectifs);
    onChange(newObjectifs);
  };

  const addSousTache = (objIndex) => {
    const newObjectifs = [...objectifs];
    const sousTaches = newObjectifs[objIndex].sousTaches || [];
    sousTaches.push({
      nom: "", // 🔹 Nouveau champ
      indicateurPerformance: "",
      attendu: "100", // 🔹 Valeur par défaut
      realise: "",
      note: 1,
      commentaire: "",
    });
    newObjectifs[objIndex].sousTaches = sousTaches;
    setObjectifs(newObjectifs);
    onChange(newObjectifs);
  };

  const removeSousTache = (objIndex, stIndex) => {
    const newObjectifs = [...objectifs];
    newObjectifs[objIndex].sousTaches.splice(stIndex, 1);
    setObjectifs(newObjectifs);
    onChange(newObjectifs);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Objectifs Hors Cadre
      </Typography>

      {objectifs.map((objectif, index) => (
        <Box key={index} mb={4} p={2} border={"1px solid #ccc"} borderRadius={2}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                label="Activité"
                fullWidth
                size="small"
                value={objectif.activite}
                onChange={(e) => handleChangeObjectif(index, "activite", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                label="Période"
                select
                fullWidth
                size="small"
                value={objectif.periode}
                onChange={(e) => handleChangeObjectif(index, "periode", e.target.value)}
              >
                {periodes.map((p) => (
                  <MenuItem key={p} value={p}>
                    {p}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                label="% Pondération"
                type="number"
                inputProps={{ min: 0, max: 100 }}
                fullWidth
                size="small"
                value={objectif.pourcentage}
                onChange={(e) => handleChangeObjectif(index, "pourcentage", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <IconButton color="error" onClick={() => removeObjectif(index)}>
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1" gutterBottom>
            Sous-tâches
          </Typography>

          {objectif.sousTaches?.map((st, stIndex) => (
            <Box
              key={stIndex}
              mb={2}
              p={2}
              border="1px solid #eee"
              borderRadius={2}
              bgcolor="#fafafa"
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={3}>
                  <TextField
                    label="Nom de la sous-tâche"
                    fullWidth
                    size="small"
                    value={st.nom}
                    onChange={(e) =>
                      handleChangeSousTache(index, stIndex, "nom", e.target.value)
                    }
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    label="Indicateur de performance"
                    fullWidth
                    size="small"
                    value={st.indicateurPerformance}
                    onChange={(e) =>
                      handleChangeSousTache(
                        index,
                        stIndex,
                        "indicateurPerformance",
                        e.target.value
                      )
                    }
                  />
                </Grid>

                <Grid item xs={12} md={2}>
                  <TextField
                    label="Attendu (%)"
                    type="number"
                    fullWidth
                    size="small"
                    value={st.attendu}
                    onChange={(e) =>
                      handleChangeSousTache(index, stIndex, "attendu", e.target.value)
                    }
                  />
                </Grid>

                <Grid item xs={12} md={2}>
                  <TextField
                    label="Réalisé (%)"
                    type="number"
                    fullWidth
                    size="small"
                    value={st.realise}
                    onChange={(e) =>
                      handleChangeSousTache(index, stIndex, "realise", e.target.value)
                    }
                  />
                </Grid>

                <Grid item xs={12} md={2}>
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

                <Grid item xs={12} md={0.5} sx={{ textAlign: "right" }}>
                  <IconButton
                    aria-label="Supprimer sous-tâche"
                    color="error"
                    onClick={() => removeSousTache(index, stIndex)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Box>
          ))}

          <Box mt={2}>
            <Button variant="outlined" onClick={() => addSousTache(index)}>
              Ajouter une sous-tâche
            </Button>
          </Box>
        </Box>
      ))}

      <Button variant="contained" onClick={addObjectif}>
        Ajouter un objectif
      </Button>
    </Box>
  );
}
