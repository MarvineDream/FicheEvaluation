
"use client";
import { Box, Typography, TextField, Grid } from "@mui/material";

const IntegrationForm = ({ value = {}, onChange }) => {
  const handleChange = (key, field, newValue) => {
    const updated = {
      ...value,
      [key]: [{ ...((value[key] && value[key][0]) || {}), [field]: newValue }],
    };
    onChange(updated);
  };

  const criteres = [
    { key: "Adaptation Poste", label: "Adaptation au poste" },
    { key: "Adaptation Equipe", label: "Intégration dans l’équipe" },
    { key: "Respect Des Procédures", label: "Respect des procédures" },
    { key: "Maitrise Des Outils", label: "Maîtrise des outils" },
  ];

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Évaluation de l&apos;intégration
      </Typography>
      <Grid container spacing={2}>
        {criteres.map(({ key, label }) => (
          <Grid key={key} item xs={12}>
            <Typography variant="subtitle1">{label}</Typography>
            <TextField
              fullWidth
              label="Note (1 à 5)"
              type="number"
              value={value[key]?.[0]?.note || ""}
              onChange={(e) => handleChange(key, "note", e.target.value)}
              inputProps={{ min: 1, max: 5 }}
              sx={{ mt: 1 }}
            />
            <TextField
              fullWidth
              label="Commentaire"
              value={value[key]?.[0]?.commentaire || ""}
              onChange={(e) => handleChange(key, "commentaire", e.target.value)}
              multiline
              rows={2}
              sx={{ mt: 1 }}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default IntegrationForm;
