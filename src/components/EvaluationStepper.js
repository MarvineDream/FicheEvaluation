'use client';

import { useState, useEffect } from 'react';
import {
  Stepper, Step, StepLabel, Button, Typography, Box
} from '@mui/material';
import AgentInfoForm from '../components/steps/AgentInfoForm';
import ObjectifsForm from '../components/steps/ObjectifsForm';
import CompetencesForm from '../components/steps/CompetencesForm';
import AppreciationForm from '../components/steps/AppreciationForm';
import FinalisationForm from '../components/steps/FinalisationForm';
import { updateOrCreateEvaluation } from '../app/services/evaluationservice';

const steps = [
  'Informations agent',
  'Objectifs',
  'Compétences',
  'Appréciation globale',
  'Finalisation',
];

const EvaluationStepper = ({ staff, periodeEvaluation, token }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState(null); // null par défaut
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    console.log('staff reçu dans EvaluationStepper:', staff);
    if (staff) {
      setFormData({
        agent: {
          nom: staff.nom || '',
          prenom: staff.prenom || '',
          email: staff.email || '',
          emploi: staff.poste || '',
          direction: staff.direction || '',
          typeContrat: staff.typeContrat || '',
          dateEmbauche: staff.dateEmbauche || '',
        },
        objectifs: [],
        integration: [],
        competences: {},
        appreciationGlobale: {},
        decision: {},
        signatures: {},
      });
      setIsReady(true);
    }
  }, [staff]);

  if (!isReady || !formData) {
    return <Typography>Chargement des données de l&apos;agent...</Typography>;
  }

  const handleNext = async () => {
    await updateOrCreateEvaluation({
      staffId: staff._id,
      periodeEvaluation,
      data: formData,
      isFinal: false,
      token,
    });
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleChange = (section, value) => {
    setFormData((prev) => ({ ...prev, [section]: value }));
  };

  const handleFinalSubmit = async () => {
    await updateOrCreateEvaluation({
      staffId: staff._id,
      periodeEvaluation,
      data: formData,
      isFinal: true,
      token,
    });
    setActiveStep(steps.length);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <AgentInfoForm value={formData.agent} onChange={(val) => handleChange('agent', val)} />;
      case 1:
        return <ObjectifsForm value={formData.objectifs} onChange={(val) => handleChange('objectifs', val)} />;
      case 2:
        return <CompetencesForm value={formData.competences} onChange={(val) => handleChange('competences', val)} />;
      case 3:
        return <AppreciationForm value={formData.appreciationGlobale} onChange={(val) => handleChange('appreciationGlobale', val)} />;
      case 4:
        return <FinalisationForm value={formData} onSubmit={handleFinalSubmit} />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mt: 3 }}>
        {activeStep === steps.length ? (
          <Typography variant="h6" color="success.main">
            ✅ Évaluation soumise avec succès !
          </Typography>
        ) : (
          <>
            {getStepContent(activeStep)}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button disabled={activeStep === 0} onClick={handleBack}>Retour</Button>
              <Button variant="contained" onClick={activeStep === steps.length - 1 ? handleFinalSubmit : handleNext}>
                {activeStep === steps.length - 1 ? 'Soumettre' : 'Suivant'}
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default EvaluationStepper;
