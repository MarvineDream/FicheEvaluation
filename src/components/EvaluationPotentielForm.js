'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, Button, MenuItem, TextField, Slider, Paper } from '@mui/material';
import { Card, CardContent, Typography, Grid } from '@mui/material';

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
        color: '#c62828', // rouge foncé
        note: 'NOTE INFÉRIEURE OU ÉGALE À 17',
        description: `Les "PROFESSIONAL" sont à l’aise dans leur environnement connu, faisant bien les choses s’ils se trouvent dans une clé claire et un contexte similaire. 
    Ils sont moins susceptibles de s’adapter rapidement à de nouveaux rôles ou à des environnements différents.`,
    },
    {
        title: 'Achiever',
        color: '#f9a825', // orange doré
        note: 'NOTE ENTRE 18 ET 35',
        description: `Les "ACHIEVER" ont la capacité de s’adapter à différentes situations et à des environnements nouveaux. 
    Ils ont des qualités de résilience et une capacité d’adaptation pour de nouveaux rôles futurs.`,
    },
    {
        title: 'Potential',
        color: '#1565c0', // bleu foncé
        note: 'NOTE SUPÉRIEURE À 35',
        description: `Les "POTENTIAL" pourraient être efficaces dans un large éventail d’environnements et de rôles. 
    Ils apprennent vite, réussissent à faire face à l’incertitude, et sont susceptibles de s’adapter à des rôles très différents.`,
    },
];

