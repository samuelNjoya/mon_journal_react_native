import { Category} from '../contexts/ExpenseContext';

/**
 * @param name - Nom proposé pour la catégorie
 * @param existingCategories - Liste des catégories existantes
 * @returns {string | null} - Retourne un message d’erreur si invalide, sinon null si valide.
 */
export const validateCategoryName = (
  name: string,
  existingCategories: Category[],
  currentId?: number
): string | null => {
  // Nettoyage du nom
  const trimmed = name.trim();

  // Vérifie que le nom n’est pas vide
  if (trimmed.length === 0) {
    return 'Le nom de la catégorie ne peut pas être vide.';
  }

  // Vérifie la longueur minimale
  if (trimmed.length < 3) {
    return 'Le nom de la catégorie doit contenir au moins 2 caractères.';
  }

  // Vérifie la validité des caractères (lettres, espaces, accents, chiffres)
  const validNameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s'-]+$/;
  if (!validNameRegex.test(trimmed)) {
    return 'Le nom contient des caractères non autorisés.';
  }

  // Vérifie les doublons dans toutes les catégories existantes
  const alreadyExists = existingCategories.some(
    (cat) => cat.nom.toLowerCase() === trimmed.toLowerCase() &&
      cat.id !== currentId // exclusion du même ID
  );

  if (alreadyExists) {
    return 'Une catégorie avec ce nom existe déjà.';
  }

  return null; // valide
};
