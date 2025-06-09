"use client";

import { useState } from "react";
import useAuth from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Tooltip from "@mui/material/Tooltip";

import { useSearchParams } from "next/navigation";
import {
  Container,
  Grid,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";

const BACKEND_URL = "https://backendeva.onrender.com/Evaluation";

export default function EvaluationPage() {
  const searchParams = useSearchParams();
  const staffId = searchParams.get("staffId");
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [agent, setAgent] = useState({
    nom: "",
    prenom: "",
    email: "",
    emploi: "",
    departement: "",
    typeContrat: "",
    dateEmbauche: "",
    dateDebutCDD: "",
    dateFinCDD: "",
    dureeCDD: "",
    dateDebutStage: "",
    dateFinStage: "",
    dureeStage: "",
  });


  const [objectifs, setObjectifs] = useState([{ activite: "", periode: "", pourcentage: 0, sousTaches: [] }]);
  const [integration, setIntegration] = useState([
    { critere: "AdaptationPoste", note: "", commentaire: "" },
    { critere: "AdaptationEquipe", note: "", commentaire: "" },
    { critere: "RespectDesProcedures", note: "", commentaire: "" },
    { critere: "MaitriseDesOutils", note: "", commentaire: "" },
  ]);

  const [competences, setCompetences] = useState({
    savoir: [
      { critere: "Acquis de la formation initiale", description: "Niveau de connaissance et compétences obtenus lors de la formation de base avant l’entrée en poste.", note: "", axeAmelioration: "" },
      { critere: "Acquis de la formation continue", description: "Capacité à intégrer et appliquer les connaissances acquises lors des formations complémentaires ou mises à jour professionnelles.", note: "", axeAmelioration: "" },
      { critere: "Connaissance de l’entreprise", description: "Compréhension de la mission, de la vision, des valeurs, et de l’organisation générale de l’entreprise.", note: "", axeAmelioration: "" },
      { critere: "Connaissance des procédures liées à son activité", description: "Maîtrise des règles, processus et pratiques spécifiques à son métier ou poste.", note: "", axeAmelioration: "" },
      { critere: "Connaissance des logiciels d'exploitation", description: "Aptitude à utiliser efficacement les logiciels essentiels au fonctionnement opérationne.", note: "", axeAmelioration: "" },
      { critere: "Connaissance des logiciels techniques/bancaires", description: "Niveau de maîtrise des outils spécifiques liés aux fonctions techniques ou bancaires propres à l’activité.", note: "", axeAmelioration: "" },
    ],
    savoirFaire: [
      { critere: "Organisation du travail", description: "Capacité à planifier et gérer efficacement ses tâches.", note: "", axeAmelioration: "" },
      { critere: "Application des procédures", description: "Respect et mise en œuvre rigoureuse des protocoles et processus établis.", note: "", axeAmelioration: "" },
      { critere: "Fiabilité des tâches exécutées", description: "Qualité et précision dans la réalisation des missions confiées.", note: "", axeAmelioration: "" },
      { critere: "Fiabilité des contrôles réalisés", description: "Capacité à effectuer des vérifications pertinentes garantissant la conformité et la qualité.", note: "", axeAmelioration: "" },
      { critere: "Reporting : Fiabilité des infos / Respect délais", description: "Exactitude et ponctualité dans la communication des données et rapports.", note: "", axeAmelioration: "" },
    ],
    savoirEtre: [
      { critere: "Autonomie", description: "Capacité à travailler de manière indépendante sans supervision constante.", note: "", axeAmelioration: "" },
      { critere: "Initiative", description: "Aptitude à proposer des actions ou solutions nouvelles sans attendre d’être sollicité.", note: "", axeAmelioration: "" },
      { critere: "Rigueur", description: "Précision et sérieux dans l’exécution des tâches.", note: "", axeAmelioration: "" },
      { critere: "Disponibilité", description: "Accessibilité et réactivité envers les collègues et les demandes professionnelles.", note: "", axeAmelioration: "" },
      { critere: "Ponctualité", description: "Respect et politesse dans les échanges avec les autres.", note: "", axeAmelioration: "" },
      { critere: "Courtoisie", description: "Respect des horaires et délais fixés.", note: "", axeAmelioration: "" },
      { critere: "Ponctualité", description: "Capacité à collaborer efficacement avec les autres.", note: "", axeAmelioration: "" },
      { critere: "Travail d'équipe", description: "Capacité à planifier et gérer efficacement ses tâches.", note: "", axeAmelioration: "" },
      { critere: "Assiduité", description: "Présence régulière et assidue au travail.", note: "", axeAmelioration: "" },
      { critere: "Présentation", description: "Soigne et professionnelle dans l’apparence personnelle.", note: "", axeAmelioration: "" },
      { critere: "Humanisme", description: "Respect et considération envers les autres, favorisant un climat bienveillant.", note: "", axeAmelioration: "" },
      { critere: "Agilité", description: "Capacité à s’adapter rapidement aux changements et aux imprévus.", note: "", axeAmelioration: "" },
      { critere: "Résilience", description: "Aptitude à surmonter les difficultés et à rebondir après un échec.", note: "", axeAmelioration: "" },
      { critere: "Diversité", description: "Ouverture à la diversité culturelle, sociale et professionnelle.", note: "", axeAmelioration: "" },
      { critere: "Innovation", description: "Capacité à proposer et mettre en œuvre des idées nouvelles.", note: "", axeAmelioration: "" },
      { critere: "Éco-responsabilité", description: "Comportement respectueux de l’environnement dans les pratiques professionnelles.", note: "", axeAmelioration: "" },
    ],
    discipline: [
      { critere: "Respect du code de déontologie", description: "Adhésion aux principes éthiques et moraux propres à la profession.", note: "", axeAmelioration: "" },
      { critere: "Respect du règlement intérieur", description: "Application stricte des règles internes à l’entreprise.", note: "", axeAmelioration: "" },
      { critere: "Respect du livret sécurité informatique", description: "Conformité aux consignes de sécurité liées aux systèmes informatiques.", note: "", axeAmelioration: "" },
      { critere: "Respect de la charte informatique", description: "Usage responsable et conforme des outils informatiques mis à disposition.", note: "", axeAmelioration: "" },
      { critere: "Respect de la charte métier", description: "Adhésion aux bonnes pratiques et règles spécifiques à la profession exercée.", note: "", axeAmelioration: "" },
    ],
  });

  const [appreciationGlobale, setAppreciationGlobale] = useState("");
  const [decision, setDecision] = useState({ choix: "", commentaire: "" });
  const [signatures, setSignatures] = useState({ collaborateur: "", responsableNom: "", responsableDate: "", rhNom: "", rhDate: "" });
  const [showPreview, setShowPreview] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");

  const noteValues = {
    "Très Bien": 5,
    "Bien": 4,
    "Passable": 3,
    "Insuffisant": 2,
    "Pas Concerné": 1,
  };

  const calculerNoteGlobale = () => {
    const allNotes = [];

    Object.keys(competences).forEach((key) => {
      competences[key].forEach((comp) => {
        const score = noteValues[comp.note];
        if (score !== null && score !== undefined) {
          allNotes.push(score);
        }
      });
    });

    if (allNotes.length === 0) return null;

    const total = allNotes.reduce((sum, val) => sum + val, 0);
    return (total / allNotes.length).toFixed(2);
  };


  const periodes = ['Mensuel', 'T1', 'T2', 'T3', 'Annuel'];
  const totalPourcentage = objectifs.reduce((sum, obj) => sum + Number(obj.pourcentage || 0), 0);


  const handleChange = (e, setter, state) => {
    const { name, value } = e.target;
    const updated = { ...state, [name]: value };
    setter(updated);
  };

  const handleNext = () => {
    router.push("/with-sidebar/evaluationPotentiel");
  };

  const handleAddObjectif = () => {
    setObjectifs([...objectifs, { activite: '', periode: '', pourcentage: 0, sousTaches: [{ note: "PC", description: "" }] }]); // Note par défaut
  };

  const handleRemoveObjectif = (index) => {
    const newObjectifs = [...objectifs];
    newObjectifs.splice(index, 1);
    setObjectifs(newObjectifs);
  };

  const handleChangeObjectif = (index, field, value) => {
    const newObjectifs = [...objectifs];
    newObjectifs[index][field] = value;
    setObjectifs(newObjectifs);
  };

  const handleChangeSousTache = (index, sousIndex, value) => {
    const newObjectifs = [...objectifs];
    newObjectifs[index].sousTaches[sousIndex] = value;
    setObjectifs(newObjectifs);
  };

  const handleAddSousTache = (index) => {
    const newObjectifs = [...objectifs];
    newObjectifs[index].sousTaches.push({ note: "PC", description: "" }); // Note par défaut
    setObjectifs(newObjectifs);
  };

  const handleRemoveSousTache = (index, sousIndex) => {
    const newObjectifs = [...objectifs];
    newObjectifs[index].sousTaches.splice(sousIndex, 1);
    setObjectifs(newObjectifs);
  };

  const calculateTotalScore = () => {
    return objectifs.reduce((total, obj) => {
      const notes = obj.sousTaches.map((t) => noteValues[t.note] || 0);
      const avg = notes.length > 0 ? notes.reduce((a, b) => a + b, 0) / notes.length : 0;
      const weighted = (avg * obj.pourcentage) / 100;
      return total + weighted;
    }, 0);
  };

  const handleSave = async () => {
    try {
      const res = await fetch(BACKEND_URL + "/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ staffId, managerId: user.id, periodeEvaluation: "", data: {agent, objectifs, integration, competences, appreciationGlobale, decision, signatures} }),
      });
      if (!res.ok) throw new Error("Erreur lors de la sauvegarde des données");
      setSaveStatus("✅ Sauvegarde réussie !");
    } catch (err) {
      console.error(err);
      setSaveStatus("❌ Erreur de sauvegarde : " + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ staffId, managerId: user.id, periodeEvaluation: "", data: {agent, objectifs, integration, competences, appreciationGlobale, decision, signatures} }),
      });
      if (!res.ok) throw new Error("Erreur lors de l'envoi des données");
      alert("✅ Fiche d'évaluation envoyée !");
      router.push("/");
    } catch (err) {
      console.error(err);
      alert("❌ Erreur d'envoi : " + err.message);
    }
  };

  if (isLoading) return <div>Chargement...</div>;

  return (
    <Container>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom>Formulaire d&apos;évaluation</Typography>
            <form onSubmit={handleSubmit}>
              <input type="hidden" name="staffId" value={""} />

              {/* Informations de l'agent */}
              <Typography variant="h6">Informations de l&apos;agent</Typography>
              <Grid container spacing={2}>
                {["nom", "prenom", "email", "emploi", "departement"].map((field) => (
                  <Grid item xs={12} sm={6} key={field}>
                    <TextField
                      label={field.charAt(0).toUpperCase() + field.slice(1)}
                      name={field}
                      value={agent[field] || ""}
                      onChange={(e) => handleChange(e, setAgent, agent)}
                      fullWidth
                      required
                    />
                  </Grid>
                ))}
                {/* Type de contrat */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Type de contrat</InputLabel>
                    <Select
                      name="typeContrat"
                      value={agent.typeContrat || ""}
                      label="Type de contrat"
                      onChange={(e) => handleChange(e, setAgent, agent)}
                    >
                      <MenuItem value="CDI">CDI</MenuItem>
                      <MenuItem value="CDD">CDD</MenuItem>
                      <MenuItem value="Stagiaire">Stagiaire</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                {/* Dates pour CDD ou Stage */}
                {agent.typeContrat === "CDD" && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        type="date"
                        label="Date début CDD"
                        name="dateDebutCDD"
                        value={agent.dateDebutCDD || ""}
                        onChange={(e) => handleChange(e, setAgent, agent)}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        type="date"
                        label="Date fin CDD"
                        name="dateFinCDD"
                        value={agent.dateFinCDD || ""}
                        onChange={(e) => handleChange(e, setAgent, agent)}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Durée CDD"
                        name="dureeCDD"
                        value={agent.dureeCDD || ""}
                        fullWidth
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                  </>
                )}
                {agent.typeContrat === "Stagiaire" && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        type="date"
                        label="Date début stage"
                        name="dateDebutStage"
                        value={agent.dateDebutStage || ""}
                        onChange={(e) => handleChange(e, setAgent, agent)}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        type="date"
                        label="Date fin stage"
                        name="dateFinStage"
                        value={agent.dateFinStage || ""}
                        onChange={(e) => handleChange(e, setAgent, agent)}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Durée stage"
                        name="dureeStage"
                        value={agent.dureeStage || ""}
                        fullWidth
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                  </>
                )}
                <Grid item xs={12} sm={6}>
                  <TextField
                    type="date"
                    label="Date d'embauche"
                    name="dateEmbauche"
                    value={agent.dateEmbauche || ""}
                    onChange={(e) => handleChange(e, setAgent, agent)}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>
              </Grid>

              {/* Objectifs fixés */}
              <Typography variant="h6" sx={{ mt: 4 }}>Objectifs fixés</Typography>
              {objectifs.map((obj, idx) => (
                <Box key={idx} sx={{ border: '1px solid #ddd', borderRadius: 2, padding: 2, mb: 2 }}>
                  <Typography variant="subtitle1">Activité {idx + 1}</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Activité"
                        value={obj.activite}
                        onChange={(e) => handleChangeObjectif(idx, 'activite', e.target.value)}
                        required
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        select
                        fullWidth
                        label="Période"
                        value={obj.periode}
                        onChange={(e) => handleChangeObjectif(idx, 'periode', e.target.value)}
                        required
                      >
                        {periodes.map((periode) => (
                          <MenuItem key={periode} value={periode}>
                            {periode}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Pourcentage (%)"
                        type="number"
                        value={obj.pourcentage}
                        onChange={(e) => handleChangeObjectif(idx, 'pourcentage', Number(e.target.value))}
                        fullWidth
                        inputProps={{ min: 0, max: 100 }}
                        required
                      />
                    </Grid>
                  </Grid>

                  {/* Liste des sous-tâches */}
                  {obj.sousTaches.map((t, tIdx) => (
                    <Box
                      key={tIdx}
                      sx={{
                        border: '1px dashed #ccc',
                        borderRadius: 1,
                        mt: 2,
                        p: 2,
                        bgcolor: '#f9f9f9',
                      }}
                    >
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label={`Sous-tâche ${tIdx + 1}`}
                            value={t.description}
                            onChange={(e) => handleChangeSousTache(idx, tIdx, { ...t, description: e.target.value })}
                            required
                          />
                        </Grid>
                        <Grid item xs={3}>
                          <TextField
                            select
                            fullWidth
                            label="Note"
                            value={t.note || 'Pas Concerné'}
                            onChange={(e) => handleChangeSousTache(idx, tIdx, { ...t, note: e.target.value })}
                          >
                            {['Très Bien', 'Bien', 'Passable', 'Insuffisant', 'Pas Concerné'].map((note) => (
                              <MenuItem key={note} value={note}>
                                {note}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                        <Grid item xs={3}>
                          <TextField
                            fullWidth
                            label="Commentaire"
                            value={t.commentaire || ''}
                            onChange={(e) => handleChangeSousTache(idx, tIdx, { ...t, commentaire: e.target.value })}
                          />
                        </Grid>
                      </Grid>

                      {/* Bouton supprimer la sous-tâche */}
                      <Button
                        variant="text"
                        color="error"
                        size="small"
                        onClick={() => handleRemoveSousTache(idx, tIdx)}
                        sx={{ mt: 1 }}
                      >
                        Supprimer la sous-tâche
                      </Button>
                    </Box>
                  ))}

                  {/* Ajouter sous-tâche */}
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleAddSousTache(idx)}
                    sx={{ mt: 2 }}
                  >
                    <AddCircleOutline /> Ajouter une sous-tâche
                  </Button>

                  {/* Supprimer l'activité */}
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleRemoveObjectif(idx)}
                    sx={{ mt: 2, ml: 1 }}
                  >
                    <RemoveCircleOutline /> Supprimer l’activité
                  </Button>
                </Box>
              ))}

              {/* Ajouter activité : désactivé si totalPourcentage >= 100 */}
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddObjectif}
                sx={{ mt: 2 }}
                disabled={totalPourcentage >= 100}
              >
                <AddCircleOutline /> Ajouter une activité
              </Button>


              {/* Résumé / total du score pondéré */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1">
                  Score total pondéré :{" "}
                  <strong>{calculateTotalScore().toFixed(2)} / 5</strong>
                </Typography>
              </Box>

              <Typography variant="h6" sx={{ mt: 4 }}>Évaluation de l&apos;Intégration Professionnelle</Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Critère</TableCell>
                    <TableCell>Note</TableCell>
                    <TableCell>Commentaire</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {integration.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        <Typography variant="body1">{item.critere}</Typography>
                        {item.description && (
                          <Typography variant="body2" color="textSecondary">
                            {item.description}
                          </Typography>
                        )}
                      </TableCell>

                      <TableCell>
                        <TextField
                          select
                          fullWidth
                          value={item.note}
                          onChange={(e) => {
                            const newIntegration = [...integration];
                            newIntegration[idx].note = e.target.value;
                            setIntegration(newIntegration);
                          }}
                        >
                          {['Très Bien', 'Bien', 'Passable', 'Insuffisant', 'Pas Concerné'].map((note) => (
                            <MenuItem key={note} value={note}>
                              {note}
                            </MenuItem>
                          ))}
                        </TextField>
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          value={item.commentaire}
                          onChange={(e) => {
                            const newIntegration = [...integration];
                            newIntegration[idx].commentaire = e.target.value;
                            setIntegration(newIntegration);
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>


              <Typography variant="h6" sx={{ mt: 4 }}>Évaluation des Compétences</Typography>
              {['savoir', 'savoirFaire', 'savoirEtre', 'discipline'].map((key) => (
                <Box key={key} sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </Typography>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Critère</TableCell>
                        <TableCell>Note</TableCell>
                        <TableCell>Axe d&apos;amélioration</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {competences[key].map((comp, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{comp.critere}</TableCell>
                          <TableCell>
                            <TextField
                              select
                              fullWidth
                              value={comp.note}
                              onChange={(e) => {
                                const newCompetences = { ...competences };
                                newCompetences[key][idx].note = e.target.value;
                                setCompetences(newCompetences);
                              }}
                            >
                              {['Très Bien', 'Bien', 'Passable', 'Insuffisant', 'Pas Concerné'].map((note) => (
                                <MenuItem key={note} value={note}>
                                  {note}
                                </MenuItem>
                              ))}
                            </TextField>
                          </TableCell>
                          <TableCell>
                            <TextField
                              fullWidth
                              value={comp.axeAmelioration}
                              onChange={(e) => {
                                const newCompetences = { ...competences };
                                newCompetences[key][idx].axeAmelioration = e.target.value;
                                setCompetences(newCompetences);
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              ))}


              {/* Appréciation globale */}
              <Typography variant="h6" sx={{ mt: 4 }}>Appréciation Globale</Typography>
              <TextField
                label="Commentaire"
                value={appreciationGlobale}
                onChange={(e) => setAppreciationGlobale(e.target.value)}
                fullWidth
                multiline
                rows={4}
              />

              <Typography variant="subtitle1" sx={{ mt: 2 }}>
                Note générale : {calculerNoteGlobale() || 'Non disponible'}
              </Typography>


              {/* Décision */}
              <Typography variant="h6" sx={{ mt: 4 }}>Décision</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    select
                    fullWidth
                    label="Choix"
                    value={decision.choix}
                    onChange={(e) => setDecision({ ...decision, choix: e.target.value })}
                  >
                    {['Valider', 'Refuser', 'À revoir'].map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Commentaire"
                    value={decision.commentaire}
                    onChange={(e) => setDecision({ ...decision, commentaire: e.target.value })}
                    fullWidth
                  />
                </Grid>
              </Grid>

              {/* Signatures */}
              <Typography variant="h6" sx={{ mt: 4 }}>Signatures</Typography>
              <Grid container spacing={2}>
                {['collaborateur', 'responsableNom', 'responsableDate', 'rhNom', 'rhDate'].map((field) => (
                  <Grid item xs={6} key={field}>
                    <TextField
                      label={field.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                      value={signatures[field] || ""}
                      onChange={(e) => setSignatures({ ...signatures, [field]: e.target.value })}
                      fullWidth
                    />
                  </Grid>
                ))}
              </Grid>

              {/* Boutons d'action */}
              <Box sx={{ mt: 4 }}>
                <Button variant="contained" color="primary" onClick={handleSave}>
                  Sauvegarder
                </Button>
                <Button variant="contained" color="secondary" onClick={handleNext} sx={{ ml: 2 }}>
                  Suivant
                </Button>
                <Typography sx={{ mt: 2 }}>{saveStatus}</Typography>
              </Box>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

