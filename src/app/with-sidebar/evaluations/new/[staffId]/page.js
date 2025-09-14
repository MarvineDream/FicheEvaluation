"use client";

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Typography, CircularProgress, Alert } from "@mui/material";
import EvaluationStepper from "@/components/EvaluationStepper";

const NewEvaluationPage = () => {
  const params = useParams();
  const staffId = params.staffId;
  const searchParams = useSearchParams();
  const dateEvaluation = searchParams.get("date");
  const router = useRouter();

  const [evaluation, setEvaluation] = useState(null);
  const [staffData, setStaffData] = useState(null);
  const [fichePoste, setFichePoste] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!staffId || !dateEvaluation) return;

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };

        // Fetch staff
        const resStaff = await fetch(`http://localhost:7000/staff/${staffId}`, { headers });
        if (!resStaff.ok) throw new Error("Impossible de récupérer les infos du staff");
        const staff = await resStaff.json();
        setStaffData(staff);

        // Fetch fiche de poste
        const resFiche = await fetch(`http://localhost:7000/fiche-de-poste/${staffId}`, { headers });
        if (resFiche.ok) {
          const fiche = await resFiche.json();
          setFichePoste(fiche);
        } else if (resFiche.status === 404) {
          // Pas de fiche => on gère plus bas avec un message moderne
          setFichePoste(null);
        } else {
          throw new Error("Erreur serveur lors de la récupération de la fiche de poste");
        }

        // Fetch évaluation
        const resEval = await fetch(`http://localhost:7000/Evaluation/staff/${staffId}/${dateEvaluation}`, { headers });
        if (resEval.ok) {
          const dataEval = await resEval.json();
          setEvaluation(dataEval.evaluation || null);
        } else if (resEval.status === 404) {
          setEvaluation(null);
        } else {
          throw new Error(await resEval.text());
        }

        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [staffId, dateEvaluation, router]);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  if (!staffData) {
    return <Typography color="warning.main">Chargement des informations du staff...</Typography>;
  }

  // le rendu si aucune fiche d’objectifs trouvée
  if (!fichePoste) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Alert severity="warning" variant="outlined" sx={{ maxWidth: 500, textAlign: "center" }}>
           Avant de commencer une évaluation, vous devez d’abord créer la fiche d’objectifs de ce collaborateur.
        </Alert>
        <button
          onClick={() => router.push(`/with-sidebar/fiche-objectifs/${staffId}`)}
          className="px-4 py-2 rounded-lg bg-[#4caf50] text-white font-semibold shadow hover:scale-105 transition"
        >
          Créer la fiche d’objectifs
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        {evaluation ? "Continuer l'évaluation" : "Nouvelle évaluation"}
      </Typography>

      <EvaluationStepper
        evaluation={evaluation}
        staffId={staffId}
        dateEvaluation={dateEvaluation}
        staff={staffData}
        fichePoste={fichePoste}
        token={localStorage.getItem("token")}
        initialStep={evaluation?.lastStep || "AgentInfoForm"}
      />
    </div>
  );
};

export default NewEvaluationPage;
