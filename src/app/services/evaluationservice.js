const API_URL = "http://localhost:7000/Evaluation";

/**
 * Enregistre ou met à jour une évaluation (brouillon ou finale)
 * @param {Object} params
 * @param {string} params.staffId - ID du staff concerné
 * @param {string} params.managerId - ID du manager évaluateur
 * @param {string} params.dateEvaluation - Date d’évaluation (YYYY-MM-DD)
 * @param {Object} params.data - Données du formulaire (agent, objectifs, compétences, etc.)
 * @param {boolean} params.isFinal - true si soumission finale
 * @param {string} params.lastStep - clé de la dernière étape atteinte
 * @param {string|null} params.token - Token JWT
 */
export const updateOrCreateEvaluation = async ({
  staffId,
  managerId,
  dateEvaluation,
  data = {}, // valeur par défaut
  isFinal = false,
  lastStep,
  token,
}) => {
  try {
    // Étape 0 → pas besoin de sauvegarde
    if (lastStep === "agent") {
      console.log("Étape 0 (informations agent), pas de sauvegarde envoyée au backend");
      return { skipped: true };
    }

    // Vérifications minimales
    if (!staffId || !managerId || !dateEvaluation) {
      throw new Error("Champs obligatoires manquants : staffId, managerId ou dateEvaluation");
    }

    // On s'assure que data.agent existe toujours
    const agent = data.agent || {
      nom: "",
      prenom: "",
      poste: "",
      direction: "",
    };

    // Préparer le payload complet
    const payload = {
      staffId,
      managerId,
      dateEvaluation,
      agent, // on envoie toujours un objet
      objectifsFixes: data.objectifsFixes || [],
      objectifsHorsFixes: data.objectifsHorsFixes || [],
      integration: data.integration || {},
      competences: data.competences || {},
      appreciationGlobale: data.appreciationGlobale || {},
      commentaire: data.commentaire || "",
      decision: data.decision || {},
      signatures: data.signatures || {},
      isFinal,
      lastStep,
    };

    console.log("Payload envoyé au backend:", payload);

    const response = await fetch(`${API_URL}/save`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Erreur back:", errorData);
      throw new Error(errorData.message || "Erreur lors de la sauvegarde");
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur dans updateOrCreateEvaluation:", error);
    throw error;
  }
};
