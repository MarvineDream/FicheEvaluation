const API_URL = 'http://localhost:7000/Evaluation'; 

export const updateOrCreateEvaluation = async ({ staffId, periodeEvaluation, data, isFinal = false, token }) => {
  try {
    const response = await fetch(`${API_URL}/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        staffId,
        periodeEvaluation,
        data,
        isFinal,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erreur serveur');
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la mise à jour ou création de l’évaluation :', error);
    throw error;
  }
};
