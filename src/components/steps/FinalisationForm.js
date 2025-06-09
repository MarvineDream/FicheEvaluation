"use client";


import {
  Box,
  Typography,
  TextField,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button
} from '@mui/material';

const optionsDecision = [
  'Poursuite dans les fonctions actuelles',
  'Accompagnement spécifique',
  'Changement de poste souhaitable',
  'Autre (à préciser)'
];

const FinalisationForm = ({ value, onSubmit }) => {
  const handleChange = (section, field, val) => {
    const updated = { ...value };
    updated[section][field] = val;
    // Note : Pas de onChange ici, ce composant déclenche le submit final
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Décision RH et Signatures
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Décision RH</InputLabel>
            <Select
              value={value.decision?.choix || ''}
              onChange={(e) => handleChange('decision', 'choix', e.target.value)}
              label="Décision RH"
            >
              {optionsDecision.map((opt) => (
                <MenuItem key={opt} value={opt}>{opt}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Commentaire RH"
            multiline
            minRows={3}
            fullWidth
            value={value.decision?.commentaire || ''}
            onChange={(e) => handleChange('decision', 'commentaire', e.target.value)}
          />
        </Grid>

        {/* Signatures */}
        <Grid item xs={12} sm={4}>
          <TextField
            label="Nom du collaborateur"
            fullWidth
            value={value.signatures?.collaborateur || ''}
            onChange={(e) => handleChange('signatures', 'collaborateur', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Nom du manager"
            fullWidth
            value={value.signatures?.responsableNom || ''}
            onChange={(e) => handleChange('signatures', 'responsableNom', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Nom RH"
            fullWidth
            value={value.signatures?.rhNom || ''}
            onChange={(e) => handleChange('signatures', 'rhNom', e.target.value)}
          />
        </Grid>
      </Grid>

      <Box sx={{ textAlign: 'right', mt: 4 }}>
        <Button variant="contained" color="success" onClick={onSubmit}>
          Soumettre l&apos;évaluation finale
        </Button>
      </Box>
    </Box>
  );
};

export default FinalisationForm;
