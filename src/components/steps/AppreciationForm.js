"use client";


import { Box, Typography, TextField, Grid, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const niveaux = [
  'Objectifs atteints',
  'Objectifs moyennement atteints',
  'Objectifs non atteints',
  'Objectifs dépassés'
];

const AppreciationForm = ({ value, onChange }) => {
  const handleChange = (field, val) => {
    const updated = { ...value, [field]: val };
    onChange(updated);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Appréciation Globale
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Score Objectifs (%)"
            type="number"
            fullWidth
            value={value.poste || ''}
            onChange={(e) => handleChange('poste', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Score Hors Objectifs (%)"
            type="number"
            fullWidth
            value={value.horsPoste || ''}
            onChange={(e) => handleChange('horsPoste', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Moyenne Globale"
            type="number"
            fullWidth
            value={value.moyenneGlobale || ''}
            onChange={(e) => handleChange('moyenneGlobale', e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Niveau d’atteinte</InputLabel>
            <Select
              value={value.niveauAtteinte || ''}
              onChange={(e) => handleChange('niveauAtteinte', e.target.value)}
              label="Niveau d’atteinte"
            >
              {niveaux.map((n) => (
                <MenuItem key={n} value={n}>{n}</MenuItem>
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
            value={value.commentaireManager || ''}
            onChange={(e) => handleChange('commentaireManager', e.target.value)}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AppreciationForm;
