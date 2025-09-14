"use client";

/**
 * Mapping des notes → valeurs numériques
 */
export const noteValues = {
  TB: 5, // Très Bien
  B: 4,  // Bien
  P: 3,  // Passable
  I: 2,  // Insuffisant
  PC: 1, // Pas Concerné
};

/**
 * Calcule la moyenne d’une liste de critères
 * @param {Array} criteres - Liste des critères d'une catégorie
 * @returns {number} Moyenne numérique de la catégorie
 */
const averageCategory = (criteres = []) => {
  const notes = criteres
    .map((c) => noteValues[c.note] || null)
    .filter((n) => n !== null);

  if (notes.length === 0) return 0;
  return notes.reduce((sum, n) => sum + n, 0) / notes.length;
};

/**
 * Calcule les scores par catégorie et global
 * @param {Object} competences - Données des compétences (savoir, savoirFaire, etc.)
 * @returns {Object} Résultats { parCategorie: {savoir: x, ...}, global: y }
 */
export const calculateCompetenceScores = (competences) => {
  if (!competences) return { parCategorie: {}, global: 0 };

  const categories = Object.keys(competences);
  const scores = {};

  categories.forEach((cat) => {
    scores[cat] = averageCategory(competences[cat]);
  });

  const allNotes = categories.flatMap((cat) =>
    competences[cat].map((c) => noteValues[c.note] || null).filter((n) => n !== null)
  );

  const global =
    allNotes.length > 0
      ? allNotes.reduce((sum, n) => sum + n, 0) / allNotes.length
      : 0;

  return { parCategorie: scores, global };
};

/**
 * Traduit une valeur numérique en appréciation textuelle
 * @param {number} score - Score moyen
 * @returns {string} Appréciation
 */
export const interpretScore = (score) => {
  if (score = 5) return "Très Bien";
  if (score = 4) return "Bien";
  if (score = 3) return "Passable";
  if (score = 2) return "Insuffisant";
  if (score = 1) return "Pas Concerné";
  return "Non évalué";
};
