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
import CompetencesForm from "../components/steps/CompetencesForm";
import AppreciationForm from "../components/steps/AppreciationForm";
import FinalisationForm from "../components/steps/FinalisationForm";
import initialCompetences from "../components/steps/initialCompetences";

import { updateOrCreateEvaluation } from "../app/services/evaluationservice";
import useAuth from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";
import { calculateCompetenceScores } from "./utils/competenceUtils";

const steps = [
  { label: "Informations agent", key: "agent" },
  { label: "Objectifs fixés", key: "objectifsFixes" },
  { label: "Objectifs hors cadre", key: "objectifsHorsFixes" },
  { label: "Compétences", key: "competences" },
  { label: "Appréciation globale", key: "appreciationGlobale" },
  { label: "Finalisation", key: "finalisation" },
];

const EvaluationStepper = ({ evaluation, staff, dateEvaluation }) => {
  const { user } = useAuth();
  const router = useRouter();
  const managerId = user?._id;

  const [storedToken, setStoredToken] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState(null);
  const [departements, setDepartements] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // 🔹 Récupération du token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setStoredToken(token);
  }, []);

  // 🔹 Chargement des départements
  useEffect(() => {
    if (!storedToken) return;

    (async () => {
      try {
        const res = await fetch("http://localhost:7000/departement", {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        if (!res.ok) throw new Error("Erreur chargement départements");
        const data = await res.json();
        setDepartements(data);
      } catch (err) {
        console.error("Erreur fetch départements:", err);
      }
    })();
  }, [storedToken]);

  const getStepIndexFromKey = (stepKey) => {
    const index = steps.findIndex((step) => step.key === stepKey);
    return index >= 0 ? index : 0;
  };

  // 🔹 Initialisation du formulaire
  useEffect(() => {
    if (
      !managerId ||
      !staff ||
      !dateEvaluation ||
      departements.length === 0 ||
      !storedToken
    )
      return;
    if (formData) return;

    const safeAgent = {
  nom: (evaluation?.agent?.nom || staff.nom || "Inconnu").trim(),
  prenom: (evaluation?.agent?.prenom || staff.prenom || "Inconnu").trim(),
  email: (evaluation?.agent?.email || staff.email || "inconnu@example.com").trim(),
  emploi: (evaluation?.agent?.emploi || staff.poste || "Non défini").trim(),
   typeContrat: staff.typeContrat || "CDD", // fallback par défaut
  dateEmbauche: evaluation?.agent?.dateEmbauche
    ? new Date(evaluation.agent.dateEmbauche)
    : staff.dateEmbauche
    ? new Date(staff.dateEmbauche)
    : new Date(),
  direction:
    evaluation?.agent?.direction ||
    (typeof staff.departement === "object"
      ? staff.departement.nom || staff.departement.name || ""
      : staff.departement || ""),
  telephone: evaluation?.agent?.telephone || staff.telephone || "",
  matricule: evaluation?.agent?.matricule || "",
  superieur:
    evaluation?.agent?.superieur ||
    (staff.managerId
      ? `${staff.managerId.prenom || ""} ${staff.managerId.nom || ""}`.trim()
      : ""),
  Classification: evaluation?.agent?.Classification || "",
  echelon: evaluation?.agent?.echelon || "",
  anciennete: evaluation?.agent?.anciennete || "",
};


    const initialData = {
      agent: safeAgent,
      objectifsFixes: evaluation?.objectifsFixes || [],
      objectifsHorsFixes: evaluation?.objectifsHorsFixes || [],
      competences:
        evaluation?.competences && Object.keys(evaluation.competences).length > 0
          ? evaluation.competences
          : initialCompetences,
      appreciationGlobale: evaluation?.appreciationGlobale || { texte: "" },
      decisionFinale: evaluation?.decisionFinale || "",
      finalisation: evaluation?.finalisation || {},
    };

    console.log("✅ Initialisation formData sécurisée :", initialData);

    setFormData(initialData);
    setActiveStep(getStepIndexFromKey(evaluation?.lastStep));
    setIsReady(true);
  }, [managerId, staff, dateEvaluation, departements, storedToken, evaluation, formData]);

  // 🔹 Change handler
  const handleChange = useCallback((section, value) => {
    setFormData((prev) => ({ ...prev, [section]: value }));
  }, []);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };
  const handleCloseSnackbar = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  // 🔹 Build payload (fusion staff + formData)
  const buildPayload = (isFinal = false) => {
    const safeAgent = {
      nom: formData?.agent?.nom?.trim() || staff?.nom || "Inconnu",
      prenom: formData?.agent?.prenom?.trim() || staff?.prenom || "Inconnu",
      email:
        formData?.agent?.email?.trim() || staff?.email || "inconnu@example.com",
      emploi: formData?.agent?.emploi?.trim() || staff?.poste || "Non défini",
      typeContrat: formData?.agent?.typeContrat || staff?.typeContrat || "CDD",
      dateEmbauche: formData?.agent?.dateEmbauche
        ? new Date(formData.agent.dateEmbauche)
        : staff?.dateEmbauche
        ? new Date(staff.dateEmbauche)
        : new Date(),
      direction:
        formData?.agent?.direction ||
        (typeof staff?.departement === "object"
          ? staff.departement.nom || staff.departement.name || ""
          : staff?.departement || ""),
      telephone: formData?.agent?.telephone || staff?.telephone || "",
      matricule: formData?.agent?.matricule || staff?.matricule || "",
      superieur:
        formData?.agent?.superieur ||
        (staff?.managerId
          ? `${staff.managerId.prenom || ""} ${staff.managerId.nom || ""}`.trim()
          : ""),
    };

    return {
      staffId: staff._id,
      managerId,
      dateEvaluation,
      agent: safeAgent,
      objectifsFixes: formData?.objectifsFixes || [],
      objectifsHorsFixes: formData?.objectifsHorsFixes || [],
      competences: formData?.competences || initialCompetences,
      appreciationGlobale: formData?.appreciationGlobale || { texte: "" },
      decisionFinale: formData?.decisionFinale || "",
      finalisation: formData?.finalisation || {},
      isFinal,
      lastStep: steps[activeStep]?.key || null,
      token: storedToken,
    };
  };

  // 🔹 Sauvegarde brouillon
  const handleSaveDraft = async () => {
    if (!formData) return;

    setIsSaving(true);
    try {
      const payload = buildPayload(false);
      await updateOrCreateEvaluation(payload);
      showSnackbar("Brouillon enregistré");
      router.push("/with-sidebar/staff");
    } catch (error) {
      console.error(error);
      showSnackbar("Erreur lors de la sauvegarde", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // 🔹 Navigation next
  const handleNext = async () => {
    try {
      if (activeStep < steps.length - 1) {
        await updateOrCreateEvaluation(buildPayload(false));
        setActiveStep((prev) => prev + 1);
      }
    } catch (error) {
      console.error(error);
      showSnackbar("Erreur lors de la sauvegarde", "error");
    }
  };

  const handleBack = () =>
    setActiveStep((prev) => (prev > 0 ? prev - 1 : 0));

  // 🔹 Soumission finale
  const handleFinalSubmit = async () => {
    try {
      const competencesScores = calculateCompetenceScores(formData.competences);

      const payload = {
        ...buildPayload(true),
        competencesScores,
      };

      const saved = await updateOrCreateEvaluation(payload);
      setActiveStep(steps.length);
      showSnackbar("✅ Évaluation soumise avec succès");

      router.push(`/with-sidebar/fiche-evaluation/${saved._id}`);
    } catch (error) {
      console.error(error);
      showSnackbar("Soumission finale échouée", "error");
    }
  };

  // 🔹 Step renderer
  const getStepContent = (step) => {
    if (!formData) return null;

    switch (steps[step]?.key) {
      case "agent":
        return (
          <AgentInfoForm
            value={formData.agent}
            onChange={(val) => handleChange("agent", val)}
          />
        );
      case "objectifsFixes":
        return (
          <ObjectifsForm
            staffId={staff._id}
            value={formData.objectifsFixes}
            onChange={(val) => handleChange("objectifsFixes", val)}
          />
        );
      case "objectifsHorsFixes":
        return (
          <ObjectifsHorsCadreForm
            value={formData.objectifsHorsFixes}
            onChange={(val) => handleChange("objectifsHorsFixes", val)}
          />
        );
      case "competences":
        return (
          <CompetencesForm
            value={formData.competences}
            onChange={(val) => handleChange("competences", val)}
          />
        );
      case "appreciationGlobale":
        const scores = calculateCompetenceScores(formData.competences);
        return (
          <AppreciationForm
            value={formData.appreciationGlobale}
            onChange={(val) => handleChange("appreciationGlobale", val)}
            objectifsFixes={formData.objectifsFixes}
            objectifsHorsFixes={formData.objectifsHorsFixes}
            competences={formData.competences}
            syntheseScores={scores}
          />
        );
      case "finalisation":
        return (
          <FinalisationForm
            value={formData.finalisation}
            onChange={(val) => handleChange("finalisation", val)}
            onSubmit={handleFinalSubmit}
            staffName={`${staff?.prenom || ""} ${staff?.nom || ""}`}
            managerName={
              staff?.manager
                ? `${staff.manager.prenom || ""} ${staff.manager.nom || ""}`.trim()
                : ""
            }
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
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 2,
                mt: 3,
                flexWrap: "wrap",
              }}
            >
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                variant="outlined"
              >
                Retour
              </Button>
              <Box sx={{ display: "flex", gap: 2 }}>
                {activeStep !== 0 && activeStep !== steps.length - 1 && (
                  <Button
                    onClick={handleSaveDraft}
                    variant="outlined"
                    color="primary"
                    disabled={isSaving}
                  >
                    {isSaving ? "Sauvegarde..." : "Sauvegarder"}
                  </Button>
                )}
                <Button
                  onClick={
                    activeStep === steps.length - 1
                      ? handleFinalSubmit
                      : handleNext
                  }
                  variant="contained"
                  color="primary"
                >
                  {activeStep === steps.length - 1 ? "Soumettre" : "Suivant"}
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={handleCloseSnackbar}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EvaluationStepper;
