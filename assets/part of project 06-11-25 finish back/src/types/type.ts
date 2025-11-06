// Typage des catégories et dépenses et budget
export interface Category {
  id: number;
  name: string;
  icon: string;     // nom de l’icône FontAwesome ou MaterialIcons
  color: string;    // couleur de fond de l’icône (fond coloré)
}

export interface Expense {
  id: number; // Date.now()
  label: string; // attention, on unifie avec label
  amount: number;
  categoryId: number;
  date: string;
  budgetId: number;
  image?: string;
  isRecurring?: boolean;
  startDate?: string;
  endDate?: string;
}

export interface Budget {
  id: number;
  name: string;
  categoryIds: number[];
}
