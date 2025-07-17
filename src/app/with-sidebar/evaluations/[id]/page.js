"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Typography,
  Card,
  CardContent,
  Stack,
  Button,
} from "@mui/material";

const EvaluationsPage = () => {
  const { id } = useParams(); // staffId
  const router = useRouter();

  const [userRole, setUserRole] = useState(null);
  const [staffData, setStaffData] = useState(null);
  const [evaluations, setEvaluations] = useState([]);
  const [evaluationInProgress, setEvaluationInProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [evaluationsPotentiel, setEvaluationsPotentiel] = useState([]);


  const dateEvaluation = new Date().toISOString().split("T")[0];

  // Décoder le rôle utilisateur depuis le token JWT
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const base64Payload = token.split('.')[1];
        const payload = JSON.parse(atob(base64Payload));
        setUserRole(payload.role); // adapter selon la clé exacte dans votre token
      } catch (err) {
        console.error("Erreur décodage token :", err);
      }
    }
  }, []);

  useEffect(() => {
    if (!id) return;

    const fetchStaffData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const res = await fetch(`http://localhost:7000/staff/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Impossible de récupérer les infos du staff");
        const data = await res.json();
        setStaffData(data);
      } catch (err) {
        console.error("Erreur fetch staff:", err);
      }
    };

    fetchStaffData();
  }, [id, router]);

  useEffect(() => {
    if (!id) return;

    const fetchEvaluationsPotentiel = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:7000/Evaluation/staff/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Erreur fetch potentiel");

        const data = await res.json();
        setEvaluationsPotentiel(data);
      } catch (err) {
        console.error("Erreur récupération évaluations potentiel :", err);
      }
    };

    fetchEvaluationsPotentiel();
  }, [id]);



  useEffect(() => {
    if (!id) return;

    const fetchEvaluations = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };
        const urlAll = `http://localhost:7000/Evaluation/staff/${id}`;
        const urlInProgress = `http://localhost:7000/Evaluation/staff/${id}/${dateEvaluation}`;

        const [resAll, resInProgress] = await Promise.all([
          fetch(urlAll, { headers }),
          fetch(urlInProgress, { headers }),
        ]);

        if (!resAll.ok) {
          const errorText = await resAll.text();
          console.error(` Erreur fetch all (${resAll.status}):`, errorText);
          throw new Error("Erreur lors du fetch des évaluations");
        } else {
          const dataAll = await resAll.json();
          setEvaluations(dataAll);
        }

        if (resInProgress.ok) {
          const dataInProgress = await resInProgress.json();
          setEvaluationInProgress(dataInProgress.evaluation || null);
        } else if (resInProgress.status === 404) {
          setEvaluationInProgress(null);
        } else {
          const errorText = await resInProgress.text();
          console.error(` Erreur fetch inProgress (${resInProgress.status}):`, errorText);
          throw new Error("Erreur lors du fetch de l'évaluation en cours");
        }

        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluations();
  }, [id, dateEvaluation, router]);

  if (loading) return <p>⏳ Chargement...</p>;
  if (error) return <p style={{ color: "red" }}>❌ Erreur : {error}</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        Évaluations de {staffData ? `${staffData.prenom} ${staffData.nom}` : id}
      </Typography>

      {/* Évaluation en cours */}
      {evaluationInProgress ? (
        <Card variant="outlined" sx={{ mb: 4, p: 2 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Évaluation en cours ({new Date(evaluationInProgress.dateEvaluation).toLocaleDateString()})
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Statut : {evaluationInProgress.statutEvaluation}
            </Typography>

            {/* Bouton caché si rôle RH */}
            {userRole !== "RH" && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  if (!evaluationInProgress?.staffId || !evaluationInProgress?.dateEvaluation) {
                    alert("Aucune évaluation en cours à continuer.");
                    return;
                  }
                  const dateParam = new Date(evaluationInProgress.dateEvaluation).toISOString().slice(0, 10);
                  router.push(`/with-sidebar/evaluations/new/${evaluationInProgress.staffId}?date=${dateParam}`);
                }}
                sx={{ mt: 2 }}
              >
                Continuer l&apos;évaluation
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Typography>ℹ️ Aucune évaluation en cours pour la date {dateEvaluation}</Typography>
      )}

      {/* Historique des évaluations */}
      <Typography variant="h5" gutterBottom>
        📚 Historique des évaluations
      </Typography>
      {evaluations.length === 0 ? (
        <Typography>Aucune évaluation trouvée.</Typography>
      ) : (
        <Stack spacing={2}>
          {evaluations.map((ev) => (
            <Card key={ev._id} variant="outlined">
              <CardContent>
                <Typography variant="subtitle1">
                  {new Date(ev.dateEvaluation).toLocaleDateString()}
                </Typography>
                <Typography variant="body2">Statut : {ev.statutEvaluation}</Typography>

                <Button
                  variant="outlined"
                  sx={{ mt: 1 }}
                  onClick={() => {
                    router.push(`/with-sidebar/evaluations/fiche/${ev._id}`);
                  }}
                >
                  Voir la fiche
                </Button>

                {/* Bouton "Continuer" visible uniquement si pas RH et statut "En cours" */}
                {ev.statutEvaluation === "En cours" && userRole !== "RH" && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      const staffId = ev.staffId || ev.staff?._id || ev.staffId?._id;
                      const date = new Date(ev.dateEvaluation).toISOString().split("T")[0];
                      router.push(`/with-sidebar/evaluations/new/${staffId}?date=${date}`);
                    }}
                    sx={{ mt: 2 }}
                  >
                    Continuer l&apos;évaluation
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        🌟 Évaluations du potentiel
      </Typography>

      {evaluationsPotentiel.length === 0 ? (
        <Typography>Aucune évaluation de potentiel disponible.</Typography>
      ) : (
        <Stack spacing={2}>
          {evaluationsPotentiel.map((ev) => (
            <Card key={ev._id} variant="outlined">
              <CardContent>
                <Typography variant="subtitle1">
                  {new Date(ev.dateEvaluation).toLocaleDateString()}
                </Typography>
                <Typography>Classification auto : <strong>{ev.classificationAutomatique}</strong></Typography>
                {ev.classificationFinale && (
                  <Typography>Classification finale : <strong>{ev.classificationFinale}</strong></Typography>
                )}

                <Button
                  variant="outlined"
                  sx={{ mt: 1 }}
                  onClick={() => {
                    router.push(`/with-sidebar/evaluationPotentiel/${ev._id}`);
                  }}
                >
                  Voir l&apos;évaluation
                </Button>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </div>
  );
};

export default EvaluationsPage;
