"use client";

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Typography, CircularProgress, Alert } from "@mui/material";
import EvaluationStepper from "@/components/EvaluationStepper";

const NewEvaluationPage = () => {
  const { staffId } = useParams();
  const searchParams = useSearchParams();
  const dateEvaluation = searchParams.get("date");
  const router = useRouter();

  const [evaluation, setEvaluation] = useState(null);
  const [staffData, setStaffData] = useState(null);
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

        // Fetch staff
        const resStaff = await fetch(`http://localhost:7000/staff/${staffId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!resStaff.ok) throw new Error("Impossible de récupérer les infos du staff");
        const staff = await resStaff.json();
        setStaffData(staff);

        // Fetch evaluation
        const resEval = await fetch(`http://localhost:7000/Evaluation/staff/${staffId}/${dateEvaluation}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (resEval.ok) {
          const dataEval = await resEval.json();
          const evalData = dataEval.evaluation || null;
          setEvaluation(evalData);
        } else if (resEval.status === 404) {
          setEvaluation(null);
        } else {
          const text = await resEval.text();
          throw new Error(text);
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
        token={localStorage.getItem("token")}
        initialStep={evaluation?.lastStep || "objectifs"} 
      />

    </div>
  );
};

export default NewEvaluationPage;
