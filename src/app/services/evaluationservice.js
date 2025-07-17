const API_URL = "http://localhost:7000/Evaluation";

/**
 * Enregistre ou met à jour une évaluation (brouillon ou finale)
 * @param {Object} params
 * @param {string} params.staffId - ID du staff concerné
 * @param {string} params.managerId - ID du manager évaluateur
 * @param {string} params.dateEvaluation - Date d’évaluation au format YYYY-MM-DD
 * @param {Object} params.data - Données du formulaire d’évaluation
 * @param {boolean} params.isFinal - true si soumission finale
 * @param {string|null} params.token - Token JWT, récupéré automatiquement si non fourni
 */
export const updateOrCreateEvaluation = async ({ staffId, managerId, dateEvaluation, data, isFinal, lastStep, token }) => {
  try {
    const response = await fetch("http://localhost:7000/evaluation/save", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        staffId,
        managerId,
        dateEvaluation,
        data,
        isFinal,
        lastStep,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Erreur back:", errorData);
      throw new Error(errorData.message || "Erreur lors de la sauvegarde");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Erreur dans updateOrCreateEvaluation:", error);
    throw error;
  }
};
