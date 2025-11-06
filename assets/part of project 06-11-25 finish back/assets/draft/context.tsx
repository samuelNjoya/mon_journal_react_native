// 📦 ExpenseContext.tsx
// Toute la logique métier centralisée ici : gestion des catégories, budgets et dépenses
import React, { createContext, useState, useEffect, useContext } from "react";
import { Alert } from "react-native";
import Toast from "react-native-toast-message";
import {
  createCategory,
  fetchCategories,
  updateCategoryApi,
  deleteCategoryApi,
} from "../services/categoryService";
import { fetchBudgets } from "../services/budgetService";
import {
  createExpenseApi,
  fetchExpenses,
  updateExpenseApi,
  deleteExpenseApi,
  stopRecurringApi,
  generateRecurringExpensesApi,
} from "../services/expenseService";

// 🧾 Typage des entités
export interface Category {
  id: number;
  nom: string;
  type?: number;
  icon: string;
  color: string;
}

export interface Expense {
  id: number;
  libelle: string;
  montant: number;

  is_repetitive?: number; // 0 = non récurrente, 1 = récurrente
  status_is_repetitive?: number; // 0 = cycle inactif, 1 = actif

  date_debut?: string | null;
  date_fin?: string | null;
  piece_jointe?: string | null;

  IdBudget?: number | null;
  id_categorie_depense: number;
  id_customer_account?: number;
  id_transaction?: number | null;

  created_at?: string;
}

export interface Budget {
  IdBudget: number;
  libelle: string;
  MontantBudget?: number;
  categories: Category[];
}

// 🎯 Typage du contexte
interface ExpenseContextType {
  categories: Category[];
  expenses: Expense[];
  budgets: Budget[];
  addCategory: (cat: Category) => void;
  updateCategory: (cat: Category) => void;
  deleteCategory: (id: number) => void;
  addExpense: (exp: Expense) => void;
  updateExpense: (exp: Expense) => void;
  deleteExpense: (id: number) => void;
  onStopRecurring: (id: number) => void;
  generateRecurringExpenses: () => Promise<any>;
}

// 🧠 Création du contexte
const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

// ⚙️ Provider
export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);

  // 🔹 Chargement des catégories
  const loadCategories = async () => {
    try {
      const apiCategories = await fetchCategories();
      setCategories([...apiCategories]);
    } catch (error) {
      console.error("Erreur chargement catégories :", error);
      setCategories([]);
    }
  };

  // 🔹 Chargement des budgets
  const loadBudgets = async () => {
    try {
      const apiBudgets = await fetchBudgets();
      setBudgets(apiBudgets);
    } catch (error) {
      console.error("Erreur chargement budgets :", error);
      setBudgets([]);
    }
  };

  // 🔹 Chargement des dépenses
  const loadExpenses = async () => {
    try {
      const apiExpenses = await fetchExpenses();
      setExpenses(apiExpenses);
    } catch (error) {
      console.error("Erreur chargement dépenses :", error);
      setExpenses([]);
    }
  };

  // 🪄 Génération automatique des dépenses récurrentes
  const generateRecurringExpenses = async () => {
    try {
      const result = await generateRecurringExpensesApi(); // Appel de la route Laravel

      if (result?.generated && result.generated.length > 0) {
        // ✅ Afficher un toast si des dépenses ont été générées
        Toast.show({
          type: "success",
          text1: "Dépenses répétitives générées",
          text2: `${result.generated.length} nouvelle(s) dépense(s) ajoutée(s).`,
          position: "top",
        });

        // ✅ Recharger la liste des dépenses
        await loadExpenses();
      }

      return result;
    } catch (error: any) {
      console.error("Erreur lors de la génération des dépenses répétitives :", error);
      return null;
    }
  };

  // 🧩 Initialisation automatique au démarrage
  useEffect(() => {
    const initializeData = async () => {
      await loadCategories();
      await loadBudgets();
      await loadExpenses();

      const result = await generateRecurringExpenses(); // Vérifie et génère les répétitives
      if (result?.generated?.length > 0) {
        await loadExpenses();
      }
    };

    initializeData();
  }, []);

  // 💼 Gestion Catégories
  const addCategory = async (cat: Category) => {
    try {
      await createCategory(cat);
      await loadCategories();
    } catch (error) {
      console.error("Erreur ajout catégorie via API :", error);
      alert("Impossible de créer la catégorie sur le serveur");
    }
  };

  const updateCategory = async (cat: Category) => {
    try {
      await updateCategoryApi(cat);
      setCategories((prev) => prev.map((c) => (c.id === cat.id ? { ...c, ...cat } : c)));
    } catch (error) {
      console.error("Erreur mise à jour catégorie via API :", error);
      alert("Erreur lors de la mise à jour sur le serveur");
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      await deleteCategoryApi(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Erreur suppression catégorie via API :", error);
      alert("Erreur lors de la suppression sur le serveur");
    }
  };

  // 💰 Gestion Dépenses
  const addExpense = async (exp: Expense) => {
    try {
      await createExpenseApi(exp);
      await loadExpenses();
    } catch (error) {
      console.error("Erreur ajout dépense via API :", error);
      Alert.alert("Erreur", "Impossible de créer la dépense sur le serveur");
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

  // ⏹️ Stopper une dépense récurrente
  const onStopRecurring = async (id: number) => {
    try {
      await stopRecurringApi(id);
      setExpenses((prev) =>
        prev.map((expense) =>
          expense.id === id ? { ...expense, status_is_repetitive: 1 } : expense
        )
      );
      Alert.alert("Succès", "Le cycle de répétition a été arrêté.");
    } catch (error) {
      console.error("Erreur arrêt cycle via API :", error);
      Alert.alert("Erreur", "Erreur lors de l'arrêt du cycle sur le serveur");
    }
  };

  // 🧩 Fournir le contexte
  return (
    <ExpenseContext.Provider
      value={{
        categories,
        expenses,
        budgets,
        addCategory,
        updateCategory,
        deleteCategory,
        addExpense,
        updateExpense,
        deleteExpense,
        onStopRecurring,
        generateRecurringExpenses,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

// 🪶 Hook personnalisé pour consommer le contexte
export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error("useExpenses must be used within an ExpenseProvider");
  }
  return context;
};
