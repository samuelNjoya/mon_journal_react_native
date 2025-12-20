import { createContext, useContext, useState, useEffect } from './dependencies.js';

// Types (similaire à TypeScript mais en JS)
export class Category {
  constructor(id, nom, icon, color, type = 1) {
    this.id = id;
    this.nom = nom;
    this.icon = icon;
    this.color = color;
    this.type = type;
  }
}

export class Expense {
  constructor(data) {
    this.id = data.id;
    this.libelle = data.libelle;
    this.montant = data.montant;
    this.is_repetitive = data.is_repetitive || 0;
    this.status_is_repetitive = data.status_is_repetitive || 0;
    this.date_debut = data.date_debut;
    this.date_fin = data.date_fin;
    this.piece_jointe = data.piece_jointe;
    this.IdBudget = data.IdBudget;
    this.id_categorie_depense = data.id_categorie_depense;
    this.created_at = data.created_at;
  }
}

export class Budget {
  constructor(data) {
    this.id = data.id;
    this.IdBudget = data.IdBudget;
    this.libelle = data.libelle;
    this.MontantBudget = data.MontantBudget;
    this.categories = data.categories || [];
  }
}

// Création du contexte
const ExpenseContext = createContext();

// Provider
export const ExpenseProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [budgetsForFilter, setBudgetsForFilter] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  // Import des services
  let categoryService, expenseService;
  
  useEffect(() => {
    // Chargement dynamique des services
    import('../services/categoryService.js').then(module => {
      categoryService = module;
    });
    import('../services/expenseService.js').then(module => {
      expenseService = module;
    });
    
    // Chargement initial
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      await Promise.all([
        loadCategories(),
        loadExpenses(),
        loadBudgets(),
        loadBudgetsForFilter()
      ]);
    } catch (error) {
      console.error('Erreur lors du chargement initial:', error);
      showToast('Erreur de chargement des données', 'error');
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast({ visible: false, message: '', type: 'success' });
    }, 3000);
  };

  // Chargement des catégories
  const loadCategories = async () => {
    try {
      const apiCategories = await categoryService?.fetchCategories() || [];
      setCategories([...apiCategories]);
      return apiCategories;
    } catch (error) {
      console.error("Erreur chargement catégories :", error);
      setCategories([]);
      throw error;
    }
  };

  // Chargement des dépenses
  const loadExpenses = async () => {
    try {
      const apiExpenses = await expenseService?.fetchExpenses() || [];
      setExpenses(apiExpenses);
      return apiExpenses;
    } catch (error) {
      console.error("Erreur chargement dépenses :", error);
      setExpenses([]);
      throw error;
    }
  };

  // Chargement des budgets
  const loadBudgets = async () => {
    try {
      const apiBudgets = await categoryService?.fetchBudgets() || [];
      setBudgets(apiBudgets);
      return apiBudgets;
    } catch (error) {
      console.error("Erreur chargement budgets :", error);
      setBudgets([]);
      throw error;
    }
  };

  // Chargement des budgets pour filtre
  const loadBudgetsForFilter = async () => {
    try {
      const apiBudgets = await categoryService?.fetchBudgetsForFilter() || [];
      setBudgetsForFilter(apiBudgets);
      return apiBudgets;
    } catch (error) {
      console.error("Erreur chargement budgets (filter) :", error);
      setBudgetsForFilter([]);
      throw error;
    }
  };

  // Ajout d'une catégorie
  const addCategory = async (category) => {
    try {
      setLoading(true);
      await categoryService?.createCategory(category);
      await loadCategories();
      showToast('Catégorie ajoutée avec succès', 'success');
      return true;
    } catch (error) {
      console.error("Erreur ajout catégorie :", error);
      showToast(error.message || 'Erreur lors de l\'ajout', 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Mise à jour d'une catégorie
  const updateCategory = async (category) => {
    try {
      setLoading(true);
      await categoryService?.updateCategoryApi(category);
      setCategories(prev => 
        prev.map(c => c.id === category.id ? { ...c, ...category } : c)
      );
      showToast('Catégorie modifiée avec succès', 'success');
      return true;
    } catch (error) {
      console.error("Erreur mise à jour catégorie :", error);
      showToast(error.message || 'Erreur lors de la modification', 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Suppression d'une catégorie
  const deleteCategory = async (id) => {
    try {
      setLoading(true);
      await categoryService?.deleteCategoryApi(id);
      
      // Mise à jour locale
      const newCategories = categories.filter(c => c.id !== id);
      const newExpenses = expenses.filter(e => e.id_categorie_depense !== id);
      
      setCategories(newCategories);
      setExpenses(newExpenses);
      
      showToast('Catégorie supprimée avec succès', 'success');
      return true;
    } catch (error) {
      console.error("Erreur suppression catégorie :", error);
      showToast(error.message || 'Erreur lors de la suppression', 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Ajout d'une dépense
  const addExpense = async (expense) => {
    try {
      setLoading(true);
      const response = await expenseService?.createExpenseApi(expense);
      await loadExpenses();
      
      if (response?.alerts?.length > 0) {
        response.alerts.forEach(alert => {
          showToast(alert.message, alert.type === 'error' ? 'error' : 'warning');
        });
      } else {
        showToast('Dépense ajoutée avec succès', 'success');
      }
      
      return response;
    } catch (error) {
      console.error("Erreur ajout dépense :", error);
      showToast(error.message || 'Erreur lors de l\'ajout', 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Mise à jour d'une dépense
  const updateExpense = async (expense) => {
    try {
      setLoading(true);
      await expenseService?.updateExpenseApi(expense);
      await loadExpenses();
      showToast('Dépense modifiée avec succès', 'success');
      return true;
    } catch (error) {
      console.error("Erreur mise à jour dépense :", error);
      showToast(error.message || 'Erreur lors de la modification', 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Suppression d'une dépense
  const deleteExpense = async (id) => {
    try {
      setLoading(true);
      await expenseService?.deleteExpenseApi(id);
      setExpenses(prev => prev.filter(e => e.id !== id));
      showToast('Dépense supprimée avec succès', 'success');
      return true;
    } catch (error) {
      console.error("Erreur suppression dépense :", error);
      showToast(error.message || 'Erreur lors de la suppression', 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Stopper une dépense récurrente
  const onStopRecurring = async (id) => {
    try {
      setLoading(true);
      await expenseService?.stopRecurringApi(id);
      setExpenses(prev => prev.map(expense => 
        expense.id === id ? { ...expense, status_is_repetitive: 1 } : expense
      ));
      showToast('Cycle de répétition arrêté', 'success');
      return true;
    } catch (error) {
      console.error("Erreur arrêt cycle :", error);
      showToast(error.message || 'Erreur lors de l\'arrêt du cycle', 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Dupliquer une dépense
  const duplicateExpense = async (id) => {
    try {
      setLoading(true);
      await expenseService?.duplicateExpenseApi(id);
      await loadExpenses();
      showToast('Dépense dupliquée avec succès', 'success');
      return true;
    } catch (error) {
      console.error("Erreur duplication dépense :", error);
      showToast(error.message || 'Erreur lors de la duplication', 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Générer les dépenses récurrentes
  const generateRecurringExpenses = async () => {
    try {
      setLoading(true);
      // Note: Adaptez cette fonction selon votre API
      const response = await expenseService?.generateRecurringExpensesApi();
      await loadExpenses();
      showToast(`Dépenses récurrentes générées (${response?.count || 0})`, 'success');
      return response;
    } catch (error) {
      console.error("Erreur génération dépenses récurrentes :", error);
      showToast(error.message || 'Erreur lors de la génération', 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Valeur du contexte
  const contextValue = {
    categories,
    expenses,
    budgets,
    budgetsForFilter,
    loading,
    toast,
    setToast: showToast,
    addCategory,
    updateCategory,
    deleteCategory,
    addExpense,
    updateExpense,
    deleteExpense,
    onStopRecurring,
    duplicateExpense,
    generateRecurringExpenses,
    loadCategories,
    loadExpenses,
    loadBudgets,
    loadBudgetsForFilter
  };

  return (
    React.createElement(ExpenseContext.Provider, { value: contextValue }, children)
  );
};

// Hook personnalisé
export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses doit être utilisé dans un ExpenseProvider');
  }
  return context;
};