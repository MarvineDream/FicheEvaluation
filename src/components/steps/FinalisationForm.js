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
  Button,
} from "@mui/material";

const optionsDecision = [
  "Poursuite dans les fonctions actuelles",
  "Accompagnement spécifique",
  "Changement de poste souhaitable",
  "Autre (à préciser)",
];

const FinalisationForm = ({
  value = {},
  onSubmit,
  onChange,
  staffName = "",     
  managerName = "",   
}) => {
  const handleChange = (section, field, val) => {
    const updatedSection = {
      ...(typeof value[section] === "object" && value[section] !== null
        ? value[section]
        : {}),
      [field]: val,
    };

    const updated = {
      ...value,
      [section]: updatedSection,
    };

    if (onChange) onChange(updated);
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
              label="Décision RH"
              value={value.decision?.choix || ""}
              onChange={(e) =>
                handleChange("decision", "choix", e.target.value)
              }
            >
              {optionsDecision.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
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
            value={value.decision?.commentaire || ""}
            onChange={(e) =>
              handleChange("decision", "commentaire", e.target.value)
            }
          />
        </Grid>

        {/* Signatures */}
        <Grid item xs={12} sm={4}>
          <TextField
            label="Nom du collaborateur"
            fullWidth
            value={staffName}
            InputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Nom du manager"
            fullWidth
            value={managerName}
            InputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Nom RH"
            fullWidth
            value={value.signatures?.rhNom || ""}
            onChange={(e) =>
              handleChange("signatures", "rhNom", e.target.value)
            }
          />
        </Grid>
      </Grid>

      <Box sx={{ textAlign: "right", mt: 4 }}>
        <Button variant="contained" color="success" onClick={onSubmit}>
          Soumettre l&apos;évaluation finale
        </Button>
      </Box>
    </Box>
  );
};

export default FinalisationForm;
