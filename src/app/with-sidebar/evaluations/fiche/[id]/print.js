"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  Divider,
  CircularProgress,
  Paper,
  Grid,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

const FicheEvaluationPrint = () => {
  const { id } = useParams();
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(true);
  const ficheRef = useRef(null);

  useEffect(() => {
    const fetchEvaluation = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:7000/Evaluation/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setEvaluation(data);
      } catch (err) {
        console.error("Erreur récupération évaluation :", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchEvaluation();
  }, [id]);

  if (loading)
    return (
      <Container sx={{ mt: 4 }}>
        <CircularProgress />
      </Container>
    );

  if (!evaluation)
    return (
      <Container sx={{ mt: 4 }}>
        <Typography>Évaluation introuvable</Typography>
      </Container>
    );

  const agent = evaluation.agent || {};
  const competences = evaluation.competences || {};

  const calculerMoyenneSousTaches = () => {
    const toutesSousTaches = [
      ...(evaluation.objectifsFixes || []),
      ...(evaluation.objectifsHorsFixes || []),
    ]
      .flatMap((obj) => obj.sousTaches || [])
      .filter((st) => typeof st.note === "number");
    if (toutesSousTaches.length === 0) return "-";
    const total = toutesSousTaches.reduce((acc, st) => acc + st.note, 0);
    return (total / toutesSousTaches.length).toFixed(2);
  };

  // Styles
  const cellStyle = {
    border: "1px solid black",
    textAlign: "center",
    verticalAlign: "middle",
    fontSize: "0.85rem",
    padding: "6px",
  };

  const headerCellStyle = {
    ...cellStyle,
    fontWeight: "bold",
    backgroundColor: "#f0f0f0",
  };

  const sectionTitle = (num, text) => (
    <Typography
      variant="h6"
      gutterBottom
      sx={{ mt: 2, fontFamily: `"Times New Roman", Times, serif` }}
    >
      {num}. {text}
    </Typography>
  );

  return (
    <Container
      maxWidth={false}
      sx={{ display: "flex", justifyContent: "center", mt: 0, mb: 0 }}
    >
      <Paper
        ref={ficheRef}
        elevation={0}
        sx={{
          width: "210mm",
          minHeight: "297mm",
          p: "15mm",
          fontFamily: `"Times New Roman", Times, serif`,
          color: "black",
          border: "none",
          boxShadow: "none",
        }}
      >
        {/* En-tête */}
        <Grid container alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={3}>
            <img
              src="/logo.png"
              alt="Logo"
              style={{ width: "80px", height: "auto" }}
            />
          </Grid>
          <Grid item xs={9} textAlign="center">
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              République Gabonaise
            </Typography>
            <Typography variant="body2">
              Ministère de la Fonction Publique
            </Typography>
            <Typography variant="body2">
              Direction des Ressources Humaines
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 1, borderColor: "black" }} />

        <Typography
          variant="h5"
          align="center"
          fontWeight="bold"
          gutterBottom
          sx={{ fontFamily: `"Times New Roman", Times, serif` }}
        >
          FICHE D’ÉVALUATION INDIVIDUELLE – A MI-PARCOURS
        </Typography>
        <Typography variant="body2" align="center" gutterBottom>
          Réf. : MPA/EMP/01/DRH
        </Typography>

        <Divider sx={{ my: 2, borderColor: "black" }} />

        {/* 1. Infos collaborateur */}
        {sectionTitle(1, "INFORMATIONS DE L’AGENT ÉVALUÉ")}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={6}>
            <TextField
              label="Nom"
              fullWidth
              value={agent.nom || "-"}
              disabled
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Prénom"
              fullWidth
              value={agent.prenom || "-"}
              disabled
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Matricule"
              fullWidth
              value={agent.matricule || "-"}
              disabled
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Téléphone"
              fullWidth
              value={agent.telephone || "-"}
              disabled
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Emploi occupé"
              fullWidth
              value={agent.emploi || "-"}
              disabled
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Direction"
              fullWidth
              value={agent.direction || "-"}
              disabled
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Classification"
              fullWidth
              value={agent.classification || "-"}
              disabled
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Échelon / Grade"
              fullWidth
              value={agent.echelon || "-"}
              disabled
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Supérieur hiérarchique"
              fullWidth
              value={agent.superieur || "-"}
              disabled
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Type de contrat"
              fullWidth
              value={agent.typeContrat || "-"}
              disabled
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Date d’embauche"
              fullWidth
              value={
                agent.dateEmbauche
                  ? new Date(agent.dateEmbauche).toLocaleDateString()
                  : "-"
              }
              disabled
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Ancienneté"
              fullWidth
              value={agent.anciennete || "-"}
              disabled
            />
          </Grid>
        </Grid>

        {/* 2. Objectifs fixés */}
        {sectionTitle(2, "APPRÉCIATION DE LA PERFORMANCE (Objectifs fixés)")}
        <Table size="small" sx={{ mb: 3, border: "2px solid black" }}>
          <TableHead>
            <TableRow>
              {[
                "Activité",
                "Indicateurs",
                "Attendu",
                "Réalisé",
                "% Atteinte",
                "Commentaires",
              ].map((h, i) => (
                <TableCell key={i} sx={headerCellStyle}>
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {(evaluation.objectifsFixes || []).map((obj, idx) => (
              <TableRow key={idx}>
                <TableCell sx={cellStyle}>
                  {obj.activite || `Activité ${idx + 1}`}
                </TableCell>
                <TableCell sx={cellStyle}>{obj.indicateurs || "-"}</TableCell>
                <TableCell sx={cellStyle}>{obj.attendu || "-"}</TableCell>
                <TableCell sx={cellStyle}>{obj.realise || "-"}</TableCell>
                <TableCell sx={cellStyle}>{obj.pourcentage || "-"}</TableCell>
                <TableCell sx={cellStyle}>{obj.commentaire || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* 3. Objectifs hors fixés */}
        {sectionTitle(
          3,
          "APPRÉCIATION DE LA PERFORMANCE (Hors objectifs fixés)"
        )}
        <Table size="small" sx={{ mb: 3, border: "2px solid black" }}>
          <TableHead>
            <TableRow>
              {[
                "Activité",
                "Indicateurs",
                "Attendu",
                "Réalisé",
                "% Atteinte",
                "Commentaires",
              ].map((h, i) => (
                <TableCell key={i} sx={headerCellStyle}>
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {(evaluation.objectifsHorsFixes || []).map((obj, idx) => (
              <TableRow key={idx}>
                <TableCell sx={cellStyle}>
                  {obj.activite || `Activité ${idx + 1}`}
                </TableCell>
                <TableCell sx={cellStyle}>{obj.indicateurs || "-"}</TableCell>
                <TableCell sx={cellStyle}>{obj.attendu || "-"}</TableCell>
                <TableCell sx={cellStyle}>{obj.realise || "-"}</TableCell>
                <TableCell sx={cellStyle}>{obj.pourcentage || "-"}</TableCell>
                <TableCell sx={cellStyle}>{obj.commentaire || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* 4. Compétences */}
        {sectionTitle(4, "ÉVALUATION DES COMPÉTENCES")}
        {[
          "Savoir",
          "Savoir-faire",
          "Savoir-être",
          "Valeurs HARDIE",
          "Discipline",
        ].map((categorie, idx) => (
          <Box key={idx} sx={{ mb: 3 }}>
            <Typography fontWeight="bold" mb={1}>
              {categorie}
            </Typography>
            <Table size="small" sx={{ border: "2px solid black" }}>
              <TableHead>
                <TableRow>
                  {["Critère", "Note", "Axe d’amélioration"].map((h, i) => (
                    <TableCell key={i} sx={headerCellStyle}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {(competences[categorie] || []).map((comp, i) => (
                  <TableRow key={i}>
                    <TableCell sx={cellStyle}>{comp.critere}</TableCell>
                    <TableCell sx={cellStyle}>{comp.note || "-"}</TableCell>
                    <TableCell sx={cellStyle}>
                      {comp.axeAmelioration || "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        ))}

        {/* 5. Appréciation globale */}
        {sectionTitle(5, "APPRÉCIATION GLOBALE")}
        <TextField
          fullWidth
          multiline
          minRows={3}
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

        {/* 6. Décision finale */}
        {sectionTitle(6, "DÉCISION FINALE")}
        <TextField
          fullWidth
          multiline
          minRows={2}
          value={evaluation.decisionFinale || ""}
          disabled
          sx={{ mb: 4 }}
        />

        {/* 7. Avis du Directeur */}
        {sectionTitle(7, "AVIS ET APPRÉCIATION GÉNÉRALE DU DIRECTEUR")}
        <TextField
          label="Appréciation générale du travail"
          fullWidth
          multiline
          minRows={3}
          value={evaluation.directeur?.appreciationGenerale || ""}
          disabled
          sx={{ mb: 3 }}
        />
        <TextField
          label="Demandes à valider"
          fullWidth
          multiline
          minRows={2}
          value={evaluation.directeur?.demandesValider || ""}
          disabled
          sx={{ mb: 3 }}
        />
        <TextField
          label="Autres propositions"
          fullWidth
          multiline
          minRows={2}
          value={evaluation.directeur?.autresPropositions || ""}
          disabled
          sx={{ mb: 4 }}
        />
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Nom du Directeur"
              fullWidth
              value={evaluation.directeur?.nom || ""}
              disabled
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Date de signature"
              fullWidth
              value={
                evaluation.directeur?.dateSignature
                  ? new Date(
                      evaluation.directeur.dateSignature
                    ).toLocaleDateString()
                  : ""
              }
              disabled
            />
          </Grid>
        </Grid>

        {/* 8. Légende */}
        {sectionTitle(8, "LÉGENDE DES APPRÉCIATIONS")}
        <Table size="small" sx={{ mb: 4, border: "2px solid black" }}>
          <TableHead>
            <TableRow>
              {["Performance", "Descriptif", "Niveau d’atteinte"].map(
                (h, i) => (
                  <TableCell key={i} sx={headerCellStyle}>
                    {h}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell sx={cellStyle}>Objectifs atteints</TableCell>
              <TableCell sx={cellStyle}>
                Dépasse les attentes. Attitudes et qualités observées
                systématiquement.
              </TableCell>
              <TableCell sx={cellStyle}>100%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={cellStyle}>
                Objectifs moyennement atteints
              </TableCell>
              <TableCell sx={cellStyle}>
                Correspond partiellement aux attentes. Attitudes mises en œuvre
                presque tout le temps.
              </TableCell>
              <TableCell sx={cellStyle}>85%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={cellStyle}>
                Objectifs faiblement atteints
              </TableCell>
              <TableCell sx={cellStyle}>
                Ne rencontre pas certaines exigences. Seuls certains aspects
                sont mis en œuvre.
              </TableCell>
              <TableCell sx={cellStyle}>51%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={cellStyle}>Objectifs non atteints</TableCell>
              <TableCell sx={cellStyle}>Ne répond pas aux attentes.</TableCell>
              <TableCell sx={cellStyle}>{"< 50%"}</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {/* Signatures */}
        <Box sx={{ position: "absolute", bottom: "20mm", left: 0, right: 0 }}>
          <Grid container spacing={4}>
            <Grid item xs={6}>
              <Box textAlign="center">
                <Typography>Collaborateur</Typography>
                <Box
                  sx={{
                    borderTop: "1px solid black",
                    mt: 8,
                    width: "80%",
                    mx: "auto",
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box textAlign="center">
                <Typography>Supérieur hiérarchique</Typography>
                <Box
                  sx={{
                    borderTop: "1px solid black",
                    mt: 8,
                    width: "80%",
                    mx: "auto",
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} mt={6}>
              <Box textAlign="center">
                <Typography>Directeur</Typography>
                <Box
                  sx={{
                    borderTop: "1px solid black",
                    mt: 8,
                    width: "50%",
                    mx: "auto",
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default FicheEvaluationPrint;
