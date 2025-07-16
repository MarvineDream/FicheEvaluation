"use client";
import { useRouter } from "next/navigation";
import { Button } from "@mui/material";

export default function VoirAfficheButton({ evaluationId }) {
  const router = useRouter();

  return (
    <Button
      variant="outlined"
      onClick={() => router.push(`/with-sidebar/evaluations/fiche/${evaluationId}`)}
      sx={{ mt: 1 }}
    >
      Voir l’affiche
    </Button>
  );
}
