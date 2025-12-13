import { Category } from '../context/ExpenseContext';

// Définir le type pour les messages de validation des catégories
interface CategoryValidationMessages {
    empty_name: string;
    min_length: string;
    invalid_chars: string;
    duplicate_name: string;
}

/**
 * @param name - Nom proposé pour la catégorie
 * @param existingCategories - Liste des catégories existantes
 * @param validationMessages - Messages de validation traduits
 * @param currentId - ID actuel pour exclusion en cas d'édition
 * @returns {string | null} - Retourne un message d’erreur si invalide, sinon null si valide.
 */
export const validateCategoryName = (
  name: string,
  existingCategories: Category[],
  validationMessages: CategoryValidationMessages,
  currentId?: number
): string | null => {
  // Nettoyage du nom
  const trimmed = name.trim();

  // Vérifie que le nom n’est pas vide
  if (trimmed.length === 0) {
    return validationMessages.empty_name;
  }

  // Vérifie la longueur minimale
  if (trimmed.length < 3) { // J'ai corrigé pour correspondre au message "au moins 3 caractères"
    return validationMessages.min_length;
  }

  // Vérifie la validité des caractères (lettres, espaces, accents, chiffres)
  const validNameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s'-]+$/;
  if (!validNameRegex.test(trimmed)) {
    return validationMessages.invalid_chars;
  }

  // Vérifie les doublons dans toutes les catégories existantes
  const alreadyExists = existingCategories.some(
    (cat) => cat.nom.toLowerCase() === trimmed.toLowerCase() &&
      cat.id !== currentId // exclusion du même ID
  );

  if (alreadyExists) {
    return validationMessages.duplicate_name;
  }

  return null; // valide
};