"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Paper,
  Divider,
} from "@mui/material";

const Section = ({ title, children }) => (
  <Paper elevation={2} sx={{ p: 3, mb: 4, backgroundColor: "#f9f9f9" }}>
    <Typography variant="h6" sx={{ color: "#1976d2", mb: 1 }}>
      {title}
    </Typography>
    <Divider sx={{ mb: 2 }} />
    {children}
  </Paper>
);

const getSafeArray = (value) => (Array.isArray(value) ? value : [""]);

const FicheDePosteForm = ({ fiche, staffId, onCreate, onUpdate }) => {
  const [form, setForm] = useState({
    staffId: staffId || "",
    codeFiche: "",
    titulairePoste: "",
    intituléPoste: "",
    service: "",
    supérieurHiérarchique: "",
    binome: "",
    statut: "",
    echelon: "",
    missionPrincipale: "",
    activitésPrincipales: [
      {
        titre: "",
        mission: "",
        tâches: [""],
      },
    ],
    indicateursPerformance: [""],
    relationsDirectes: [""],
    relationsIndirectes: [""],
    compétencesRequises: [""],
    conditionsExercice: [""],
    aptitudesParticulieres: [""],
    limitesOperationnelles: "",
  });

  useEffect(() => {
    if (fiche) {
      setForm((prev) => ({
        ...prev,
        ...fiche,
        activitésPrincipales: fiche.activitésPrincipales?.map((a) => ({
          titre: a.titre || "",
          mission: a.mission || "",
          tâches: getSafeArray(a.tâches),
        })) || [
          {
            titre: "",
            mission: "",
            tâches: [""],
          },
        ],
        indicateursPerformance: getSafeArray(fiche.indicateursPerformance),
        relationsDirectes: getSafeArray(fiche.relationsDirectes),
        relationsIndirectes: getSafeArray(fiche.relationsIndirectes),
        compétencesRequises: getSafeArray(fiche.compétencesRequises),
        conditionsExercice: getSafeArray(fiche.conditionsExercice),
        aptitudesParticulieres: getSafeArray(fiche.aptitudesParticulieres),
      }));
    }
  }, [fiche]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field, index, value) => {
    const updated = [...form[field]];
    updated[index] = value;
    setForm((prev) => ({ ...prev, [field]: updated }));
  };

  const handleAddItem = (field) => {
    setForm((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const handleRemoveItem = (field, index) => {
    const updated = [...form[field]];
    updated.splice(index, 1);
    setForm((prev) => ({ ...prev, [field]: updated }));
  };

  // === Activités complexes ===

  const handleActiviteChange = (index, field, value) => {
    const updated = [...form.activitésPrincipales];
    updated[index][field] = value;
    setForm((prev) => ({ ...prev, activitésPrincipales: updated }));
  };

  const handleTacheChange = (index, tacheIndex, value) => {
    const updated = [...form.activitésPrincipales];
    updated[index].tâches[tacheIndex] = value;
    setForm((prev) => ({ ...prev, activitésPrincipales: updated }));
  };

  const handleAddActivite = () => {
    setForm((prev) => ({
      ...prev,
      activitésPrincipales: [
        ...prev.activitésPrincipales,
        { titre: "", mission: "", tâches: [""] },
      ],
    }));
  };

  const handleRemoveActivite = (index) => {
    const updated = [...form.activitésPrincipales];
    updated.splice(index, 1);
    setForm((prev) => ({ ...prev, activitésPrincipales: updated }));
  };

  const handleAddTache = (index) => {
    const updated = [...form.activitésPrincipales];
    updated[index].tâches.push("");
    setForm((prev) => ({ ...prev, activitésPrincipales: updated }));
  };

  const handleRemoveTache = (index, tacheIndex) => {
    const updated = [...form.activitésPrincipales];
    updated[index].tâches.splice(tacheIndex, 1);
    setForm((prev) => ({ ...prev, activitésPrincipales: updated }));
  };

  const renderArrayField = (label, field) => (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle1" gutterBottom>{label}</Typography>
      {form[field].map((item, i) => (
        <Box key={i} sx={{ mb: 2 }}>
          <TextField
            label={`${label} ${i + 1}`}
            fullWidth
            multiline
            minRows={2}
            value={item}
            onChange={(e) => handleArrayChange(field, i, e.target.value)}
          />
          <Box textAlign="right" mt={1}>
            <Button color="error" onClick={() => handleRemoveItem(field, i)}>
              Supprimer
            </Button>
          </Box>
        </Box>
      ))}
      <Button variant="outlined" onClick={() => handleAddItem(field)}>
        Ajouter
      </Button>
    </Box>
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.staffId) return alert("StaffId requis !");
    fiche ? onUpdate?.(form) : onCreate?.(form);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Section title="1. Identification du Poste">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField label="Code Fiche" value={form.codeFiche} onChange={(e) => handleChange("codeFiche", e.target.value)} fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Titulaire du poste" value={form.titulairePoste} onChange={(e) => handleChange("titulairePoste", e.target.value)} fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Intitulé du poste" value={form.intituléPoste} onChange={(e) => handleChange("intituléPoste", e.target.value)} fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Service" value={form.service} onChange={(e) => handleChange("service", e.target.value)} fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Supérieur hiérarchique" value={form.supérieurHiérarchique} onChange={(e) => handleChange("supérieurHiérarchique", e.target.value)} fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Binôme" value={form.binome} onChange={(e) => handleChange("binome", e.target.value)} fullWidth />
          </Grid>
          <Grid item xs={6}>
            <TextField label="Statut" value={form.statut} onChange={(e) => handleChange("statut", e.target.value)} fullWidth />
          </Grid>
          <Grid item xs={6}>
            <TextField label="Échelon" value={form.echelon} onChange={(e) => handleChange("echelon", e.target.value)} fullWidth />
          </Grid>
        </Grid>
      </Section>

      <Section title="2. Mission principale">
        <TextField
          label="Mission principale"
          value={form.missionPrincipale}
          onChange={(e) => handleChange("missionPrincipale", e.target.value)}
          fullWidth
          multiline
          minRows={3}
        />
      </Section>

      <Section title="3. Activités principales">
        {form.activitésPrincipales.map((activite, index) => (
          <Box key={index} sx={{ mb: 3, p: 2, border: "1px solid #ccc", borderRadius: 2 }}>
            <TextField
              label={`Titre de l'activité ${index + 1}`}
              value={activite.titre}
              onChange={(e) => handleActiviteChange(index, "titre", e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Mission principale"
              value={activite.mission}
              onChange={(e) => handleActiviteChange(index, "mission", e.target.value)}
              fullWidth
              multiline
              minRows={2}
              sx={{ mb: 2 }}
            />
            <Typography variant="subtitle2">Tâches :</Typography>
            {activite.tâches.map((tache, tacheIndex) => (
              <Box key={tacheIndex} sx={{ mb: 2 }}>
                <TextField
                  label={`Tâche ${tacheIndex + 1}`}
                  value={tache}
                  onChange={(e) => handleTacheChange(index, tacheIndex, e.target.value)}
                  fullWidth
                  multiline
                  minRows={2}
                />
                <Box textAlign="right" mt={1}>
                  <Button color="error" size="small" onClick={() => handleRemoveTache(index, tacheIndex)}>
                    Supprimer la tâche
                  </Button>
                </Box>
              </Box>
            ))}
            <Button variant="outlined" onClick={() => handleAddTache(index)} sx={{ mb: 2 }}>
              Ajouter une tâche
            </Button>
            <Box textAlign="right">
              <Button color="error" onClick={() => handleRemoveActivite(index)}>
                Supprimer l&apos;activité
              </Button>
            </Box>
          </Box>
        ))}
        <Button variant="outlined" onClick={handleAddActivite}>
          Ajouter une activité
        </Button>
      </Section>

      <Section title="4. Relations de travail">
        {renderArrayField("Relation directe", "relationsDirectes")}
        {renderArrayField("Relation indirecte", "relationsIndirectes")}
      </Section>

      <Section title="5. Compétences et conditions d'exercice">
        {renderArrayField("Aptitudes et tâches particulières", "aptitudesParticulieres")}
        <TextField
          label="Limites opérationnelles"
          value={form.limitesOperationnelles}
          onChange={(e) => handleChange("limitesOperationnelles", e.target.value)}
          fullWidth
          multiline
          minRows={2}
          sx={{ mt: 2 }}
        />
      </Section>

      <Box textAlign="right" sx={{ mt: 2 }}>
        <Button variant="contained" type="submit">
          {fiche ? "Mettre à jour la fiche" : "Créer la fiche"}
        </Button>
      </Box>
    </Box>
  );
};

export default FicheDePosteForm;
