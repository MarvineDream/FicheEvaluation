"use client";

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  Container, Typography, TextField, Grid, Button, Box, MenuItem, Paper,
  IconButton, Table, TableBody, TableCell, TableHead, TableRow, Select
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';

export default function EvaluationMiParcours() {
  const searchParams = useSearchParams();
  const staffId = searchParams.get('staffId');

  const [form, setForm] = useState({
    staffId: '',
    managerId: '',
    emploi: '',
    direction: '',
    typeContrat: '',
    dateEmbauche: '',
    anciennetePosteMois: 0,
    classification: '',
    echelon: '',
    dateEvaluation: '',
    heure: '',
    objectifsFichePoste: [],
    objectifsHorsFichePoste: [],
    competences: [],
    performanceFichePoste: 0,
    performanceHorsFichePoste: 0,
    moyennePerformance: 0,
    appreciationManager: '',
    niveauAtteinte: '',
    recommandations: '',
    commentaireCollaborateur: '',
    souhaitCollaborateur: '',
    avisDirecteur: '',
    demandeValidee: '',
    autresPropositions: '',
    statut: 'En cours'
  });

  useEffect(() => {
    if (staffId) {
      setForm(prev => ({ ...prev, staffId }));
    }
  }, [staffId]);

  useEffect(() => {
    const total = Number(form.performanceFichePoste || 0) + Number(form.performanceHorsFichePoste || 0);
    const moyenne = total / 2;
    setForm(prev => ({ ...prev, moyennePerformance: isNaN(moyenne) ? 0 : Math.round(moyenne) }));
  }, [form.performanceFichePoste, form.performanceHorsFichePoste]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch('/api/evaluation-mi-parcours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error("Erreur lors de l'enregistrement");
      alert('Évaluation enregistrée.');
    } catch (err) {
      alert('Erreur : ' + err.message);
    }
  };

  const updateArrayField = (type, index, field, value) => {
    const updated = [...form[type]];
    updated[index][field] = value;
    setForm(prev => ({ ...prev, [type]: updated }));
  };

  const addItem = (type, item) => {
    setForm(prev => ({ ...prev, [type]: [...prev[type], item] }));
  };

  const removeItem = (type, index) => {
    const updated = [...form[type]];
    updated.splice(index, 1);
    setForm(prev => ({ ...prev, [type]: updated }));
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>Évaluation à mi-parcours</Typography>

        {/* Informations générales */}
        <Box mt={4}>
          <Typography variant="h6">Informations générales</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}><TextField label="Nom de l'agent" name="nom" value={form.nom} onChange={handleChange} fullWidth /></Grid>
            <Grid item xs={12} sm={6}><TextField label="Prénom de l'agent" name="prenom" value={form.prenom} onChange={handleChange} fullWidth /></Grid>
            <Grid item xs={12} sm={6}><TextField label="Nom du supérieur hiérarchique" name="managerNom" value={form.managerNom} onChange={handleChange} fullWidth /></Grid>
            <Grid item xs={12} sm={6}><TextField label="Emploi" name="emploi" value={form.emploi} onChange={handleChange} fullWidth /></Grid>
            <Grid item xs={12} sm={6}><TextField label="Direction" name="direction" value={form.direction} onChange={handleChange} fullWidth /></Grid>
            <Grid item xs={12} sm={6}>
              <TextField select label="Type de contrat" name="typeContrat" value={form.typeContrat} onChange={handleChange} fullWidth>
                <MenuItem value="CDD">CDD</MenuItem>
                <MenuItem value="CDI">CDI</MenuItem>
                <MenuItem value="Consultant">Consultant</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField type="date" label="Date d'embauche" name="dateEmbauche" value={form.dateEmbauche} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} sm={6}><TextField label="Ancienneté (mois)" name="anciennetePosteMois" value={form.anciennetePosteMois} onChange={handleChange} type="number" fullWidth /></Grid>
            <Grid item xs={12} sm={6}><TextField label="Classification" name="classification" value={form.classification} onChange={handleChange} fullWidth /></Grid>
            <Grid item xs={12} sm={6}><TextField label="Echelon" name="echelon" value={form.echelon} onChange={handleChange} fullWidth /></Grid>
            <Grid item xs={12} sm={6}><TextField type="date" label="Date d'évaluation" name="dateEvaluation" value={form.dateEvaluation} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} /></Grid>
            <Grid item xs={12} sm={6}><TextField label="Heure" name="heure" value={form.heure} onChange={handleChange} fullWidth placeholder="HH:MM" /></Grid>
          </Grid>
        </Box>

        {/* Objectifs Fiche Poste */}
        <Box mt={4}>
          <Typography variant="h6">Objectifs sur la fiche de poste</Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Titre</TableCell>
                <TableCell>Indicateurs</TableCell>
                <TableCell>Attendu</TableCell>
                <TableCell>Réalisé</TableCell>
                <TableCell>Commentaires</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {form.objectifsFichePoste.map((obj, i) => (
                <TableRow key={i}>
                  <TableCell><TextField value={obj.titre} onChange={e => updateArrayField('objectifsFichePoste', i, 'titre', e.target.value)} fullWidth /></TableCell>
                  <TableCell><TextField value={obj.indicateurs} onChange={e => updateArrayField('objectifsFichePoste', i, 'indicateurs', e.target.value)} fullWidth /></TableCell>
                  <TableCell><TextField type="number" value={obj.attendu} onChange={e => updateArrayField('objectifsFichePoste', i, 'attendu', e.target.value)} fullWidth /></TableCell>
                  <TableCell><TextField type="number" value={obj.realise} onChange={e => updateArrayField('objectifsFichePoste', i, 'realise', e.target.value)} fullWidth /></TableCell>
                  <TableCell><TextField value={obj.commentaire} onChange={e => updateArrayField('objectifsFichePoste', i, 'commentaire', e.target.value)} fullWidth /></TableCell>
                  <TableCell><IconButton onClick={() => removeItem('objectifsFichePoste', i)}><Delete /></IconButton></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button startIcon={<Add />} onClick={() => addItem('objectifsFichePoste', { titre: '', indicateurs: '', attendu: 0, realise: 0, commentaire: '' })} sx={{ mt: 1 }}>
            Ajouter un objectif
          </Button>
        </Box>

        {/* Appreciation performance réalisée année en cours */}
        <Box mt={6}>
          <Typography variant="h6">Appréciation de la performance réalisée (année en cours)</Typography>
          <TextField
            name="appreciationOperationnelle"
            value={form.appreciationOperationnelle}
            onChange={handleChange}
            fullWidth multiline rows={4}
            label="Commentaires sur les performances opérationnelles"
          />
        </Box>

        {/* Compétences */}
        <Box mt={4}>
          <Typography variant="h6">Compétences et notation</Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Domaine</TableCell>
                <TableCell>Compétence</TableCell>
                <TableCell>Note</TableCell>
                <TableCell>Axes d&apos;amélioration</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {form.competences.map((c, i) => (
                <TableRow key={i}>
                  <TableCell><TextField value={c.domaine} onChange={e => updateArrayField('competences', i, 'domaine', e.target.value)} fullWidth /></TableCell>
                  <TableCell><TextField value={c.libelle} onChange={e => updateArrayField('competences', i, 'libelle', e.target.value)} fullWidth /></TableCell>
                  <TableCell>
                    <Select value={c.note} onChange={e => updateArrayField('competences', i, 'note', e.target.value)} fullWidth>
                      <MenuItem value="TB">Très Bien</MenuItem>
                      <MenuItem value="B">Bien</MenuItem>
                      <MenuItem value="P">Passable</MenuItem>
                      <MenuItem value="I">Insuffisant</MenuItem>
                      <MenuItem value="PC">Pas Concerné</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell><TextField value={c.axesAmelioration} onChange={e => updateArrayField('competences', i, 'axesAmelioration', e.target.value)} fullWidth /></TableCell>
                  <TableCell><IconButton onClick={() => removeItem('competences', i)}><Delete /></IconButton></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button startIcon={<Add />} onClick={() => addItem('competences', { domaine: '', libelle: '', note: '', axesAmelioration: '' })} sx={{ mt: 1 }}>
            Ajouter une compétence
          </Button>
        </Box>

        <Box mt={4}>
          <Typography variant="subtitle1">Moyenne des performances : {form.moyennePerformance}%</Typography>
        </Box>

        <Box mt={4} textAlign="right">
          <Button variant="contained" color="primary" onClick={handleSubmit}>Enregistrer</Button>
        </Box>

        {/* Commentaires et souhaits du collaborateur */}
        <Box mt={6}>
          <Typography variant="h6">Commentaires et souhaits du collaborateur</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField label="Commentaires" name="commentaireCollaborateur" value={form.commentaireCollaborateur} onChange={handleChange} fullWidth multiline rows={3} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Souhaits (changement, accompagnement...)" name="souhaitCollaborateur" value={form.souhaitCollaborateur} onChange={handleChange} fullWidth multiline rows={3} />
            </Grid>
          </Grid>
        </Box>

        {/* Appréciation manager */}
        <Box mt={6}>
          <Typography variant="h6">Appréciation du supérieur hiérarchique</Typography>
          <TextField name="appreciationManager" value={form.appreciationManager} onChange={handleChange} fullWidth multiline rows={3} />
        </Box>

        {/* Avis directeur */}
        <Box mt={6}>
          <Typography variant="h6">Avis et appréciation du Directeur</Typography>
          <TextField name="avisDirecteur" value={form.avisDirecteur} onChange={handleChange} fullWidth multiline rows={3} />
        </Box>

        {/* RH / autres propositions */}
        <Box mt={6}>
          <Typography variant="h6">Décision RH et autres propositions</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}><TextField label="Demande validée" name="demandeValidee" value={form.demandeValidee} onChange={handleChange} fullWidth /></Grid>
            <Grid item xs={12}><TextField label="Autres propositions" name="autresPropositions" value={form.autresPropositions} onChange={handleChange} fullWidth multiline rows={2} /></Grid>
          </Grid>
        </Box>

        {/* Bouton final */}
        <Box mt={6} textAlign="right">
          <Button variant="contained" color="primary" onClick={handleSubmit}>Enregistrer</Button>
        </Box>
      </Paper>
    </Container>
  );
}
