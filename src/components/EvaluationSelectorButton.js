"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Box,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { GaugeCircle, Brain } from "lucide-react";

const EvaluationSelectorButton = ({ employee, buttonLabel = "Nouvelle évaluation" }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleSelect = (type) => {
    const date = new Date().toISOString().split("T")[0];
    if (type === "potentiel") {
      router.push(`/with-sidebar/evaluationPotentiel?staffId=${employee._id}&date=${date}`);
    } else if (type === "mi-parcours") {
      router.push(`/with-sidebar/evaluations/new/${employee._id}?date=${date}`);
    }
    setOpen(false);
  };

  return (
    <>
      <button
        className="flex-1 bg-green-50 text-green-700 hover:bg-green-100 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
        onClick={() => setOpen(true)}
      >
        {buttonLabel}
      </button>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Choisir le type d’évaluation</DialogTitle>

        <DialogContent dividers>
          <Typography variant="body1" className="mb-4">
            Pour quel type d’évaluation souhaitez-vous procéder pour{" "}
            <strong>{employee.nom}</strong> ?
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box
                onClick={() => handleSelect("mi-parcours")}
                className="cursor-pointer border rounded-lg p-4 hover:bg-blue-50 transition"
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <GaugeCircle size={22} className="text-blue-600" />
                  <Typography variant="subtitle1" fontWeight="bold">
                    Évaluation mi-parcours
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  Suivi des objectifs fixés dans la fiche de poste pour évaluer l&apos;avancement.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box
                onClick={() => handleSelect("potentiel")}
                className="cursor-pointer border rounded-lg p-4 hover:bg-purple-50 transition"
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <Brain size={22} className="text-purple-600" />
                  <Typography variant="subtitle1" fontWeight="bold">
                    Évaluation de potentiel
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  Évalue les aptitudes, compétences comportementales et perspectives de carrière.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)} color="inherit">
            Annuler
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EvaluationSelectorButton;
