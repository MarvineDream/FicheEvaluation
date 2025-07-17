"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  Divider,
  CircularProgress,
  Paper,
  Button,
  Grid,
  TextField,
  Stack,
  Chip,
} from "@mui/material";

const FicheEvaluationPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const ficheRef = useRef();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const base64Payload = token.split('.')[1];
        const payload = JSON.parse(atob(base64Payload));
        setUserRole(payload.role);
      } catch (err) {
        console.error("Erreur décodage token :", err);
      }
    }
  }, []);

  useEffect(() => {
    const fetchEvaluation = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:7000/Evaluation/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Erreur lors de la récupération de l'évaluation");
        const data = await res.json();
        setEvaluation(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchEvaluation();
  }, [id]);

  const handleExportPDF = async () => {
    const html2pdf = (await import("html2pdf.js")).default;
    html2pdf()
      .set({
        margin: 0.5,
        filename: `Fiche_Evaluation_${id}.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      })
      .from(ficheRef.current)
      .save();
  };

  const handleContinue = () => {
    const date = new Date(evaluation.dateEvaluation).toISOString().split("T")[0];
    const staffId = typeof evaluation.staffId === "string"
      ? evaluation.staffId
      : evaluation.staffId?._id || "";

    if (!staffId) {
      alert("Identifiant du staff introuvable.");
      return;
    }

    router.push(`/with-sidebar/evaluations/new/${staffId}?date=${date}`);
  };

  if (loading) return <Container sx={{ mt: 4 }}><CircularProgress /></Container>;
  if (!evaluation) return <Container sx={{ mt: 4 }}><Typography>Évaluation introuvable</Typography></Container>;

  console.log("Objectifs Fixes:", evaluation.objectifsFixes);

  const isInProgress = evaluation.statutEvaluation === "En cours";
  const agent = evaluation.agent || {};

  const calculerMoyenneSousTaches = () => {
    const toutesSousTaches = [
      ...(evaluation.objectifsFixes || []),
      ...(evaluation.objectifsHorsFixes || []),
    ]
      .flatMap((obj) => obj.sousTaches || [])
      .filter((st) => typeof st.note === "number");

    if (toutesSousTaches.length === 0) return "-";

    const total = toutesSousTaches.reduce((acc, st) => acc + st.note, 0);
    const moyenne = total / toutesSousTaches.length;

    return moyenne.toFixed(2); // arrondi à 2 décimales
  };


  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
      <Stack direction="row" justifyContent="space-between" spacing={2} mb={3}>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" onClick={() => window.print()} disabled={isInProgress}>🖨️ Imprimer</Button>
          <Button variant="contained" onClick={handleExportPDF} disabled={isInProgress}>📄 Exporter PDF</Button>
        </Stack>
        {isInProgress && userRole !== "RH" && (
          <Button variant="contained" color="primary" onClick={handleContinue}>
            Continuer l’évaluation
          </Button>
        )}
      </Stack>

      <Paper ref={ficheRef} elevation={4} sx={{ p: 4, borderRadius: 3, bgcolor: "#fff" }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
            Fiche d’évaluation
          </Typography>
          <Chip
            label={isInProgress ? "🟡 En cours" : "🟢 Finalisée"}
            color={isInProgress ? "warning" : "success"}
            sx={{ fontWeight: "bold" }}
          />
        </Stack>

        <Typography align="center" color="text.secondary" mb={3} fontStyle="italic">
          Date : {new Date(evaluation.dateEvaluation).toLocaleDateString()}
        </Typography>

        <Divider sx={{ mb: 3 }} />

        {/* Informations du collaborateur avec Grid et TextField */}
        <Typography variant="h6" gutterBottom color="secondary">👤 Informations du collaborateur</Typography>
        <Grid container spacing={2} mb={4}>
          <Grid item xs={12} sm={6}>
            <TextField label="Nom" fullWidth value={agent.nom || "-"} disabled />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Prénom" fullWidth value={agent.prenom || "-"} disabled />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Email" fullWidth value={agent.email || "-"} disabled />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Poste" fullWidth value={agent.emploi || "-"} disabled />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Direction" fullWidth value={agent.direction || "-"} disabled />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Date d'embauche"
              fullWidth
              value={agent.dateEmbauche ? new Date(agent.dateEmbauche).toLocaleDateString() : "-"}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Type de contrat" fullWidth value={agent.typeContrat || "-"} disabled />
          </Grid>
        </Grid>

        {/* Section Objectifs Fixes */}
        <Typography variant="h6" gutterBottom color="secondary" mt={4}>
          Objectifs fixés
        </Typography>
        {(evaluation.objectifs || []).length === 0 ? (
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Aucun objectif fixé
          </Typography>
        ) : (
          evaluation.objectifs.map((objectif, idx) => (
            <Paper key={`obj-fixe-${idx}`} variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                {objectif.activite || "Objectif"} — {objectif.periode || "-"} ({objectif.pourcentage || 0}%)
              </Typography>
              {(objectif.sousTaches || []).length === 0 ? (
                <Typography color="text.secondary">Aucune sous-tâche</Typography>
              ) : (
                objectif.sousTaches.map((st, stIdx) => (
                  <Grid container spacing={1} key={`st-${stIdx}`} sx={{ mb: 1 }}>
                    <Grid item xs={6}>
                      <Typography><strong>Sous-tâche :</strong> {st.titre || "-"}</Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        label="Note"
                        value={st.note || "-"}
                        size="small"
                        disabled
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Commentaire"
                        value={st.commentaire || "-"}
                        size="small"
                        disabled
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                ))
              )}
            </Paper>
          ))
        )}

        {/* Section Objectifs Hors Fixes */}
        <Typography variant="h6" gutterBottom color="secondary" mt={4}>
          Objectifs hors fixés
        </Typography>
        {(evaluation.objectifsHorsFixes || []).length === 0 ? (
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Aucun objectif hors cadre
          </Typography>
        ) : (
          evaluation.objectifsHorsFixes.map((objectif, idx) => (
            <Paper key={`obj-hors-${idx}`} variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                {objectif.activite || "Objectif"} — {objectif.periode || "-"} ({objectif.pourcentage || 0}%)
              </Typography>
              {(objectif.sousTaches || []).length === 0 ? (
                <Typography color="text.secondary">Aucune sous-tâche</Typography>
              ) : (
                objectif.sousTaches.map((st, stIdx) => (
                  <Grid container spacing={1} key={`st-hors-${stIdx}`} sx={{ mb: 1 }}>
                    <Grid item xs={6}>
                      <Typography><strong>Sous-tâche :</strong> {st.titre || "-"}</Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        label="Note"
                        value={st.note || "-"}
                        size="small"
                        disabled
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Commentaire"
                        value={st.commentaire || "-"}
                        size="small"
                        disabled
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                ))
              )}
            </Paper>
          ))
        )}



        {/* Section Intégration */}
        <Typography variant="h6" gutterBottom color="secondary" mt={4}>
          Intégration
        </Typography>
        {evaluation.integration ? (
          <Paper variant="outlined" sx={{ p: 2, mb: 4 }}>
            <Grid container spacing={2}>
              {Object.entries(evaluation.integration).map(([key, val], idx) => (
                <Grid item xs={12} sm={6} key={idx}>
                  <TextField
                    label={key}
                    value={typeof val === "string" || typeof val === "number" ? val : JSON.stringify(val)}
                    fullWidth
                    size="small"
                    disabled
                  />
                </Grid>
              ))}
            </Grid>
          </Paper>
        ) : (
          <Typography color="text.secondary">Aucune donnée d&apos;intégration</Typography>
        )}


        {/* Section Compétences */}
        <Typography variant="h6" gutterBottom color="secondary" mt={4}>
          Compétences
        </Typography>
        {Object.entries(evaluation.competences || {}).map(([categorie, comps], idx) => (
          <Paper key={`comp-cat-${idx}`} variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" mb={1}>{categorie}</Typography>
            {comps.map((comp, compIdx) => (
              <Grid container spacing={1} key={`comp-${compIdx}`} sx={{ mb: 1 }}>
                <Grid item xs={8}>
                  <Typography>{comp.nomCompetence || "-"}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    label="Note"
                    value={typeof comp.note === "object" && comp.note !== null ? comp.note.note : comp.note || "-"}
                    size="small"
                    disabled
                    fullWidth
                  />
                </Grid>
              </Grid>
            ))}
          </Paper>
        ))}

        {/* Section Appréciation globale */}
        <Typography variant="h6" gutterBottom color="secondary" mt={4}>
          Appréciation globale
        </Typography>
        <TextField
          multiline
          minRows={3}
          fullWidth
          value={evaluation.appreciationGlobale?.texte || ""}
          disabled
          sx={{ mb: 2 }}
        />
        <TextField
          label="Note globale (calculée)"
          value={calculerMoyenneSousTaches()}
          disabled
          fullWidth
          sx={{ mb: 4 }}
        />


        {/* Section Décision finale */}
        <Typography variant="h6" gutterBottom color="secondary" mt={4}>
          Décision finale
        </Typography>
        <TextField
          multiline
          minRows={2}
          fullWidth
          value={evaluation.decisionFinale || ""}
          disabled
          sx={{ mb: 4 }}
        />

        {/* Section Signature */}
        <Typography variant="h6" gutterBottom color="secondary" mt={4}>
          Signature
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Nom du signataire"
              value={evaluation.signataire?.nom || "-"}
              disabled
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Date de signature"
              value={evaluation.signataire?.dateSignature ? new Date(evaluation.signataire.dateSignature).toLocaleDateString() : "-"}
              disabled
              fullWidth
            />
          </Grid>
        </Grid>

      </Paper>
    </Container>
  );
};

export default FicheEvaluationPage;
