"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Box,
  Snackbar,
  Alert,
  Container,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import AgentInfoForm from "../components/steps/AgentInfoForm";
import ObjectifsForm from "../components/steps/ObjectifsForm";
import ObjectifsHorsCadreForm from "../components/steps/ObjectifsHorsCadreForm";
import IntegrationForm from "../components/steps/IntegrationForm";
import CompetencesForm from "../components/steps/CompetencesForm";
import AppreciationForm from "../components/steps/AppreciationForm";
import FinalisationForm from "../components/steps/FinalisationForm";
import initialCompetences from "../components/steps/initialCompetences";

import { updateOrCreateEvaluation } from "../app/services/evaluationservice";
import useAuth from "@/app/hooks/useAuth";

const steps = [
  { label: "Informations agent", key: "agent" },
  { label: "Objectifs fixés", key: "objectifsFixes" },
  { label: "Objectifs hors cadre", key: "objectifsHorsFixes" },
  { label: "Intégration", key: "integration" },
  { label: "Compétences", key: "competences" },
  { label: "Appréciation globale", key: "appreciationGlobale" },
  { label: "Finalisation", key: "finalisation" },
];

const EvaluationStepper = ({ evaluation, staff, dateEvaluation }) => {
  const { user } = useAuth();
  const managerId = user?._id;

  const [storedToken, setStoredToken] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState(null);
  const [departements, setDepartements] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setStoredToken(token);
  }, []);

  const getDepartementNomById = useCallback(
    (id) => {
      const dep = departements.find((d) => d._id === id);
      return dep?.nom || "";
    },
    [departements]
  );

  useEffect(() => {
    if (!storedToken) return;
    const fetchDepartements = async () => {
      try {
        const res = await fetch("http://localhost:7000/departement", {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        const data = await res.json();
        setDepartements(data);
      } catch (err) {
        console.error("Erreur chargement départements :", err);
      }
    };
    fetchDepartements();
  }, [storedToken]);

  const getStepIndexFromKey = (stepKey) => {
    const index = steps.findIndex((step) => step.key === stepKey);
    return index >= 0 ? index : 0;
  };

  useEffect(() => {
    if (!managerId || !staff || !dateEvaluation || departements.length === 0) return;

    const initialData = evaluation
      ? {
          agent: {
            nom: evaluation.agent?.nom || staff.nom,
            prenom: evaluation.agent?.prenom || staff.prenom,
            email: evaluation.agent?.email || staff.email,
            emploi: evaluation.agent?.emploi || staff.poste,
            direction: evaluation.agent?.direction || getDepartementNomById(staff.departement),
            dateEmbauche: evaluation.agent?.dateEmbauche || staff.dateEmbauche || staff.dateDebutStage,
            typeContrat: evaluation.agent?.typeContrat || staff.typeContrat,
            telephone: evaluation.agent?.telephone || staff.telephone || "",
            matricule: evaluation.agent?.matricule || staff.matricule || "",
          },
          objectifsFixes: evaluation.objectifsFixes || [],
          objectifsHorsFixes: evaluation.objectifsHorsFixes || [],
          integration: evaluation.integration || {},
          competences:
            evaluation.competences && Object.keys(evaluation.competences).length > 0
              ? evaluation.competences
              : initialCompetences,
          appreciationGlobale: evaluation.appreciationGlobale || {},
          decision: evaluation.decision || { choix: "", commentaire: "" },
          signatures: evaluation.signatures || { collaborateur: "", responsableNom: "", rhNom: "" },
          finalisation: evaluation.finalisation || {},
        }
      : {
          agent: {
            nom: staff.nom,
            prenom: staff.prenom,
            email: staff.email,
            emploi: staff.poste,
            direction: getDepartementNomById(staff.departement),
            dateEmbauche: staff.dateEmbauche || staff.dateDebutStage,
            typeContrat: staff.typeContrat,
            telephone: staff.telephone || "",
            matricule: staff.matricule || "",
          },
          objectifsFixes: [],
          objectifsHorsFixes: [],
          integration: {},
          competences: initialCompetences,
          appreciationGlobale: {},
          decision: { choix: "", commentaire: "" },
          signatures: { collaborateur: "", responsableNom: "", rhNom: "" },
          finalisation: {},
        };

    setFormData(initialData);
    setActiveStep(getStepIndexFromKey(evaluation?.lastStep));
    setIsReady(true);
  }, [evaluation, staff, dateEvaluation, managerId, departements, getDepartementNomById]);

  useEffect(() => {
    if (!formData || !staff) return;

    const fullName = `${staff.prenom || ""} ${staff.nom || ""}`.trim();
    const managerFullName = staff.manager
      ? `${staff.manager.prenom || ""} ${staff.manager.nom || ""}`.trim()
      : "";

    const currentSignatures = formData.finalisation?.signatures || {};
    const collaborateur = currentSignatures.collaborateur || "";
    const responsableNom = currentSignatures.responsableNom || "";

    if (collaborateur === fullName && responsableNom === managerFullName) return;

    setFormData((prev) => ({
      ...prev,
      finalisation: {
        ...(prev.finalisation || {}),
        signatures: {
          ...prev.finalisation?.signatures,
          collaborateur: fullName,
          responsableNom: managerFullName,
        },
      },
    }));
  }, [formData, staff]);

  const handleChange = useCallback((section, value) => {
    setFormData((prev) => ({ ...prev, [section]: value }));
  }, []);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }));

  const buildPayload = (isFinal = false) => ({
    staffId: staff._id,
    managerId,
    dateEvaluation,
    data: formData,
    isFinal,
    lastStep: steps[activeStep]?.key || null,
    token: storedToken,
  });

  const handleSaveDraft = async () => {
    if (activeStep === 0) return;
    try {
      await updateOrCreateEvaluation(buildPayload(false));
      showSnackbar("Brouillon enregistré");
    } catch {
      showSnackbar("Erreur lors de la sauvegarde", "error");
    }
  };

  const handleNext = async () => {
    try {
      if (activeStep > 0) {
        await updateOrCreateEvaluation(buildPayload(false));
      }
      if (activeStep < steps.length - 1) {
        setActiveStep((prev) => prev + 1);
      }
    } catch {
      showSnackbar("Erreur lors de la sauvegarde", "error");
    }
  };

  const handleBack = () => setActiveStep((prev) => (prev > 0 ? prev - 1 : 0));

  const handleFinalSubmit = async () => {
    try {
      await updateOrCreateEvaluation(buildPayload(true));
      setActiveStep(steps.length);
      showSnackbar("✅ Évaluation soumise avec succès");
    } catch {
      showSnackbar("Soumission finale échouée", "error");
    }
  };

  const getStepContent = (step) => {
    if (!formData) return null;
    switch (steps[step]?.key) {
      case "agent":
        return <AgentInfoForm value={formData.agent} onChange={(val) => handleChange("agent", val)} />;
      case "objectifsFixes":
        return <ObjectifsForm value={formData.objectifsFixes} onChange={(val) => handleChange("objectifsFixes", val)} />;
      case "objectifsHorsFixes":
        return <ObjectifsHorsCadreForm value={formData.objectifsHorsFixes} onChange={(val) => handleChange("objectifsHorsFixes", val)} />;
      case "integration":
        return <IntegrationForm value={formData.integration} onChange={(val) => handleChange("integration", val)} />;
      case "competences":
        return <CompetencesForm value={formData.competences} onChange={(val) => handleChange("competences", val)} />;
      case "appreciationGlobale":
        return <AppreciationForm value={formData.appreciationGlobale} onChange={(val) => handleChange("appreciationGlobale", val)} objectifsFixes={formData.objectifsFixes} />;
      case "finalisation":
        return (
          <FinalisationForm
            value={formData.finalisation}
            onChange={(val) => handleChange("finalisation", val)}
            onSubmit={handleFinalSubmit}
            staffName={`${staff?.prenom || ""} ${staff?.nom || ""}`}
            managerName={staff?.manager ? `${staff.manager.prenom || ""} ${staff.manager.nom || ""}`.trim() : ""}
          />
        );
      default:
        return null;
    }
  };

  if (!isReady || !formData || !managerId) {
    return <Typography>Chargement des données de l’agent...</Typography>;
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ width: "100%", overflowX: "auto" }}>
        <Stepper activeStep={activeStep} alternativeLabel={isMobile}>
          {steps.map((step) => (
            <Step key={step.key}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <Box sx={{ mt: 3 }}>
        {activeStep === steps.length ? (
          <Typography variant="h6" color="success.main" align="center">
            ✅ Évaluation soumise avec succès !
          </Typography>
        ) : (
          <>
            {getStepContent(activeStep)}
            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, mt: 3, flexWrap: "wrap" }}>
              <Button disabled={activeStep === 0} onClick={handleBack} variant="outlined">
                Retour
              </Button>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button onClick={handleSaveDraft} variant="outlined" disabled={activeStep === 0}>
                  Sauvegarder
                </Button>
                <Button onClick={activeStep === steps.length - 1 ? handleFinalSubmit : handleNext} variant="contained" color="primary">
                  {activeStep === steps.length - 1 ? "Soumettre" : "Suivant"}
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Box>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={snackbar.severity} onClose={handleCloseSnackbar} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EvaluationStepper;
