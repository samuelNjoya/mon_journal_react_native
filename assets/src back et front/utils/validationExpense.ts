import { Expense } from '../context/ExpenseContext';

// Définir le type pour les messages de validation
interface ValidationMessages {
    invalid_amount: string;
    invalid_label: string;
    category_required: string;
    start_date_required: string;
    end_date_required: string;
    invalid_dates: string;
    same_dates: string;
    end_before_start: string;
}

export const validateExpenseForm = (
    expense: Partial<Expense>, 
    validationMessages: ValidationMessages // Maintenant c'est juste l'objet des messages de validation
): string | null => {
    // Vérification du montant
    if (!expense.montant || isNaN(Number(expense.montant)) || Number(expense.montant) <= 0) {
        return validationMessages.invalid_amount;
    }

    // Vérification du libellé
    if (!expense.libelle || expense.libelle.trim().length < 2) {
        return validationMessages.invalid_label;
    }

    // Vérification de la catégorie
    if (!expense.id_categorie_depense) {
        return validationMessages.category_required;
    }

    // Si la dépense est récurrente, vérifier les dates
    if (expense.is_repetitive) {
        if (!expense.date_debut) {
            return validationMessages.start_date_required;
        }
        if (!expense.date_fin) {
            return validationMessages.end_date_required;
        }

        const start = new Date(expense.date_debut);
        const end = new Date(expense.date_fin);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return validationMessages.invalid_dates;
        }

        if (start.getTime() === end.getTime()) {
            return validationMessages.same_dates;
        }

        if (end < start) {
            return validationMessages.end_before_start;
        }
    }

    return null;
};