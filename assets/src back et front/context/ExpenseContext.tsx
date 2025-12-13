//Toute la logique metier est centraliser ici useContext pour consommer les contextes dans d'autres composants

import React, { createContext, useState, useEffect, useContext } from "react";
import { createCategory, fetchCategories, updateCategoryApi, deleteCategoryApi,fetchBudgets, fetchBudgetsForFilter } from "../services/categoryService";
import { createExpenseApi, fetchExpenses, updateExpenseApi, deleteExpenseApi, stopRecurringApi, generateRecurringExpensesApi, duplicateExpenseApi } from "../services/expenseService";
import { Alert } from "react-native";
import { api } from "../services/Api";
//import { api } from "../src/api/axiosConfig";


// Typage des catégories et dépenses et budget
export interface Category {
  id: number ;
  nom: string;
  nom_en?: string;
  type?: number;
  icon: string;     // nom de l’icône  MaterialIcons
  color: string;    // couleur de fond de l’icône 
}


// Typage d'une alerte (basé sur la réponse de Laravel)
export interface AlertData {
  type: string;
  message: string;
  // d'autres détails peuvent être ajoutés si votre API les renvoie
}

export interface Expense {
  id: number; // ID unique
  libelle: string; // Nom ou description de la dépense
  montant: number; // Montant de la dépense // number

  is_repetitive?: number; // 0 = non récurrente, 1 = récurrente
  status_is_repetitive?: number; // 0 = cycle inactif, 1 = actif

  date_debut?: string | null; // Format ISO 'YYYY-MM-DD'
  date_fin?: string | null; // idem
  piece_jointe?: string | null; // chemin ou URL de l'image

  IdBudget?: number | null; // FK vers budgets
  id_categorie_depense: number; // FK vers catégorie
  id_customer_account?: number; // FK vers compte utilisateur
  id_transaction?: number | null; // FK vers transaction

  created_at?: string; // Date de création
}


export interface Budget {
  id: number;
  IdBudget: number;
  // Libelle: string;
  libelle: string;  // en miniscule car laravel Eloquent transforme automatiquement les majuscules en miniscules
  MontantBudget?: number;
  // categoryIds: number[];
  categories: Category[]; //  vient directement de l'API Laravel
}


// Typage du contexte
interface ExpenseContextType {
  categories: Category[];
  expenses: Expense[];
  budgets: Budget[];
  budgetsForFilter: Budget[];
  addCategory: (cat: Category) => void;
  updateCategory: (cat: Category) => void;
  deleteCategory: (id: number) => void;
  // addExpense: (exp: Expense) => void;
  addExpense: (exp: Expense) => Promise<{ alerts: AlertData[] }>; // 👈 Changement ici
  updateExpense: (exp: Expense) => void;
  deleteExpense: (id: number) => void;
  onStopRecurring: (id: number) => void;
  generateRecurringExpenses: () => Promise<{ success: boolean; count?: number }>;
  duplicateExpense: (id: number) => void;

  // 👈 AJOUTS pour la synchronisation accessible depuis l'exterieur
  loadBudgets: () => Promise<void>; 
  loadBudgetsForFilter: () => Promise<void>;
  loadExpenses: () => Promise<void>;
  loadCategories: () => Promise<void>;
}

// Création du contexte
const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

// Provider
export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [budgetsForFilter, setBudgetsForFilter] = useState<Budget[]>([]);


  //chargement des categoeies
  const loadCategories = async () => {
    try {
      const apiCategories = await fetchCategories();
      setCategories([...apiCategories]); // Toutes les catégories de la BD
      return apiCategories;
      //  console.log(categories)
    } catch (error) {
      console.error("Erreur chargement catégories :", error);
      setCategories([]); // <== Important pour éviter undefined
      throw error; // IMPORTANT: Relance l'erreur pour la catcher dans le composant
    }
  };

  //chargement des depenses
  const loadExpenses = async () => {
    try {
      const apiExpenses = await fetchExpenses();
      setExpenses(apiExpenses);
      return apiExpenses; // Retourne les données pour confirmer le succès
      //  console.log("Dépenses récupérées :", apiExpenses);
    } catch (error) {
      console.error("Erreur chargement dépenses :", error);
      setExpenses([]);
       throw error; //  IMPORTANT: Relance l'erreur pour la gérer dans le composant
    }
  };

  //  --- Chargement des budgets pour le formulaire---
  const loadBudgets = async () => {
    try {
      const apiBudgets = await fetchBudgets();
      setBudgets(apiBudgets);
      return apiBudgets;
    } catch (error) {
      console.error("Erreur chargement budgets :", error);
      setBudgets([]);
      throw error;
    }
  };

  //  --- Chargement des budgets pour les FILTRES ---
  const loadBudgetsForFilter = async () => { // 
    try {
      const apiBudgets = await fetchBudgetsForFilter();
      setBudgetsForFilter(apiBudgets);
      return apiBudgets;
    } catch (error) {
      console.error("Erreur chargement budgets (filter) :", error);
      setBudgetsForFilter([]);
      throw error;
    }
  };

  /// Chargement initial depuis L'api ///
  useEffect(() => {
    loadCategories();
    loadBudgets();
    loadBudgetsForFilter();
    loadExpenses();
  }, []); //signifie une seule fois au demarrage


