"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Container, Typography, CircularProgress, Alert } from "@mui/material";
import FicheObjectifsForm from "@/components/FicheObjectifsForm";

export default function FicheObjectifsPage() {
  const params = useParams();
  const staffId = params?.staffId;

  const [loading, setLoading] = useState(true);
  const [fiche, setFiche] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!staffId) return;

    const fetchFiche = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`http://localhost:7000/fiche-objectifs/${staffId}`);
        if (!res.ok) {
          if (res.status === 404) {
            setFiche(null); // pas de fiche existante, on créera
          } else {
            throw new Error("Erreur serveur");
          }
        } else {
          const data = await res.json();
          setFiche(data);
        }
      } catch (err) {
        setError("Erreur lors du chargement de la fiche");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFiche();
  }, [staffId]);

  const handleCreate = async (formData) => {
  try {
    const res = await fetch("http://localhost:7000/fiche-objectifs/creer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, staffId }),
    });

    if (!res.ok) {
      let errorMessage = "Erreur lors de la création";
      try {
        const errorData = await res.json();
        errorMessage = errorData.message || JSON.stringify(errorData);
      } catch {
        errorMessage = await res.text(); // fallback si pas JSON
      }
      console.error("Réponse serveur :", errorMessage);
      throw new Error(errorMessage);
    }

    const data = await res.json();
    setFiche(data);
    alert("Fiche créée avec succès !");
  } catch (err) {
    console.error("Erreur création :", err);
    setError(err.message || "Erreur lors de la création");
  }
};

  const handleUpdate = async (formData) => {
    setError("");
    if (!fiche?._id) {
      setError("Impossible de trouver l'ID de la fiche à mettre à jour.");
      return;
    }
    try {
      const res = await fetch(`http://localhost:7000/fiche-objectifs/${fiche._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        let errorMessage = "Erreur lors de la mise à jour";
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || JSON.stringify(errorData);
        } catch {
          errorMessage = await res.text();
        }
        throw new Error(errorMessage);
      }
      const updatedFiche = await res.json();
      setFiche(updatedFiche);
      alert("Fiche mise à jour avec succès !");
    } catch (err) {
      setError(err.message || "Erreur lors de la mise à jour");
      console.error(err);
    }
  };

  if (loading)
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h6">Chargement...</Typography>
        <CircularProgress />
      </Container>
    );

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Fiche d&apos;Objectifs
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <FicheObjectifsForm
        fiche={fiche}
        staffId={staffId}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
      />
    </Container>
  );
}
