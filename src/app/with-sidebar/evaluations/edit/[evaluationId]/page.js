"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Typography, TextField, Button } from "@mui/material";

const EvaluationEditPage = () => {
  const { evaluationId } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentaireGlobal, setCommentaireGlobal] = useState("");

  // 🔁 Étape en cours récupérée dans l'URL (ex: ?step=global)
  const step = searchParams.get("step") || "objectifs";

  useEffect(() => {
    const fetchEvaluation = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }
        const res = await fetch(`https://backendeva.onrender.com/Evaluation/${evaluationId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Impossible de récupérer l'évaluation");
        const data = await res.json();
        setEvaluation(data);
        setCommentaireGlobal(data.appreciationGlobale?.commentaire || "");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvaluation();
  }, [evaluationId, router]);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const payload = {
        appreciationGlobale: {
          ...evaluation.appreciationGlobale,
          commentaire: commentaireGlobal,
        },
        lastStep: step, // 🔁 très important : on envoie l’étape courante !
      };

      const res = await fetch(`https://backendeva.onrender.com/Evaluation/${evaluationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Erreur lors de la sauvegarde");

      alert("Évaluation mise à jour !");
      router.push(`/evaluations/${evaluation.staffId}`);
    } catch (err) {
      alert("Erreur: " + err.message);
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p style={{ color: "red" }}>Erreur: {error}</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        Modifier l&apos;évaluation du {new Date(evaluation.dateEvaluation).toLocaleDateString()}
      </Typography>

      <Typography variant="subtitle1" gutterBottom>
        🧭 Étape en cours : <strong>{step}</strong>
      </Typography>

      {/* Ex. affichage d'un champ conditionnel pour l'étape "global" */}
      {step === "global" && (
        <>
          <TextField
            label="Commentaire global"
            multiline
            rows={4}
            value={commentaireGlobal}
            onChange={(e) => setCommentaireGlobal(e.target.value)}
            fullWidth
            margin="normal"
          />
        </>
      )}

      {/* Ajoute d’autres conditions ici selon les étapes (objectifs, competences, etc.) */}

      <Button variant="contained" color="primary" onClick={handleSave}>
        Sauvegarder
      </Button>
    </div>
  );
};

export default EvaluationEditPage;
