"use client";

import { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  MenuItem,
  InputLabel,
  Select,
  FormControl
} from '@mui/material';

const noteOptions = ['Très Bien', 'Bien', 'Passable', 'Insuffisant', 'Pas Concerné'];

const CompetencesForm = ({ value, onChange }) => {
  const [competences, setCompetences] = useState(value || {
    savoir: [],
    savoirFaire: [],
    savoirEtre: [],
    discipline: []
  });

  const handleChange = (categorie, index, field, val) => {
    const updated = { ...competences };
    updated[categorie][index][field] = val;
    setCompetences(updated);
    onChange(updated);
  };

  const renderSection = (label, key, data) => (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>{label}</Typography>
      {data.map((item, index) => (
        <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={4}>
            <Typography><strong>{item.critere}</strong></Typography>
            <Typography variant="body2">{item.description}</Typography>
          </Grid>
          <Grid item xs={12} sm={2}>
            <FormControl fullWidth>
              <InputLabel>Note</InputLabel>
              <Select
                value={item.note || ''}
                onChange={(e) => handleChange(key, index, 'note', e.target.value)}
                label="Note"
              >
                {noteOptions.map((note) => (
                  <MenuItem key={note} value={note}>{note}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Axe d'amélioration"
              fullWidth
              value={item.axeAmelioration || ''}
              onChange={(e) => handleChange(key, index, 'axeAmelioration', e.target.value)}
            />
          </Grid>
        </Grid>
      ))}
    </Box>
  );

  return (
    <Box>
      {renderSection('Savoir', 'savoir', competences.savoir)}
      {renderSection('Savoir-Faire', 'savoirFaire', competences.savoirFaire)}
      {renderSection('Savoir-Être', 'savoirEtre', competences.savoirEtre)}
      {renderSection('Discipline', 'discipline', competences.discipline)}
    </Box>
  );
};

export default CompetencesForm;
