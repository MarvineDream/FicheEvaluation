"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Grid,
  Box,
} from "@mui/material";
import { ClipboardList, FileText } from "lucide-react";

const FicheSelectorButton = ({ employee }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleNavigate = (type) => {
    setOpen(false);
    const url =
      type === "poste"
        ? `/with-sidebar/fiche-de-poste/${employee._id}`
        : `/with-sidebar/fiche-objectifs/${employee._id}`;
    router.push(url);
  };

  return (
    <>
      <Button
        aria-label={`Ouvrir les fiches pour ${employee.firstName} ${employee.lastName}`}
        variant="outlined"
        sx={{
          flex: 1,
          backgroundColor: "#FFFBEB",
          color: "#92400E",
          border: "none",
          borderRadius: "8px",
          boxShadow: "none",
          ":hover": {
            backgroundColor: "#FEF3C7",
            border: "none",
            boxShadow: "none",
          },
          fontWeight: 500,
          textTransform: "none",
        }}
        onClick={() => setOpen(true)}
      >
        Fiches
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Choisir une fiche</DialogTitle>

        <DialogContent dividers>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Quelle fiche souhaitez-vous consulter ou remplir pour{" "}
            <strong>{employee.firstName} {employee.lastName}</strong> ?
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box
                onClick={() => handleNavigate("poste")}
                sx={{
                  cursor: "pointer",
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                  p: 2,
                  "&:hover": {
                    backgroundColor: "#f0f9ff",
                  },
                }}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <FileText size={22} className="text-blue-600" />
                  <Typography variant="subtitle1" fontWeight="bold">
                    Fiche de poste
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  Description du poste, missions, tâches et compétences attendues.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box
                onClick={() => handleNavigate("objectifs")}
                sx={{
                  cursor: "pointer",
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                  p: 2,
                  "&:hover": {
                    backgroundColor: "#f0fdf4",
                  },
                }}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <ClipboardList size={22} className="text-green-600" />
                  <Typography variant="subtitle1" fontWeight="bold">
                    Fiche d’objectifs
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  Objectifs fixés à l’agent en lien avec les missions du poste.
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

export default FicheSelectorButton;
