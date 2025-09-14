"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import FichePosteForm from "@/components/FichePosteForm";

export default function FicheDePostePage() {
  const params = useParams();
  const staffId = params?.staffId;

  const [loading, setLoading] = useState(true);
  const [fiche, setFiche] = useState(null);
  const [error, setError] = useState("");

  // Charger la fiche existante si elle existe
  useEffect(() => {
    const fetchFiche = async () => {
      if (!staffId) return;

      try {
        const res = await fetch(`http://localhost:7000/fiche-de-poste/${staffId}`);
        if (!res.ok) {
          if (res.status === 404) {
            setFiche(null);
          } else {
            throw new Error("Erreur serveur");
          }
        } else {
          const data = await res.json();
          setFiche(data);
        }
      } catch (err) {
        console.error("Erreur lors du chargement :", err);
        setError("Erreur lors du chargement de la fiche");
      } finally {
        setLoading(false);
      }
    };

    fetchFiche();
  }, [staffId]);

  // Création
  const handleCreate = async (formData) => {
    try {
      const res = await fetch("http://localhost:7000/fiche-de-poste/creer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, staffId }),
      });

      if (!res.ok) throw new Error("Erreur lors de la création");

      const data = await res.json();
      setFiche(data);
      alert("Fiche créée avec succès !");
    } catch (err) {
      console.error("Erreur création :", err);
      setError("Erreur lors de la création");
    }
  };

  // Mise à jour
  const handleUpdate = async (formData) => {
  if (!fiche?._id) {
    setError("Impossible de trouver l'ID de la fiche à mettre à jour.");
    return;
  }

  try {
    console.log("Données envoyées à la mise à jour :", formData);

    const res = await fetch(`http://localhost:7000/fiche-de-poste/${fiche._id}`, {
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
      console.error("Erreur serveur :", errorMessage);
      throw new Error(errorMessage);
    }

    const updatedFiche = await res.json();
    setFiche(updatedFiche);
    alert("Fiche mise à jour avec succès !");
  } catch (err) {
    console.error("Erreur mise à jour :", err);
    setError(err.message || "Erreur lors de la mise à jour");
  }
};



  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h5" gutterBottom>
        Fiche de Poste de l&apos;Agent
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <FichePosteForm
          fiche={fiche}
          staffId={staffId}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
        />
      )}
    </Container>
  );
}
