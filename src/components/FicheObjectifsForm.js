"use client";

import React, { useEffect, useState } from "react";
import {
  TextField,
  Grid,
  Typography,
  Button,
  Box,
  IconButton,
  Divider,
  Paper,
  CircularProgress,
} from "@mui/material";
import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";

const createDefaultTache = () => ({
  description: "",
  indicateur: "",
});

const createDefaultObjectif = () => ({
  titre: "",
  moyens: "",
  taches: [createDefaultTache()],
});

const FicheObjectifsForm = ({ fiche, staffId, onCreate, onUpdate }) => {
  const [formData, setFormData] = useState({
    poste: "",
    nom: "",
    direction: "",
    superieur: "",
    statut: "",
    echelon: "",
    binome: "",
    codeFiche: "",
    missionPrincipale: "",
    objectifs: [createDefaultObjectif()],
    _id: undefined,
  });

  const [loadingStaff, setLoadingStaff] = useState(false);

  // 1️⃣ Mettre à jour le formData si fiche existante (édition)
  useEffect(() => {
    if (fiche && typeof fiche === "object" && fiche._id) {
      setFormData(prev => ({
        ...prev,
        ...fiche,
        objectifs: fiche.objectifs?.length ? fiche.objectifs : prev.objectifs,
        _id: fiche._id,
      }));
    }
  }, [fiche]);

  // 2️⃣ Pré-remplir les champs depuis les infos du staff si pas de fiche
  useEffect(() => {
    if (!staffId || fiche?._id) return; // Ne pas écraser si on édite une fiche

    const fetchStaffInfo = async () => {
      setLoadingStaff(true);
      try {
        const res = await fetch(`http://localhost:7000/staff/${staffId}`);
        if (!res.ok) throw new Error("Erreur lors du chargement des infos du staff");

        const data = await res.json();
        console.log("Fiche reçue :", data);
        setFormData(prev => ({
          ...prev,
          nom: data.nom || prev.nom,
          poste: data.poste || prev.poste,
          direction: data.departementNom || prev.direction,
          superieur: data.managerNom || prev.superieur,
        }));
      } catch (error) {
        console.error("Erreur lors du chargement des infos du staff :", error);
      } finally {
        setLoadingStaff(false);
      }
    };

    fetchStaffInfo();
  }, [staffId, fiche]);

  // === Gestion des champs ===
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleObjectifChange = (index, field, value) => {
    setFormData(prev => {
      const newObjectifs = [...prev.objectifs];
      newObjectifs[index] = { ...newObjectifs[index], [field]: value };
      return { ...prev, objectifs: newObjectifs };
    });
  };

  const handleTacheChange = (objectifIndex, tacheIndex, field, value) => {
    setFormData(prev => {
      const newObjectifs = [...prev.objectifs];
      const updatedTaches = [...newObjectifs[objectifIndex].taches];
      updatedTaches[tacheIndex] = { ...updatedTaches[tacheIndex], [field]: value };
      newObjectifs[objectifIndex] = { ...newObjectifs[objectifIndex], taches: updatedTaches };
      return { ...prev, objectifs: newObjectifs };
    });
  };

  const addObjectif = () => {
    setFormData(prev => ({
      ...prev,
      objectifs: [...prev.objectifs, createDefaultObjectif()],
    }));
  };

  const removeObjectif = (index) => {
    setFormData(prev => ({
      ...prev,
      objectifs: prev.objectifs.filter((_, i) => i !== index),
    }));
  };

  const addTache = (objectifIndex) => {
    setFormData(prev => {
      const newObjectifs = [...prev.objectifs];
      const taches = [...newObjectifs[objectifIndex].taches];
      taches.push({ ...createDefaultTache(), description: `Tâche ${taches.length + 1}` });
      newObjectifs[objectifIndex] = { ...newObjectifs[objectifIndex], taches };
      return { ...prev, objectifs: newObjectifs };
    });
  };

  const removeTache = (objectifIndex, tacheIndex) => {
    setFormData(prev => {
      const newObjectifs = [...prev.objectifs];
      const updatedTaches = newObjectifs[objectifIndex].taches.filter((_, i) => i !== tacheIndex);
      newObjectifs[objectifIndex] = { ...newObjectifs[objectifIndex], taches: updatedTaches };
      return { ...prev, objectifs: newObjectifs };
    });
  };

  // Soumission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData._id) {
      if (onUpdate) onUpdate(formData);
    } else {
      if (onCreate) onCreate({ ...formData, staffId });
    }
  };

  if (loadingStaff) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100px">
        <CircularProgress />
      </Box>
    );
  }

  // === Render ===
  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        FICHE DES OBJECTIFS
      </Typography>

      {/* Informations générales */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Informations générales
        </Typography>
        <Grid container spacing={2}>
          {[
            { name: "poste", readOnly: true },
            { name: "nom", readOnly: false },
            { name: "direction", readOnly: true },
            { name: "superieur", readOnly: true },
            { name: "statut", readOnly: false },
            { name: "echelon", readOnly: false },
            { name: "binome", readOnly: false },
            { name: "codeFiche", readOnly: false },
          ].map(({ name, readOnly }) => (
            <Grid item xs={12} sm={6} key={name}>
              <TextField
                fullWidth
                name={name}
                label={name.charAt(0).toUpperCase() + name.slice(1)}
                value={formData[name] ?? ""}
                onChange={handleChange}
                InputProps={readOnly ? { readOnly: true } : {}}
              />
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Mission principale */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Mission principale
        </Typography>
        <TextField
          name="missionPrincipale"
          label="Mission"
          fullWidth
          multiline
          rows={3}
          value={formData.missionPrincipale}
          onChange={handleChange}
        />
      </Paper>

      {/* Objectifs */}
      <Typography variant="h6" gutterBottom>
        Objectifs
      </Typography>
      {formData.objectifs.map((objectif, objIndex) => (
        <Paper key={objIndex} elevation={1} sx={{ mb: 4, p: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={5}>
              <TextField
                fullWidth
                label={`Titre ${objIndex + 1}`}
                value={objectif.titre || ""}
                onChange={(e) => handleObjectifChange(objIndex, "titre", e.target.value)}
              />
            </Grid>
            <Grid item xs={5}>
              <TextField
                fullWidth
                label="Moyens"
                multiline
                value={objectif.moyens || ""}
                onChange={(e) => handleObjectifChange(objIndex, "moyens", e.target.value)}
              />
            </Grid>
            <Grid item xs={2}>
              <IconButton onClick={() => removeObjectif(objIndex)} aria-label="Supprimer objectif">
                <RemoveCircleOutline />
              </IconButton>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          {/* Tâches */}
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
            Tâches
          </Typography>
          {objectif.taches.map((tache, tacheIndex) => (
            <Grid container spacing={2} key={tacheIndex} alignItems="center" sx={{ mb: 2 }}>
              <Grid item xs={4}>
                <TextField
                  label={`Tâche ${tacheIndex + 1}`}
                  fullWidth
                  multiline
                  value={tache.description || ""}
                  onChange={(e) => handleTacheChange(objIndex, tacheIndex, "description", e.target.value)}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Indicateur de performance"
                  multiline
                  fullWidth
                  value={tache.indicateur || ""}
                  onChange={(e) => handleTacheChange(objIndex, tacheIndex, "indicateur", e.target.value)}
                />
              </Grid>
              <Grid item xs={2}>
                <IconButton onClick={() => removeTache(objIndex, tacheIndex)} aria-label="Supprimer tâche">
                  <RemoveCircleOutline />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          <Button onClick={() => addTache(objIndex)} startIcon={<AddCircleOutline />} sx={{ mt: 1 }}>
            Ajouter une tâche
          </Button>
        </Paper>
      ))}

      <Button onClick={addObjectif} startIcon={<AddCircleOutline />} sx={{ mb: 3 }}>
        Ajouter un objectif
      </Button>

      {/* Bouton soumission */}
      <Box mt={2}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          aria-label={formData._id ? "Mettre à jour la fiche" : "Créer la fiche"}
        >
          {formData._id ? "Mettre à jour" : "Créer la fiche"}
        </Button>
      </Box>
    </Box>
  );
};

export default FicheObjectifsForm;
