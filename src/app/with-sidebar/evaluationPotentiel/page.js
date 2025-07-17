'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    Box, Button, Slider, Paper, Typography, Grid, Card, CardContent,
} from '@mui/material';

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
        description: `Les "PROFESSIONAL" sont à l’aise dans leur environnement connu...`,
    },
    {
        title: 'Achiever',
        color: '#f9a825',
        note: 'NOTE ENTRE 18 ET 35',
        description: `Les "ACHIEVER" ont la capacité de s’adapter à différentes situations...`,
    },
    {
        title: 'Potential',
        color: '#1565c0',
        note: 'NOTE SUPÉRIEURE À 35',
        description: `Les "POTENTIAL" pourraient être efficaces dans un large éventail d’environnements...`,
    },
];

export default function EvaluationPotentielPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const staffId = searchParams.get('staffId') || '';
    const date = searchParams.get('date') || '';

    const [criteres, setCriteres] = useState(questions.map(q => ({ question: q, note: 3 })));
    const [commentaire, setCommentaire] = useState('');
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
        const token = localStorage.getItem('token');

        try {
            const response = await fetch('http://localhost:7000/Evaluation/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    staffId,
                    criteres,
                    commentaire,
                    classificationFinale: finalClassification,
                    periodeEvaluation: 'Potentiel',
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("❌ Réponse serveur:", response.status, errorText);
                throw new Error("Erreur lors de l'enregistrement");
            }

            alert('Évaluation enregistrée');
            router.push(`/with-sidebar/fichePoste/${staffId}`);
        } catch (error) {
            console.error(error);
            alert("Erreur lors de l'enregistrement");
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
                    Exemple d’URL attendue : <code>/with-sidebar/evaluationPotentiel?staffId=ID&date=YYYY-MM-DD</code>
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>Évaluation du Potentiel</Typography>

            {/* Présentation */}
            <Box sx={{ border: '1px solid #ccc', borderRadius: 2, p: 3, backgroundColor: '#f9f9f9', mb: 4 }}>
                <Typography variant="h5" color="error" mb={2}>Présentation de l&apos;outil</Typography>
                <Typography paragraph>
                    Cet outil vous permet d&apos;évaluer le <strong>potentiel de croissance</strong> des membres de votre équipe sur des compétences comportementales.
                </Typography>

                <Typography variant="h5" color="error" mt={3} mb={1}>Classification des potentiels</Typography>
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

            {/* Légende de la notation */}
            <Typography variant="h6" color="error" mt={3} mb={1}>Comment attribuer les notes ?</Typography>
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
                                Interprétation
                            </td>
                            <td style={{ padding: 12, border: '1px solid #ddd' }}>
                                Occasionnelle sans impact
                            </td>
                            <td style={{ padding: 12, border: '1px solid #ddd' }}>
                                Occasionnelle avec un certain impact
                            </td>
                            <td style={{ padding: 12, border: '1px solid #ddd' }}>
                                Fréquente avec impact visible mais non consistant
                            </td>
                            <td style={{ padding: 12, border: '1px solid #ddd' }}>
                                Consistante avec clair impact
                            </td>
                            <td style={{ padding: 12, border: '1px solid #ddd' }}>
                                Consistante avec impact large
                            </td>
                        </tr>
                    </tbody>
                </table>
            </Box>

            {/* Critères de notation */}
            {criteres.map((critere, index) => (
                <Paper key={index} sx={{ p: 2, mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography>{critere.question}</Typography>
                        <Typography variant="body2" color="primary" fontWeight="bold">
                            Note : {critere.note}/5
                        </Typography>
                    </Box>
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

            {/* Résumé */}
            <Typography variant="h6" mt={4}>Note globale : {noteGlobale} / {criteres.length * 5} ({moyenne} / 5)</Typography>
            <Typography variant="h6" color="error" mt={2}>Classification automatique : {finalClassification}</Typography>

            {/* Commentaire */}
            <textarea
                rows={4}
                style={{ width: '100%', marginTop: 16, padding: 10 }}
                placeholder="Commentaire global"
                value={commentaire}
                onChange={e => setCommentaire(e.target.value)}
            />

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
