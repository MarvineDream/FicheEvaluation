"use client";

import React, { useState, useEffect } from 'react';
import {
  Box, Grid, TextField, Typography, MenuItem,
  IconButton, Button, LinearProgress
} from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';

const periodes = ['Mensuel', 'T1', 'T2', 'T3', 'Annuel'];

const ObjectifsFixesSection = ({ objectifsFixes, setObjectifsFixes, onScoreChange }) => {
  const [scoreObjectifs, setScoreObjectifs] = useState(0);

  const handleAddObjectif = () => {
    setObjectifsFixes([
      ...objectifsFixes,
      { titre: '', periode: '', pourcentage: 0, sousTaches: [''] }
    ]);
  };

  const handleRemoveObjectif = (index) => {
    const newObjectifs = [...objectifsFixes];
    newObjectifs.splice(index, 1);
    setObjectifsFixes(newObjectifs);
  };

  const handleChange = (index, field, value) => {
    const newObjectifs = [...objectifsFixes];
    newObjectifs[index][field] = value;
    setObjectifsFixes(newObjectifs);
  };

  const handleChangeSousTache = (index, sousIndex, value) => {
    const newObjectifs = [...objectifsFixes];
    newObjectifs[index].sousTaches[sousIndex] = value;
    setObjectifsFixes(newObjectifs);
  };

  const handleAddSousTache = (index) => {
    const newObjectifs = [...objectifsFixes];
    newObjectifs[index].sousTaches.push('');
    setObjectifsFixes(newObjectifs);
  };

  const handleRemoveSousTache = (index, sousIndex) => {
    const newObjectifs = [...objectifsFixes];
    newObjectifs[index].sousTaches.splice(sousIndex, 1);
    setObjectifsFixes(newObjectifs);
  };

  const calculateScore = React.useCallback(() => {
    let totalScore = 0;
    objectifsFixes.forEach((objectif) => {
      if (objectif.sousTaches.length > 0) {
        const notes = objectif.sousTaches.map((n) => Number(n));
        const moyenne = notes.reduce((a, b) => a + b, 0) / notes.length;
        totalScore += (moyenne * objectif.pourcentage) / 5;
      }
    });
    return Number(totalScore.toFixed(2));
  }, [objectifsFixes]);

  const getAppreciation = (score) => {
    if (score >= 85) return "Très bon travail";
    if (score >= 70) return "Satisfaisant";
    if (score >= 50) return "Doit être amélioré";
    return "Insuffisant";
  };

  useEffect(() => {
    const score = calculateScore();
    setScoreObjectifs(score);
    if (onScoreChange) onScoreChange(score);
  }, [calculateScore, onScoreChange]);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Objectifs fixés</Typography>
      {/* contenu identique */}
    </Box>
  );
};

export default ObjectifsFixesSection;
