// hooks/useCategoryTranslation.ts - VERSION FINALE
import { useTranslation } from './useTranslation';
import { Category } from '../context/ExpenseContext';
import { CategorieType } from '../types/BudgetType';


export const useCategoryTranslation = () => {
  const { language } = useTranslation();
  
  const getTranslatedCategoryName = (category: Category | CategorieType): string => {
   // console.log(' Traduction appelée pour:', category.nom, 'en langue:', language);
    if (category.type === 0) { 

            // Catégorie système
            const translated = language === 'en'
                ? (category.nom_en || category.nom) // Fallback sur nom si nom_en manquant
                : category.nom;

          //  console.log(' Résultat traduction:', translated);
            return translated;
    } else {
      // Catégorie utilisateur
      return category.nom;
    }
  };

  return { 
    getTranslatedCategoryName,
    currentLanguage: language
  };
};
