"use client";

import React, { useState, useEffect } from "react";
import {
  TextField,
  Grid,
  Typography,
  Box,
  CircularProgress,
  Button,
  Paper,
  Slider,
  Snackbar,
  Alert,
  MenuItem,
  Divider,
} from "@mui/material";

const periodes = ["Mensuel", "T1", "T2", "T3", "T4", "Annuel"];

const ObjectifsForm = ({ staffId, onBack, onNext }) => {
  const [fiche, setFiche] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  // --- Calculs ---
  const calculerNote = (attendu, realise, ponderation) => {
    const a = parseFloat(attendu) || 0;
    const r = parseFloat(realise) || 0;
    const p = parseFloat(ponderation) || 0;
    if (a === 0) return 0;
    return ((r / a) * p);
  };

  const calculerScoreObjectif = (objectif) => {
    let totalNote = 0;
    let totalPonderation = 0;

    objectif.taches?.forEach((t) => {
      totalNote += calculerNote(t.attendu, t.realise, t.ponderation);
      totalPonderation += parseFloat(t.ponderation || 0);
    });

    objectif.sousTaches?.forEach((s) => {
      totalNote += calculerNote(s.attendu, s.realise, s.ponderation);
      totalPonderation += parseFloat(s.ponderation || 0);
    });

    const scoreActivite = totalNote.toFixed(2);
    const noteFinale = totalPonderation ? ((totalNote / totalPonderation) * 100).toFixed(2) : 0;

    return { scoreActivite, noteFinale };
  };

  const calculerNoteGlobale = (objectifs) => {
    if (!objectifs || !objectifs.length) return 0;
    const notes = objectifs.map((obj) => parseFloat(obj.noteFinale || 0));
    const moyenne = notes.reduce((sum, n) => sum + n, 0) / notes.length;
    return moyenne.toFixed(2);
  };

  const prepareFichePourSauvegarde = (fiche) => {
    const copy = structuredClone(fiche);

    copy.objectifs.forEach((objectif) => {
      const { scoreActivite, noteFinale } = calculerScoreObjectif(objectif);
      objectif.scoreActivite = parseFloat(scoreActivite);
      objectif.noteFinale = parseFloat(noteFinale);
    });

    copy.noteGlobale = parseFloat(calculerNoteGlobale(copy.objectifs));

    return copy;
  };

  // --- Charger la fiche depuis le backend ---
  useEffect(() => {
    if (!staffId) return;

    const fetchFiche = async () => {
      try {
        const res = await fetch(`http://localhost:7000/fiche-objectifs/${staffId}`);
        if (!res.ok) throw new Error("Impossible de récupérer la fiche");
        const data = await res.json();
        setFiche(data);
      } catch (error) {
        console.error("Erreur chargement fiche :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiche();
  }, [staffId]);

  // --- Mise à jour locale d’un champ ---
  const handleLocalChange = (objectifIdx, tacheType, tacheIdx, field, value) => {
    setFiche((prev) => {
      const copy = structuredClone(prev);
      copy.objectifs[objectifIdx][tacheType][tacheIdx][field] = value;

      // Recalcul automatique des notes pour l'objectif
      const { scoreActivite, noteFinale } = calculerScoreObjectif(copy.objectifs[objectifIdx]);
      copy.objectifs[objectifIdx].scoreActivite = parseFloat(scoreActivite);
      copy.objectifs[objectifIdx].noteFinale = parseFloat(noteFinale);

      // Recalcul de la note globale
      copy.noteGlobale = parseFloat(calculerNoteGlobale(copy.objectifs));

      return copy;
    });
  };

  // --- Vérification pondérations ---
  const totalPonderationObjectif = (objectif) => {
    let total = 0;
    objectif.taches?.forEach((t) => (total += parseFloat(t.ponderation || 0)));
    objectif.sousTaches?.forEach((s) => (total += parseFloat(s.ponderation || 0)));
    return total;
  };

  // --- Sauvegarde vers le backend ---
  const handleSave = async () => {
    if (!fiche) return;

    const newErrors = {};
    fiche.objectifs.forEach((objectif, idx) => {
      const total = totalPonderationObjectif(objectif);
      if (total > 100) newErrors[idx] = `⚠️ La somme des pondérations dépasse 100% (${total}%)`;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrorMessages(newErrors);
      setSnackbar({ open: true, message: "Certains objectifs dépassent 100% !", severity: "error" });
      return;
    }

    setErrorMessages({});
    setSaving(true);

    try {
      const method = fiche._id ? "PUT" : "POST";
      const url = fiche._id
        ? `http://localhost:7000/fiche-objectifs/${fiche._id}`
        : `http://localhost:7000/fiche-objectifs`;

      const ficheAvecNotes = prepareFichePourSauvegarde(fiche);

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ficheAvecNotes),
      });

      if (!res.ok) throw new Error("Erreur lors de la sauvegarde");
      const data = await res.json();
      setFiche(data);
      setSnackbar({ open: true, message: "Sauvegarde réussie !", severity: "success" });
    } catch (error) {
      console.error(error);
      setSnackbar({ open: true, message: "Erreur lors de la sauvegarde !", severity: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <Box display="flex" alignItems="center" gap={2}>
        <CircularProgress size={24} />
        <Typography>Chargement de la fiche d’objectifs...</Typography>
      </Box>
    );

  if (!fiche || !fiche.objectifs?.length)
    return <Typography>Aucun objectif trouvé pour ce collaborateur.</Typography>;

  return (
    <>
      {fiche.objectifs.map((objectif, i) => {
        const totalPonderation = totalPonderationObjectif(objectif);
        const isOver = totalPonderation > 100;

        return (
          <Paper
            key={i}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 3,
              boxShadow: 3,
              backgroundColor: isOver ? "#ffe6e6" : "#fafafa",
              border: isOver ? "1px solid red" : "none",
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Objectif {i + 1} : {objectif.titre}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Mission : {objectif.mission}
            </Typography>

            {errorMessages[i] && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errorMessages[i]}
              </Alert>
            )}

            {/* Tâches */}
            {objectif.taches?.map((tache, j) => (
              <Paper
                key={`tache-${j}`}
                sx={{ p: 2, mb: 2, borderRadius: 2, backgroundColor: "white" }}
                variant="outlined"
              >
                <Typography variant="subtitle2" gutterBottom>
                  Tâche {j + 1}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Description"
                      value={tache.description || ""}
                      InputProps={{ readOnly: true }}
                      fullWidth
                      multiline
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Indicateur"
                      value={tache.indicateurPerformance || tache.indicateur || ""}
                      InputProps={{ readOnly: true }}
                      fullWidth
                      multiline
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Période"
                      select
                      fullWidth
                      size="small"
                      value={tache.periode || ""}
                      onChange={(e) => handleLocalChange(i, "taches", j, "periode", e.target.value)}
                    >
                      {periodes.map((p) => (
                        <MenuItem key={p} value={p}>
                          {p}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">Pondération :</Typography>
                    <Slider
                      value={tache.ponderation || 0}
                      onChange={(e, val) => handleLocalChange(i, "taches", j, "ponderation", val)}
                      step={1}
                      marks
                      min={0}
                      max={100}
                      valueLabelDisplay="on"
                      sx={{ color: isOver ? "red" : "primary.main" }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Attendu(%)"
                      value={tache.attendu || ""}
                      onChange={(e) => handleLocalChange(i, "taches", j, "attendu", e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Réalisé(%)"
                      value={tache.realise || ""}
                      onChange={(e) => handleLocalChange(i, "taches", j, "realise", e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Commentaire"
                      value={tache.commentaire || ""}
                      onChange={(e) => handleLocalChange(i, "taches", j, "commentaire", e.target.value)}
                      fullWidth
                      multiline
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="body2" color="primary">
                      ✅ Note calculée : {calculerNote(tache.attendu, tache.realise, tache.ponderation).toFixed(2)} %
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            ))}

            {/* Sous-tâches */}
            {objectif.sousTaches?.map((sous, k) => (
              <Paper key={`sous-${k}`} sx={{ p: 2, mb: 2, borderRadius: 2, backgroundColor: "white" }} variant="outlined">
                <Typography variant="subtitle2" gutterBottom>
                  Sous-tâche {k + 1}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField label="Description" value={sous.titre || ""} InputProps={{ readOnly: true }} fullWidth multiline />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField label="Indicateur" value={sous.indicateur || ""} InputProps={{ readOnly: true }} fullWidth multiline />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Période"
                      select
                      fullWidth
                      size="small"
                      value={sous.periode || ""}
                      onChange={(e) => handleLocalChange(i, "sousTaches", k, "periode", e.target.value)}
                    >
                      {periodes.map((p) => (
                        <MenuItem key={p} value={p}>
                          {p}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">Pondération :</Typography>
                    <Slider
                      value={sous.ponderation || 0}
                      onChange={(e, val) => handleLocalChange(i, "sousTaches", k, "ponderation", val)}
                      step={5}
                      marks
                      min={0}
                      max={100}
                      valueLabelDisplay="on"
                      sx={{ color: isOver ? "red" : "primary.main" }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField label="Attendu" value={sous.attendu || ""} onChange={(e) => handleLocalChange(i, "sousTaches", k, "attendu", e.target.value)} fullWidth />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField label="Réalisé" value={sous.realise || ""} onChange={(e) => handleLocalChange(i, "sousTaches", k, "realise", e.target.value)} fullWidth />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField label="Commentaire" value={sous.commentaire || ""} onChange={(e) => handleLocalChange(i, "sousTaches", k, "commentaire", e.target.value)} fullWidth multiline />
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="body2" color="primary">
                      ✅ Note calculée : {calculerNote(sous.attendu, sous.realise, sous.ponderation).toFixed(2)} %
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            ))}

            <Typography variant="h6" sx={{ mt: 2 }}>
              Note finale de l’objectif : {objectif.noteFinale?.toFixed(2)} %
            </Typography>
          </Paper>
        );
      })}

      <Divider sx={{ my: 3 }} />
      <Typography variant="h5" align="center" color="secondary" gutterBottom>
        🌍 Note Globale : {fiche.noteGlobale?.toFixed(2)} %
      </Typography>

      <Box display="flex" gap={2} mt={2}>
        {onBack && <Button variant="outlined" onClick={onBack}>Retour</Button>}
        <Button variant="contained" color="primary" onClick={handleSave} disabled={saving}>
          {saving ? "Sauvegarde..." : "Sauvegarder"}
        </Button>

        {onNext && (
          <Button variant="contained" color="success" onClick={onNext}>
            Suivant
          </Button>
        )}
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ObjectifsForm;

