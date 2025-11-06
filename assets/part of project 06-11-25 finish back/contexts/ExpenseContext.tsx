//Toute la logique metier est centraliser ici useContext pour consommer les contextes dans d'autres composants

import React, { createContext, useState, useEffect, useContext } from "react";
import { getData, saveData } from "../services/storage";
import { createCategory, fetchCategories, updateCategoryApi, deleteCategoryApi } from "../services/categoryService";
import { fetchBudgets, fetchBudgetsForFilter } from "../services/budgetService";
import { createExpenseApi, fetchExpenses, updateExpenseApi, deleteExpenseApi, stopRecurringApi, generateRecurringExpensesApi, duplicateExpenseApi } from "../services/expenseService";
import { Alert } from "react-native";
import { api } from "../src/api/axiosConfig";


// Typage des catégories et dépenses et budget
export interface Category {
  id: number;
  nom: string;
  type?: number;
  icon: string;     // nom de l’icône  MaterialIcons
  color: string;    // couleur de fond de l’icône 
}

// export interface Expense {
//   id: number; // Date.now()
//   label: string; // attention, on unifie avec label
//   amount: number;
//   categoryId: number;
//   date: string;
//   budgetId: number;
//   image?: string;
//   isRecurring?: boolean;
//   isRecurringActive?: boolean;  //  Cycle actif ou stoppé
//   startDate?: string;
//   endDate?: string;
// }

// Typage d'une alerte (basé sur la réponse de Laravel)
export interface AlertData {
  type: string;
  message: string;
  // d'autres détails peuvent être ajoutés si votre API les renvoie
}

export interface Expense {
  id: number; // ID unique
  libelle: string; // Nom ou description de la dépense
  montant: number; // Montant de la dépense

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
  //id: number;
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
      //  console.log(categories)
    } catch (error) {
      console.error("Erreur chargement catégories :", error);
      setCategories([]); // <== Important pour éviter undefined
    }
  };

  //chargement des depenses
  const loadExpenses = async () => {
    try {
      const apiExpenses = await fetchExpenses();
      setExpenses(apiExpenses);
      //  console.log("Dépenses récupérées :", apiExpenses);
    } catch (error) {
      console.error("Erreur chargement dépenses :", error);
      setExpenses([]);
    }
  };

  //  --- Chargement des budgets pour le formulaire---
  const loadBudgets = async () => {
    try {
      const apiBudgets = await fetchBudgets();
      setBudgets(apiBudgets);
    } catch (error) {
      console.error("Erreur chargement budgets :", error);
      setBudgets([]);
    }
  };

  //  --- Chargement des budgets pour les FILTRES ---
  const loadBudgetsForFilter = async () => { // 
    try {
      const apiBudgets = await fetchBudgetsForFilter();
      setBudgetsForFilter(apiBudgets);
    } catch (error) {
      console.error("Erreur chargement budgets (filter) :", error);
      setBudgetsForFilter([]);
    }
  };

  /// Chargement initial depuis L'api ///
  useEffect(() => {
    loadCategories();
    loadBudgets();
    loadBudgetsForFilter();
    loadExpenses();
    // generateRecurringExpenses(); // ne pas appeller ici sinon le toast ne s'affiche pas
  }, []);



  // --- Gestion des catégories via API Laravel uniquement ---
  const addCategory = async (cat: Category) => {
    try {

      const apiResponse = await createCategory(cat);
      loadCategories(); //chargement
    } catch (error) {
      console.error("Erreur ajout catégorie via API :", error);
      alert("Impossible de créer la catégorie sur le serveur");
    }
  };

  // --- Modification catégorie (API) ---
  const updateCategory = async (cat: Category) => {
    try {
      const apiResponse = await updateCategoryApi(cat,);
      setCategories((prev) =>
        prev.map((c) => (c.id === cat.id ? { ...c, ...cat } : c))
      );
      //  console.log("Catégorie modifiée :", apiResponse);
    } catch (error) {
      console.error("Erreur mise à jour catégorie via API :", error);
      alert("Erreur lors de la mise à jour sur le serveur");
    }
  };


  // --- Suppression catégorie (API) ---
  const deleteCategory = async (id: number) => {
    const category = categories.find((c) => c.id === id);
    if (!category) return;

    try {
      await deleteCategoryApi(id,);
      const newCategories = categories.filter((c) => c.id !== id);
      //  const newExpenses = expenses.filter((e) => e.categoryId !== id);
      //  console.log(newCategories);
      setCategories(newCategories);
      //   setExpenses(newExpenses);
      //await saveData("@categories", newCategories);
    } catch (error) {
      console.error("Erreur suppression catégorie via API :", error);
      alert("Erreur lors de la suppression sur le serveur");
    }
  };

  // --- Gestion des dépenses ---
  // const addExpense = async (exp: Expense) => {
  //   try {
  //     await createExpenseApi(exp);
  //     await loadExpenses(); // Recharge depuis le serveur
  //   } catch (error) {
  //     console.error("Erreur ajout dépense via API :", error);
  //     Alert.alert("Erreur", "Impossible de créer la dépense sur le serveur");
  //   }
  // };

  const addExpense = async (exp: Expense) => { // Rendre asynchrone pour la promesse
    try {
      const apiResponse = await createExpenseApi(exp);
      //  Vérification des alertes. L'API Laravel renvoie alerts: [ ... ]
      const alerts: AlertData[] = apiResponse.alerts || [];
      await loadExpenses();
      //Retourner les alertes au composant (ExpenseScreen)
      return { alerts };
    } catch (error) {
      // Les erreurs (4xx) sont gérées par createExpenseApi, on relance juste ici 
      // si vous avez besoin d'un traitement supplémentaire, mais on retourne un tableau vide par défaut
      console.error("Erreur ajout dépense via API dans Contexte :", error);
      // On peut relancer l'erreur pour que le composant la gère, ou simplement retourner
      // On va retourner un objet vide pour ne pas casser la Promise attendue dans l'écran.
      return { alerts: [] };
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