export default function EvaluationPotentielForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const staffId = searchParams.get('staffId');

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
        setMoyenne(avg.toFixed(2));

        if (avg <= 2.5) setFinalClassification('PROFESSIONAL');
        else if (avg <= 4) setFinalClassification('ACHIEVER');
        else setFinalClassification('POTENTIAL');
    }, [criteres]);

    const handleChange = (index, value) => {
        const newCriteres = [...criteres];
        newCriteres[index].note = Math.round(value); // forcer entier
        setCriteres(newCriteres);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/evaluations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    staffId,
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

    return (
    <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>Évaluation du Potentiel</Typography>
        
        <Box sx={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', boxShadow: 2, backgroundColor: '#f9f9f9' }}>
            <Typography variant="h5" sx={{ color: 'red', mt: 4 }}>Présentation de l&apos;outil</Typography>
            <Typography sx={{ mt: 2 }}>
                Le but de cet outil est de vous permettre en tant que responsable hiérarchique, d&apos;évaluer le potentiel de croissance de chacun des membres de votre équipe.
                L&apos;outil que vous avez sous les yeux se focalise sur l&apos;évaluation des <strong>compétences comportementales</strong>, en admettant qu&apos;en tant que Line Manager vous avez une idée déjà assez précise des compétences fonctionnelles de la personne (qui est en grande partie reprise par l&apos;évaluation des performances annuelles).
                Cette évaluation vous permettra ainsi de savoir si oui ou non vous devez inclure la personne évaluée dans un plan de succession pour des rôles plus complexes ou au-dessus de ceux occupés actuellement.
            </Typography>

            <Typography variant="h5" sx={{ color: 'red', mt: 4 }}>Évaluation du Potentiel</Typography>
            <Typography sx={{ mt: 2 }}>
                La Performance et le Potentiel sont différents. La performance évalue l&apos;individu par rapport aux objectifs qui lui ont été assignés.
                Tandis que le Potentiel évalue les chances de succès futur de la personne, sur la base des qualités démontrées à ce jour.
                Votre évaluation est une photographie de l&apos;individu sur la base de ce que vous savez et observez maintenant,
                <em> c&apos;est une prédiction et non une situation définitive de la personne</em>. Ceci justifie la nécessité de prendre les avis {'« extérieurs »'}, et également de procéder à cet exercice de manière répétée, afin d&apos;affiner le résultat.
            </Typography>

            <Typography sx={{ mt: 2 }}>
                Pour affiner le diagnostic, il est important de vérifier ou de s&apos;appuyer sur un certain nombre de points :
            </Typography>
            <Box component="ul" sx={{ pl: 4 }}>
                <li>Des attitudes que l&apos;individu a démontrées au cours des 6 à 12 derniers mois.</li>
                <li>Des exemples précis, permettant de soutenir de manière rigoureuse ledit diagnostic.</li>
                <li>Une bonne balance entre la réalité et la perception, ce qui implique de prendre en considération les inputs d&apos;autres personnes.</li>
            </Box>

            <Typography sx={{ mt: 2 }}>
                Il est capital de mettre une certaine rigueur dans l&apos;évaluation, car sur estimer le potentiel d&apos;un individu fait courir le risque de ne pas investir suffisamment sur son développement, et d&apos;être surpris plus tard.
                Il vaut mieux encore sous-estimer son potentiel et lui appliquer un programme solide, quitte à ce que plus tard on réalise qu&apos;il/elle se développe plus vite que ce qui était estimé. On a alors une surprise positive et non l&apos;inverse.
            </Typography>
        </Box>

        <Grid container spacing={2} sx={{ mt: 4 }}>
            <Grid item xs={12} md={6}>
                <Box sx={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', boxShadow: 2, backgroundColor: '#f9f9f9' }}>
                    <Typography variant="h6" align="center" gutterBottom>
                        Classification des potentiels
                    </Typography>

                    <Grid container spacing={2}>
                        {classificationCards.map((card, index) => (
                            <Grid item xs={12} md={4} key={index}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        backgroundColor: card.color,
                                        color: '#fff',
                                        borderRadius: 2,
                                    }}
                                >
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>{card.title}</Typography>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                            {card.note}
                                        </Typography>
                                        <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                                            {card.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Grid>

            <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mt: 6, color: 'red' }}>
                    Comment attribuer les notes ?
                </Typography>

                <Typography variant="body1" sx={{ mt: 1, mb: 2 }}>
                    Utilisez la grille ci-dessous pour évaluer chaque critère de 1 à 5 en fonction de l&apos;impact et de la fréquence observée.
                </Typography>

                <Box sx={{ overflowX: 'auto', mb: 4 }}>
                    <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#c00', color: 'white', textAlign: 'center' }}>
                                <th style={{ padding: '8px', border: '1px solid #ddd' }}></th>
                                <th style={{ padding: '8px', border: '1px solid #ddd' }}>1</th>
                                <th style={{ padding: '8px', border: '1px solid #ddd' }}>2</th>
                                <th style={{ padding: '8px', border: '1px solid #ddd' }}>3</th>
                                <th style={{ padding: '8px', border: '1px solid #ddd' }}>4</th>
                                <th style={{ padding: '8px', border: '1px solid #ddd' }}>5</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ padding: '12px', border: '1px solid #ddd', color: 'red', fontWeight: 'bold', textAlign: 'center' }}>
                                    Comment attribuer les notes ?
                                </td>
                                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                                    La personne a <strong>occasionnellement</strong> démontré la qualité évaluée, mais n&apos;a produit <strong>aucun impact</strong>.
                                </td>
                                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                                    La personne a <strong>occasionnellement</strong> démontré la qualité évaluée, et ces fois-là, <strong>a produit un certain impact</strong>.
                                </td>
                                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                                    La personne a <strong>souvent</strong> démontré la qualité évaluée, <strong>avec un impact visible</strong>, mais <strong>pas de manière consistante</strong>.
                                </td>
                                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                                    La personne a de <strong>façon consistante</strong> démontré la qualité évaluée, <strong>avec un clair impact</strong>.
                                </td>
                                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                                    La personne a de <strong>façon consistante</strong> démontré la qualité observée, avec un <strong>large impact allant même au-delà de son environnement de travail</strong>.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </Box>

                {criteres.map((critere, index) => (
                    <Paper key={index} elevation={2} sx={{ p: 2, mt: 3 }}>
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

                <Typography variant="h6" sx={{ mt: 4 }}>
                    Note globale : {noteGlobale} / {criteres.length * 5} ({moyenne} / 5)
                </Typography>

                <Typography variant="h6" sx={{ mt: 2, color: 'red' }}>
                    Classification finale : {finalClassification}
                </Typography>

                <TextField
                    label="Commentaire global (ACHIEVER)"
                    multiline
                    rows={4}
                    fullWidth
                    sx={{ mt: 4 }}
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
            </Grid>
        </Grid>
    </Box>
);
}