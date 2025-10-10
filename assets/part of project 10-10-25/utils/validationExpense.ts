// validators/validateExpenseForm.ts

import { Expense } from "../contexts/ExpenseContext";


export const validateExpenseForm = (expense: Partial<Expense>): string | null => {
  // Vérification du montant
  if (!expense.amount || isNaN(Number(expense.amount)) || Number(expense.amount) <= 0) {
    return "Le montant doit être un nombre valide supérieur à 0.";
  }

  // Vérification du libellé
  if (!expense.label || expense.label.trim().length < 2) {
    return "Le libellé est obligatoire et doit contenir au moins 2 caractères.";
  }

  // Vérification de la catégorie
  if (!expense.categoryId) {
    return "Veuillez sélectionner une catégorie.";
  }

  // Si la dépense est récurrente, vérifier les dates
  if (expense.isRecurring) {
    if (!expense.startDate) {
      return "Veuillez indiquer la date de début pour une dépense récurrente.";
    }
    if (!expense.endDate) {
      return "Veuillez indiquer la date de fin pour une dépense récurrente.";
    }

    const start = new Date(expense.startDate);
    const end = new Date(expense.endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return "Les dates de début et de fin doivent être valides.";
    }

    if (start.getTime() === end.getTime()) {
      return "Les dates de début et de fin ne peuvent pas être identiques.";
    }

    if (end < start) {
      return "La date de fin ne peut pas être antérieure à la date de début.";
    }
  }

  // Si tout est bon
  return null;
};
