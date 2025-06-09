"use client"

import { useState } from 'react';
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
  Button
} from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';

const periodes = ['Mensuel', 'T1', 'T2', 'T3', 'Annuel'];
const typeObjectif = ['Sur Fiche de Poste', 'Hors Fiche de Poste'];

const ObjectifsForm = ({ value, onChange }) => {
  const [objectifs, setObjectifs] = useState(value || []);

  const handleChange = (index, field, val) => {
    const updated = [...objectifs];
    updated[index][field] = val;
    setObjectifs(updated);
    onChange(updated);
  };

  const handleAdd = () => {
    const newObj = {
      activite: '',
      attendu: '',
      realise: '',
      pourcentage: 0,
      commentaire: '',
      periode: '',
      type: 'Sur Fiche de Poste'
    };
    const updated = [...objectifs, newObj];
    setObjectifs(updated);
    onChange(updated);
  };

  const handleRemove = (index) => {
    const updated = [...objectifs];
    updated.splice(index, 1);
    setObjectifs(updated);
    onChange(updated);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Objectifs
      </Typography>

      {objectifs.map((obj, index) => (
        <Box key={index} sx={{ border: '1px solid #ccc', p: 2, mb: 2, borderRadius: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Activité"
                fullWidth
                value={obj.activite}
                onChange={(e) => handleChange(index, 'activite', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Période</InputLabel>
                <Select
                  value={obj.periode}
                  onChange={(e) => handleChange(index, 'periode', e.target.value)}
                  label="Période"
                >
                  {periodes.map((p) => (
                    <MenuItem key={p} value={p}>{p}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={obj.type}
                  onChange={(e) => handleChange(index, 'type', e.target.value)}
                  label="Type"
                >
                  {typeObjectif.map((t) => (
                    <MenuItem key={t} value={t}>{t}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Résultat Attendu"
                fullWidth
                value={obj.attendu}
                onChange={(e) => handleChange(index, 'attendu', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Résultat Réalisé"
                fullWidth
                value={obj.realise}
                onChange={(e) => handleChange(index, 'realise', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Pourcentage (%)"
                type="number"
                fullWidth
                value={obj.pourcentage}
                onChange={(e) => handleChange(index, 'pourcentage', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Commentaire"
                fullWidth
                value={obj.commentaire}
                onChange={(e) => handleChange(index, 'commentaire', e.target.value)}
              />
            </Grid>
          </Grid>
          <Box sx={{ textAlign: 'right', mt: 2 }}>
            <IconButton color="error" onClick={() => handleRemove(index)}>
              <RemoveCircleOutline />
            </IconButton>
          </Box>
        </Box>
      ))}

      <Button startIcon={<AddCircleOutline />} onClick={handleAdd} variant="outlined">
        Ajouter un objectif
      </Button>
    </Box>
  );
};

export default ObjectifsForm;
