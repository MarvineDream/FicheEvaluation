'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, Button, MenuItem, TextField, Slider, Paper, Typography, Grid, Card, CardContent } from '@mui/material';

const questions = [
  "Est-ce que cette personne a la capacité de se challenger et de challenger les autres?",
  "Quel degré de crédibilité et de confiance parvient-il à créer autour de lui ?",
  "Leadership et influence sur les autres",
  "Quel est son degré de curiosité et de spontanéité ? À quelle fréquence l'individu émet de nouvelles idées et se projette ?",
  "Quelle est la capacité de l'individu à recouper les informations, à prendre les décisions sans attendre de détenir toutes les informations ?",
  "Quel est son degré de rigueur dans l'accomplissement de ses activités ?",
  "Est-ce que cette personne exerce une influence efficace, grâce à ses convictions profondes ?",
  "Est-ce que cette personne anticipe l'avenir et planifie à l'avance, même en cas de grande incertitude ?",
  "Est-ce que cette personne fait preuve de résistance et de ténacité en faisant face aux problèmes et aux échecs ?",
  "Est-ce que cette personne démontre de l'ambition et de la motivation à évoluer et sortir de la zone de confort ?",
  "Est-ce que cette personne est ouverte au feedback, a-t-elle travaillé sur ce point et a-t-elle montré des améliorations tangibles sur ses points de progrès ?"
];

const classificationCards = [
  {
    title: 'Professional',
    color: '#c62828',
    note: 'NOTE INFÉRIEURE OU ÉGALE À 17',
    description: `Les "PROFESSIONAL" sont à l’aise dans leur environnement connu, faisant bien les choses s’ils se trouvent dans une clé claire et un contexte similaire. 
Ils sont moins susceptibles de s’adapter rapidement à de nouveaux rôles ou à des environnements différents.`,
  },
  {
    title: 'Achiever',
    color: '#f9a825',
    note: 'NOTE ENTRE 18 ET 35',
    description: `Les "ACHIEVER" ont la capacité de s’adapter à différentes situations et à des environnements nouveaux. 
Ils ont des qualités de résilience et une capacité d’adaptation pour de nouveaux rôles futurs.`,
  },
  {
    title: 'Potential',
    color: '#1565c0',
    note: 'NOTE SUPÉRIEURE À 35',
    description: `Les "POTENTIAL" pourraient être efficaces dans un large éventail d’environnements et de rôles. 
Ils apprennent vite, réussissent à faire face à l’incertitude, et sont susceptibles de s’adapter à des rôles très différents.`,
  },
];

