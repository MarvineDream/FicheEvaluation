"use client";

import { useState } from "react";
import useAuth from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Container, Grid, TextField, Button, Typography, Select, MenuItem, FormControl, InputLabel, Paper, Box } from "@mui/material";
import { Dialog, DialogTitle, DialogContent, DialogActions, Divider } from "@mui/material";
import CompetenceCategory from "@/components/Competence";



const BACKEND_URL = "https://backendeva.onrender.com/Evaluation";

export default function EvaluationPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  const [agent, setAgent] = useState({
    nom: "", prenom: "", emploi: "", direction: "", typeContrat: "", dateEmbauche: "", dateDebutCDD: "", dateFinCDD: "", dureeCDD: ""
  });

  const [objectifs, setObjectifs] = useState([
    { activite: "", attendu: "", realise: "", indicateur: "" }
  ]);

  const [integration, setIntegration] = useState([
    { critere: "Adaptation au poste", note: "", commentaire: "" },
    { critere: "Adaptation à l'équipe", note: "", commentaire: "" },
    { critere: "Respect des procédures", note: "", commentaire: "" },
    { critere: "Maîtrise des outils", note: "", commentaire: "" }
  ]);


  const [competences, setCompetences] = useState({
    savoir: [
      { critere: "Acquis de la formation initiale", note: "", axeAmelioration: "" },
      { critere: "Acquis de la formation continue", note: "", axeAmelioration: "" },
      { critere: "Connaissance de l’entreprise", note: "", axeAmelioration: "" },
      { critere: "Connaissance des procédures liées à son activité", note: "", axeAmelioration: "" },
      { critere: "Connaissance des logiciels d'exploitation", note: "", axeAmelioration: "" },
      { critere: "Connaissance des logiciels techniques/bancaires", note: "", axeAmelioration: "" }
    ],
    savoirFaire: [
      { critere: "Organisation du travail", note: "", axeAmelioration: "" },
      { critere: "Application des procédures", note: "", axeAmelioration: "" },
      { critere: "Fiabilité des tâches exécutées", note: "", axeAmelioration: "" },
      { critere: "Fiabilité des contrôles réalisés", note: "", axeAmelioration: "" },
      { critere: "Reporting : Fiabilité des infos / Respect délais", note: "", axeAmelioration: "" }
    ],
    savoirEtre: [
      { critere: "Autonomie", note: "", axeAmelioration: "" },
      { critere: "Initiative", note: "", axeAmelioration: "" },
      { critere: "Rigueur", note: "", axeAmelioration: "" },
      { critere: "Disponibilité", note: "", axeAmelioration: "" },
      { critere: "Courtoisie", note: "", axeAmelioration: "" },
      { critere: "Ponctualité", note: "", axeAmelioration: "" },
      { critere: "Travail d'équipe", note: "", axeAmelioration: "" },
      { critere: "Assiduité", note: "", axeAmelioration: "" },
      { critere: "Présentation", note: "", axeAmelioration: "" },
      { critere: "Humanisme", note: "", axeAmelioration: "" },
      { critere: "Agilité", note: "", axeAmelioration: "" },
      { critere: "Résilience", note: "", axeAmelioration: "" },
      { critere: "Diversité", note: "", axeAmelioration: "" },
      { critere: "Innovation", note: "", axeAmelioration: "" },
      { critere: "Éco-responsabilité", note: "", axeAmelioration: "" }
    ],
    discipline: [
      { critere: "Respect du code de déontologie", note: "", axeAmelioration: "" },
      { critere: "Respect du règlement intérieur", note: "", axeAmelioration: "" },
      { critere: "Respect du livret sécurité informatique", note: "", axeAmelioration: "" },
      { critere: "Respect de la charte informatique", note: "", axeAmelioration: "" },
      { critere: "Respect de la charte métier", note: "", axeAmelioration: "" }
    ]
  });

  const [appreciationGlobale, setAppreciationGlobale] = useState("");
  const [decision, setDecision] = useState({ choix: "", commentaire: "" });
  const [signatures, setSignatures] = useState({ responsableNom: "", responsableDate: "", rhNom: "", rhDate: "" });
  const [showPreview, setShowPreview] = useState(false);

  // Handlers
  const handleChange = (e, setFunc, state) => {
    const { name, value } = e.target;
    setFunc({ ...state, [name]: value });
  };

  const handleArrayChange = (index, e, array, setArray) => {
    const { name, value } = e.target;
    const updated = [...array];
    updated[index][name] = value;
    setArray(updated);
  };

  const handleNestedArrayChange = (e, section, index) => {
    const { name, value } = e.target;
    const updated = { ...competences };
    updated[section][index][name] = value;
    setCompetences(updated);
  };

  const addObjectif = () => {
    setObjectifs([...objectifs, { activite: "", attendu: "", realise: "", indicateur: "" }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agent, objectifs, integration, competences, appreciationGlobale, decision, signatures })
      });
      if (!res.ok) throw new Error("Erreur");
      alert("✅ Fiche d'évaluation envoyée !");
      router.push("/"); // Redirection vers la page d'accueil ou une autre page
    } catch (err) {
      console.error(err);
      alert("❌ Erreur d'envoi");
    }
  };

  if (isLoading) return <div>Chargement...</div>;

  return (
    <Container maxWidth="lg">
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom>Formulaire d&apos;évaluation</Typography>
            <form onSubmit={handleSubmit}>
              {/* Informations de l'agent */}
              <Typography variant="h6">Informations de l&apos;agent</Typography>
              <Grid container spacing={2}>
                {["nom", "prenom", "emploi", "direction", "typeContrat", "dureeCDD"].map((field) => (
                  <Grid item xs={12} sm={6} key={field}>
                    <TextField
                      label={field.charAt(0).toUpperCase() + field.slice(1)}
                      name={field}
                      value={agent[field]}
                      onChange={(e) => handleChange(e, setAgent, agent)}
                      fullWidth
                    />
                  </Grid>
                ))}
                {["dateEmbauche", "dateDebutCDD", "dateFinCDD"].map((field) => (
                  <Grid item xs={12} sm={6} key={field}>
                    <TextField
                      type="date"
                      label={field.charAt(0).toUpperCase() + field.slice(1)}
                      name={field}
                      value={agent[field]}
                      onChange={(e) => handleChange(e, setAgent, agent)}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                ))}
              </Grid>

              {/* Objectifs fixés */}
              <Typography variant="h6" sx={{ mt: 4 }}>Objectifs fixés</Typography>
              {objectifs.map((obj, idx) => (
                <Box key={idx} sx={{ border: '1px solid #ddd', borderRadius: 2, padding: 2, marginBottom: 2 }}>
                  <Typography variant="subtitle1">Activité {idx + 1}</Typography>
                  <Grid container spacing={2}>
                    {["activite", "attendu", "realise", "indicateur"].map((field) => (
                      <Grid item xs={12} sm={6} key={field}>
                        <TextField
                          label={field.charAt(0).toUpperCase() + field.slice(1)}
                          name={field}
                          value={obj[field]}
                          onChange={(e) => handleArrayChange(idx, e, objectifs, setObjectifs)}
                          fullWidth
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              ))}
              <Button variant="contained" color="success" onClick={addObjectif}>Ajouter une activité</Button>

              {/* Intégration professionnelle */}
              <Typography variant="h6" sx={{ mt: 4 }}>Intégration professionnelle</Typography>
              {integration.map((item, idx) => (
                <Box key={idx} sx={{ marginBottom: 2 }}>
                  <Typography>{item.critere}</Typography>
                  <FormControl fullWidth>
                    <InputLabel>Note</InputLabel>
                    <Select
                      name="note"
                      value={item.note}
                      onChange={(e) => handleArrayChange(idx, e, integration, setIntegration)}
                    >
                      <MenuItem value="TB">Très Bien</MenuItem>
                      <MenuItem value="B">Bien</MenuItem>
                      <MenuItem value="P">Passable</MenuItem>
                      <MenuItem value="I">Insuffisant</MenuItem>
                      <MenuItem value="PC">Pas Concerné</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    label="Commentaire"
                    name="commentaire"
                    value={item.commentaire}
                    onChange={(e) => handleArrayChange(idx, e, integration, setIntegration)}
                    fullWidth
                    multiline
                    rows={2}
                    sx={{ mt: 1 }}
                  />
                </Box>
              ))}

              {/* Compétences professionnelles */}
              <Typography variant="h6" sx={{ mt: 4 }}>Compétences professionnelles</Typography>

              {/* Savoir */}
              <Typography variant="subtitle1">Savoir</Typography>
              {competences.savoir.map((item, idx) => (
                <Box key={idx} sx={{ marginBottom: 2 }}>
                  <Typography>{item.critere}</Typography>
                  <FormControl fullWidth>
                    <InputLabel>Note</InputLabel>
                    <Select
                      name="note"
                      value={item.note}
                      onChange={(e) => handleNestedArrayChange(e, 'savoir', idx)}
                    >
                      <MenuItem value="TB">Très Bien</MenuItem>
                      <MenuItem value="B">Bien</MenuItem>
                      <MenuItem value="P">Passable</MenuItem>
                      <MenuItem value="I">Insuffisant</MenuItem>
                      <MenuItem value="PC">Pas Concerné</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    label="Axe d'Amélioration"
                    name="axeAmelioration"
                    value={item.axeAmelioration}
                    onChange={(e) => handleNestedArrayChange(e, 'savoir', idx)}
                    fullWidth
                    sx={{ mt: 1 }}
                  />
                </Box>
              ))}

              {/* Savoir-Faire */}
              <Typography variant="subtitle1">Savoir-Faire</Typography>
              {competences.savoirFaire.map((item, idx) => (
                <Box key={idx} sx={{ marginBottom: 2 }}>
                  <Typography>{item.critere}</Typography>
                  <FormControl fullWidth>
                    <InputLabel>Note</InputLabel>
                    <Select
                      name="note"
                      value={item.note}
                      onChange={(e) => handleNestedArrayChange(e, 'savoirFaire', idx)}
                    >
                      <MenuItem value="TB">Très Bien</MenuItem>
                      <MenuItem value="B">Bien</MenuItem>
                      <MenuItem value="P">Passable</MenuItem>
                      <MenuItem value="I">Insuffisant</MenuItem>
                      <MenuItem value="PC">Pas Concerné</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    label="Axe d'Amélioration"
                    name="axeAmelioration"
                    value={item.axeAmelioration}
                    onChange={(e) => handleNestedArrayChange(e, 'savoirFaire', idx)}
                    fullWidth
                    sx={{ mt: 1 }}
                  />
                </Box>
              ))}

              {/* Savoir-Être */}
              <Typography variant="subtitle1">Savoir-Être</Typography>
              {competences.savoirEtre.map((item, idx) => (
                <Box key={idx} sx={{ marginBottom: 2 }}>
                  <Typography>{item.critere}</Typography>
                  <FormControl fullWidth>
                    <InputLabel>Note</InputLabel>
                    <Select
                      name="note"
                      value={item.note}
                      onChange={(e) => handleNestedArrayChange(e, 'savoirEtre', idx)}
                    >
                      <MenuItem value="TB">Très Bien</MenuItem>
                      <MenuItem value="B">Bien</MenuItem>
                      <MenuItem value="P">Passable</MenuItem>
                      <MenuItem value="I">Insuffisant</MenuItem>
                      <MenuItem value="PC">Pas Concerné</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    label="Axe d'Amélioration"
                    name="axeAmelioration"
                    value={item.axeAmelioration}
                    onChange={(e) => handleNestedArrayChange(e, 'savoirEtre', idx)}
                    fullWidth
                    sx={{ mt: 1 }}
                  />
                </Box>
              ))}

              {/* Discipline */}
              <Typography variant="subtitle1">Discipline</Typography>
              {competences.discipline.map((item, idx) => (
                <Box key={idx} sx={{ marginBottom: 2 }}>
                  <Typography>{item.critere}</Typography>
                  <FormControl fullWidth>
                    <InputLabel>Note</InputLabel>
                    <Select
                      name="note"
                      value={item.note}
                      onChange={(e) => handleNestedArrayChange(e, 'discipline', idx)}
                    >
                      <MenuItem value="TB">Très Bien</MenuItem>
                      <MenuItem value="B">Bien</MenuItem>
                      <MenuItem value="P">Passable</MenuItem>
                      <MenuItem value="I">Insuffisant</MenuItem>
                      <MenuItem value="PC">Pas Concerné</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    label="Axe d'Amélioration"
                    name="axeAmelioration"
                    value={item.axeAmelioration}
                    onChange={(e) => handleNestedArrayChange(e, 'discipline', idx)}
                    fullWidth
                    sx={{ mt: 1 }}
                  />
                </Box>
              ))}


              {/* Appréciation Globale */}
              <Typography variant="h6" sx={{ mt: 4 }}>Appréciation Globale</Typography>
              <TextField
                name="appreciationGlobale"
                placeholder="Exprimez votre appréciation globale"
                value={appreciationGlobale}
                onChange={(e) => setAppreciationGlobale(e.target.value)}
                fullWidth
                multiline
                rows={4}
              />

              {/* Décision RH */}
              <Typography variant="h6" sx={{ mt: 4 }}>Décision RH</Typography>
              <FormControl fullWidth>
                <InputLabel>Décision</InputLabel>
                <Select value={decision.choix} onChange={(e) => setDecision({ ...decision, choix: e.target.value })}>
                  <MenuItem value="">Sélectionner une décision</MenuItem>
                  <MenuItem value="Confirmer la période d'essai">Confirmer la période d&apos;essai</MenuItem>
                  <MenuItem value="Prolonger la période d'essai">Prolonger la période d&apos;essai</MenuItem>
                  <MenuItem value="Rupture du contrat">Rupture du contrat</MenuItem>
                </Select>
              </FormControl>
              <TextField
                name="commentaire"
                placeholder="Commentaire décision RH"
                value={decision.commentaire}
                onChange={(e) => setDecision({ ...decision, commentaire: e.target.value })}
                fullWidth
                multiline
                rows={2}
                sx={{ mt: 1 }}
              />

              {/* Signatures */}
              <Typography variant="h6" sx={{ mt: 4 }}>Signatures</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField name="responsableNom" placeholder="Nom Responsable" value={signatures.responsableNom} onChange={(e) => handleChange(e, setSignatures, signatures)} fullWidth />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField type="date" name="responsableDate" value={signatures.responsableDate} onChange={(e) => handleChange(e, setSignatures, signatures)} fullWidth InputLabelProps={{ shrink: true }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField name="rhNom" placeholder="Nom RH" value={signatures.rhNom} onChange={(e) => handleChange(e, setSignatures, signatures)} fullWidth />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField type="date" name="rhDate" value={signatures.rhDate} onChange={(e) => handleChange(e, setSignatures, signatures)} fullWidth InputLabelProps={{ shrink: true }} />
                </Grid>
              </Grid>

              {/* Boutons */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button variant="outlined" onClick={() => setShowPreview(true)}>Prévisualiser</Button>
                <Button variant="contained" type="submit" disabled={!agent.nom || !agent.prenom || !agent.direction}>Envoyer</Button>
              </Box>
            </form>
            <Dialog open={showPreview} onClose={() => setShowPreview(false)} maxWidth="md" fullWidth>
              <DialogTitle>Fiche d&apos;évaluation</DialogTitle>
              <DialogContent dividers>
                <Typography variant="h6" gutterBottom>Informations de l&apos;agent</Typography>
                <Typography><strong>Nom :</strong> {agent.nom}</Typography>
                <Typography><strong>Prénom :</strong> {agent.prenom}</Typography>
                <Typography><strong>Emploi :</strong> {agent.emploi}</Typography>
                <Typography><strong>Direction :</strong> {agent.direction}</Typography>
                <Typography><strong>Date d&apos;embauche :</strong> {agent.dateEmbauche}</Typography>
                <Typography><strong>Type de contrat :</strong> {agent.typeContrat}</Typography>

                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>Objectifs fixés</Typography>
                <ul>
                  {objectifs.map((o, idx) => (
                    <li key={idx}>
                      <strong>Activité {idx + 1}</strong>: {o.activite}, Attendu: {o.attendu}, Réalisé: {o.realise}
                    </li>
                  ))}
                </ul>

                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>Intégration professionnelle</Typography>
                <ul>
                  {integration.map((item, idx) => (
                    <li key={idx}>
                      <strong>{item.critere}</strong> — Note : {item.note}, Commentaire : {item.commentaire || "—"}
                    </li>
                  ))}
                </ul>


                {/* Compétences professionnelles */}
                <Divider sx={{ my: 2 }} />

                <Typography variant="h6">Compétences professionnelles</Typography>

                {/* Savoir */}
                <Typography variant="subtitle1" sx={{ mt: 2 }}>Savoir</Typography>
                {competences?.savoir?.map((item, idx) => (
                  <Box key={`savoir-${idx}`} sx={{ mb: 2 }}>
                    <Typography><strong>{item.critere}</strong></Typography>
                    <Typography>Note : {item.note}</Typography>
                    <Typography>Axe d&apos;Amélioration : {item.axeAmelioration}</Typography>
                  </Box>
                ))}

                {/* Savoir-Faire */}
                <Typography variant="subtitle1" sx={{ mt: 2 }}>Savoir-Faire</Typography>
                {competences?.savoirFaire?.map((item, idx) => (
                  <Box key={`savoirFaire-${idx}`} sx={{ mb: 2 }}>
                    <Typography><strong>{item.critere}</strong></Typography>
                    <Typography>Note : {item.note}</Typography>
                    <Typography>Axe d&apos;Amélioration : {item.axeAmelioration}</Typography>
                  </Box>
                ))}

                {/* Savoir-Être */}
                <Typography variant="subtitle1" sx={{ mt: 2 }}>Savoir-Être</Typography>
                {competences?.savoirEtre?.map((item, idx) => (
                  <Box key={`savoirEtre-${idx}`} sx={{ mb: 2 }}>
                    <Typography><strong>{item.critere}</strong></Typography>
                    <Typography>Note : {item.note}</Typography>
                    <Typography>Axe d&apos;Amélioration : {item.axeAmelioration}</Typography>
                  </Box>
                ))}




                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>Appréciation Globale</Typography>
                <Typography>{appreciationGlobale || "—"}</Typography>

                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>Décision RH</Typography>
                <Typography><strong>Choix :</strong> {decision.choix}</Typography>
                <Typography><strong>Commentaire :</strong> {decision.commentaire}</Typography>

                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>Signatures</Typography>
                <Typography><strong>Responsable :</strong> {signatures.responsableNom} — {signatures.responsableDate}</Typography>
                <Typography><strong>RH :</strong> {signatures.rhNom} — {signatures.rhDate}</Typography>
              </DialogContent>

              <DialogActions>
                <Button onClick={() => setShowPreview(false)}>Fermer</Button>
                <Button onClick={handleSubmit} variant="contained" disabled={!agent.nom || !agent.prenom || !agent.direction} >Valider et envoyer</Button>
              </DialogActions>
            </Dialog>

          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