//ajout d'une categorie
  const addCategory = async (cat: Category) => {
  try {
    await createCategory(cat); // Le service lance l'erreur en cas de problème
    await loadCategories(); // Chargement des catégories réussies
    // Ici, vous n'avez pas besoin de return, car le succès est géré par loadCategories
  } catch (error) {
    console.error("Erreur ajout catégorie via API :", error);
    // 💡 L'erreur est déjà affichée par le Service. On doit la relancer (throw)
    // pour que le `try...catch` du Formulaire soit atteint.
    throw error;
  }
};
  // --- Modification catégorie (API) ---
  const updateCategory = async (cat: Category) => {
  try {
    await updateCategoryApi(cat); // Le service lance l'erreur en cas de problème
    // Si l'API réussit, on met à jour l'état local
    setCategories((prev) =>
      prev.map((c) => (c.id === cat.id ? { ...c, ...cat } : c))
    );
  } catch (error) {
    console.error("Erreur mise à jour catégorie via API :", error);
    // Relancer l'erreur (throw)
    throw error;
  }
};

  // --- Suppression catégorie (API) ---
  const deleteCategory = async (id: number) => {
    const category = categories.find((c) => c.id === id);
    if (!category) return;

    try {
      await deleteCategoryApi(id,);
      const newCategories = categories.filter((c) => c.id !== id);
      const newExpenses = expenses.filter((e) => e.id_categorie_depense !== id);
      //  console.log(newCategories);
      setCategories(newCategories);
         setExpenses(newExpenses);
      //await saveData("@categories", newCategories);
    } catch (error) {
      console.error("Erreur suppression catégorie via API :", error);
      alert("Erreur lors de la suppression sur le serveur");
    }
  };

  // --- Gestion des dépenses ---

  const addExpense = async (exp: Expense) => {
  try {
    const apiResponse = await createExpenseApi(exp);
    const alerts: AlertData[] = apiResponse.alerts || [];
    await loadExpenses();
    return { alerts };
  } catch (error) {
    // L'erreur a déjà été gérée et affichée par createExpenseApi.
    // On relance ici pour que le "try" du composant (ExpenseForm) puisse l'attraper.
    // L'utilisation de 'throw' est plus explicite que de retourner une Promise non résolue.
    console.error("Erreur ajout dépense via API dans Contexte :", error);
    throw error; // AJOUTER 'throw error' pour s'assurer que le catch du Form est atteint
  }
};

  const updateExpense = async (exp: Expense) => {
    try {
      await updateExpenseApi(exp);
      await loadExpenses();
    } catch (error) {
      console.error("Erreur mise à jour dépense via API :", error);
      Alert.alert("Erreur", "Erreur lors de la mise à jour sur le serveur");
    }
  };

  const deleteExpense = async (id: number) => {
    try {
      await deleteExpenseApi(id);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    } catch (error) {
      console.error("Erreur suppression dépense via API :", error);
      Alert.alert("Erreur", "Erreur lors de la suppression sur le serveur");
    }
  };

  //stoper une dps repetitive
  const onStopRecurring = async (id: number) => {
    try {
      await stopRecurringApi(id);
      //  loadExpenses();
      setExpenses((prev) => prev.map((expense) =>
        expense.id === id ? { ...expense, status_is_repetitive: 1 } : expense
      ));    // filter logique de suppression map logique de mise a jour
    //  Alert.alert("Succès", "Le cycle de répétition a été arrêté.");

    } catch (error) {
      console.error("Erreur arrêt cycle via API :", error);
      Alert.alert("Erreur", "Erreur lors de l'arrêt du cycle sur le serveur");
    }
  };

  //generer une dépense répétitive
  const generateRecurringExpenses = async () => {
    try {
      //  const result = await generateRecurringExpensesApi();
      const response = await api.get("/depenses/dps_repetitive");
      // const { generatedCount } = response.data; // ex : { generatedCount: 3 }
      const generatedCount = response.data.generatedCount ?? 0; // sécurité
      await loadExpenses();// on recharge les dépenses
      return { success: true, count: generatedCount };
    } catch (error: any) {
      console.error("Erreur lors de la génération des dépenses répétitives :", error);
      return { success: false };
    }
  };

  //  --- Duplication d’une dépense ---
  const duplicateExpense = async (id: number) => {
    try {
      const response = await duplicateExpenseApi(id);
      // console.log("Duplication réussie :", response);
      await loadExpenses();
    } catch (error) {
      console.error("Erreur duplication dépense via API :", error);
      Alert.alert("Erreur", "Impossible de dupliquer la dépense sur le serveur");
    }
  };


  return (
    <ExpenseContext.Provider
      value={{
        categories,
        expenses,
        budgets,
        budgetsForFilter,
        addCategory,
        updateCategory,
        deleteCategory,
        addExpense,
        updateExpense,
        deleteExpense,
        onStopRecurring,
        generateRecurringExpenses,
        duplicateExpense,
        loadExpenses,

        // 👈 EXPOSITION DES FONCTIONS
        loadBudgets,
        loadBudgetsForFilter,
        loadCategories,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

// Hook personnalisé pour simplifier la consommation
export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error("useExpenses must be used within an ExpenseProvider");
  }
  return context;
};