export default function EvaluationPotentielPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Récupérer staffId et date depuis l'URL
  const staffId = searchParams.get('staffId') || '';
  const date = searchParams.get('date') || '';

  const [criteres, setCriteres] = useState(
    questions.map(q => ({ question: q, note: 3 }))
  );
  const [commentaire, setCommentaire] = useState('');
  const [classification, setClassification] = useState('');
  const [noteGlobale, setNoteGlobale] = useState(0);
  const [moyenne, setMoyenne] = useState(0);
  const [finalClassification, setFinalClassification] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const total = criteres.reduce((acc, curr) => acc + curr.note, 0);
    const avg = total / criteres.length;
    setNoteGlobale(total);
    setMoyenne(Number(avg).toFixed(2));

    if (avg <= 2.5) setFinalClassification('PROFESSIONAL');
    else if (avg <= 4) setFinalClassification('ACHIEVER');
    else setFinalClassification('POTENTIAL');
  }, [criteres]);

  const handleChange = (index, value) => {
    const newCriteres = [...criteres];
    newCriteres[index].note = Math.round(value);
    setCriteres(newCriteres);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://backendeva.onrender.com/Evaluation/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          staffId,
          date,
          type: 'EvaluationPotentiel',
          criteres,
          commentaire,
          classification: finalClassification,
          periodeEvaluation: 'Potentiel',
        }),
      });

      if (!response.ok) throw new Error('Erreur lors de l\'enregistrement');

      alert('Évaluation enregistrée');
      router.push(`/with-sidebar/fichePoste/${staffId}`);
    } catch (error) {
      console.error(error);
      alert('Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  if (!staffId || !date) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h5" color="error">
          Erreur : staffId et date sont requis dans l’URL.
        </Typography>
        <Typography>
          Exemple d’URL attendue : <br />
          <code>/with-sidebar/evaluationPotentiel?staffId=ID&date=YYYY-MM-DD</code>
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      {/* Bloc d'explication, grille d'évaluation, etc. */}
      <Typography variant="h4" gutterBottom>Évaluation du Potentiel</Typography>

      <Box sx={{ border: '1px solid #ccc', borderRadius: 2, p: 3, backgroundColor: '#f9f9f9', mb: 4 }}>
        <Typography variant="h5" color="error" mb={2}>Présentation de l&apos;outil</Typography>
        <Typography paragraph>
          Le but de cet outil est de vous permettre en tant que responsable hiérarchique, d&apos;évaluer le potentiel de croissance de chacun des membres de votre équipe.
          L&apos;outil que vous avez sous les yeux se focalise sur l&apos;évaluation des <strong>compétences comportementales</strong>, en admettant qu&apos;en tant que Line Manager vous avez une idée déjà assez précise des compétences fonctionnelles de la personne.
        </Typography>
        <Typography paragraph>
          Cette évaluation vous permettra ainsi de savoir si oui ou non vous devez inclure la personne évaluée dans un plan de succession pour des rôles plus complexes.
        </Typography>

        <Typography variant="h5" color="error" mt={3} mb={1}>
          Classification des potentiels
        </Typography>

        <Grid container spacing={2}>
          {classificationCards.map((card, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ bgcolor: card.color, color: '#fff' }}>
                <CardContent>
                  <Typography variant="h6">{card.title}</Typography>
                  <Typography fontWeight="bold" mb={1}>{card.note}</Typography>
                  <Typography>{card.description}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Puis la liste des critères */}
      <Typography variant="h6" color="error" mt={3} mb={1}>
        Comment attribuer les notes ?
      </Typography>
      <Typography mb={2}>
        Utilisez la grille ci-dessous pour évaluer chaque critère de 1 à 5 en fonction de l&apos;impact et de la fréquence observée.
      </Typography>

      <Box sx={{ overflowX: 'auto', mb: 4 }}>
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr style={{ backgroundColor: '#c00', color: 'white', textAlign: 'center' }}>
              <th style={{ padding: 8, border: '1px solid #ddd' }}></th>
              {[1, 2, 3, 4, 5].map(n => (
                <th key={n} style={{ padding: 8, border: '1px solid #ddd' }}>{n}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: 12, border: '1px solid #ddd', color: 'red', fontWeight: 'bold', textAlign: 'center' }}>
                Comment attribuer les notes ?
              </td>
              <td style={{ padding: 12, border: '1px solid #ddd' }}>
                La personne a <strong>occasionnellement</strong> démontré la qualité évaluée, mais n&apos;a produit <strong>aucun impact</strong>.
              </td>
              <td style={{ padding: 12, border: '1px solid #ddd' }}>
                La personne a <strong>occasionnellement</strong> démontré la qualité évaluée, et ces fois-là, <strong>a produit un certain impact</strong>.
              </td>
              <td style={{ padding: 12, border: '1px solid #ddd' }}>
                La personne a <strong>souvent</strong> démontré la qualité évaluée, <strong>avec un impact visible</strong>, mais <strong>pas de manière consistante</strong>.
              </td>
              <td style={{ padding: 12, border: '1px solid #ddd' }}>
                La personne a de <strong>façon consistante</strong> démontré la qualité évaluée, <strong>avec un clair impact</strong>.
              </td>
              <td style={{ padding: 12, border: '1px solid #ddd' }}>
                La personne a de <strong>façon consistante</strong> démontré la qualité observée, avec un <strong>large impact allant même au-delà de son environnement de travail</strong>.
              </td>
            </tr>
          </tbody>
        </table>
      </Box>

      {criteres.map((critere, index) => (
        <Paper key={index} sx={{ p: 2, mb: 3 }}>
          <Typography>{critere.question}</Typography>
          <Slider
            value={critere.note}
            onChange={(e, val) => handleChange(index, val)}
            step={1}
            marks
            min={1}
            max={5}
            valueLabelDisplay="auto"
          />
        </Paper>
      ))}

      <Typography variant="h6" mt={4}>
        Note globale : {noteGlobale} / {criteres.length * 5} ({moyenne} / 5)
      </Typography>

      <Typography variant="h6" color="error" mt={2}>
        Classification finale : {finalClassification}
      </Typography>

      <TextField
        label="Commentaire global"
        multiline
        rows={4}
        fullWidth
        sx={{ mt: 3 }}
        value={commentaire}
        onChange={e => setCommentaire(e.target.value)}
      />

      <TextField
        select
        label="Classification finale"
        fullWidth
        sx={{ mt: 2 }}
        value={classification}
        onChange={e => setClassification(e.target.value)}
      >
        <MenuItem value="A">A – Très haut potentiel</MenuItem>
        <MenuItem value="B+">B+ – Potentiel de progression rapide</MenuItem>
        <MenuItem value="B">B – Potentiel de progression à moyen terme</MenuItem>
        <MenuItem value="C">C – Potentiel à confirmer / incertain</MenuItem>
        <MenuItem value="D">D – Potentiel limité</MenuItem>
      </TextField>

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={loading}
        sx={{ mt: 4 }}
      >
        Enregistrer l&apos;évaluation
      </Button>
    </Box>
  );
}
