//Toute la logique metier est centraliser ici

import React, { createContext, useState, useEffect, useContext } from "react";
import { getData, saveData } from "../services/storage";

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


// Typage du contexte
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
}

// Création du contexte
const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

//Catégories par défaut
const DEFAULT_CATEGORIES: Category[] = [
  { id: 1, name: "Alimentation", icon: "food", color: "#f44336" },
  { id: 2, name: "Transport", icon: "car", color: "#2196f3" },
  { id: 3, name: "Logement", icon: "home", color: "#4caf50" },
  { id: 4, name: "Loisirs", icon: "gamepad-variant", color: "#ff9800" },
  { id: 5, name: "Santé", icon: "heart", color: "#9c27b0" },
  { id: 6, name: "Éducation", icon: "school", color: "#3f51b5" },
];

export const DEFAULT_CATEGORY_IDS = [1, 2, 3, 4, 5, 6]; 

// Provider
export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([

     { id: 1, name: "Essentiel", categoryIds: [1, 2, 3] },
     { id: 2, name: "Personnel", categoryIds: [4, 5, 6] },
     { id: 3, name: "Maison", categoryIds: [2, 5, 6] },
     { id: 4, name: "Budget Camping", categoryIds: [1, 2, 3,6] },
     { id: 5, name: "Budget Voiture", categoryIds: [1, 4, 5, 6] },
     
  ]);

  // Chargement initial depuis AsyncStorage
  useEffect(() => {
    async function loadData() {
      const storedCategories = await getData("@categories");
      const storedExpenses = await getData("@expenses");

      // Fusionner les catégories par défaut avec celles de l'utilisateur (en évitant les doublons)
      const mergedCategories = storedCategories
        ? [
          ...DEFAULT_CATEGORIES,
          ...storedCategories.filter(
            (userCat: Category) =>
              !DEFAULT_CATEGORIES.some((defCat) => defCat.name === userCat.name)
          ),
        ]
        : DEFAULT_CATEGORIES;

      setCategories(mergedCategories);
      if (storedExpenses) setExpenses(storedExpenses);

      // if (storedCategories) setCategories(storedCategories);
       //if (storedExpenses) setExpenses(storedExpenses);
      //if (storedBudgets) setBudgets(storedBudgets);
    }
    loadData();
  }, []);

  const saveCategoriesAndUpdateState = async (newCategories: Category[]) => {
    setCategories(newCategories);
    await saveData(
      "@categories",
      newCategories.filter(
        (cat) => !DEFAULT_CATEGORIES.some((defCat) => defCat.name === cat.name)
      ) // ne sauvegarde que les catégories créées par l'utilisateur
    );
  };


  // --- Gestion des catégories ---
  // const saveCategoriesAndUpdateState = async (newCategories: Category[]) => {
  //   setCategories(newCategories);
  //   await saveData("@categories", newCategories);
  // };

  const addCategory = (cat: Category) => {
    const newList = [...categories, cat];
    saveCategoriesAndUpdateState(newList);
  };

  const updateCategory = (cat: Category) => {
    const newList = categories.map((c) => (c.id === cat.id ? cat : c));
    saveCategoriesAndUpdateState(newList);
  };

  // const deleteCategory = (id: number) => {
  //   const newCategories = categories.filter((c) => c.id !== id);
  //   const newExpenses = expenses.filter((e) => e.categoryId !== id);
  //   setCategories(newCategories);
  //   setExpenses(newExpenses);
  //   saveData("@categories", newCategories);
  //   saveData("@expenses", newExpenses);
  // };

  const deleteCategory = (id: number) => {
    const category = categories.find((c) => c.id === id);
    if (!category) return;

    // Empêche la suppression des catégories par défaut
    if (DEFAULT_CATEGORIES.some((defCat) => defCat.id === id)) {
      alert("Impossible de supprimer une catégorie par défaut !"); // cette partie a été gerer en enlèvant les boutons sup et modif dans cate
      return;
    }

    const newCategories = categories.filter((c) => c.id !== id);
    const newExpenses = expenses.filter((e) => e.categoryId !== id);
    setCategories(newCategories);
    setExpenses(newExpenses);
    saveData("@categories", newCategories);
    saveData("@expenses", newExpenses);
  }
    // --- Gestion des dépenses ---
    const saveExpensesAndUpdateState = async (newExpenses: Expense[]) => {
      setExpenses(newExpenses);
      await saveData("@expenses", newExpenses);
    };

    const addExpense = (exp: Expense) => {
      // const newList = [...expenses, exp]; //ajoute a la fin(push)
      const newList = [exp, ...expenses]; //ajoute au debut
      saveExpensesAndUpdateState(newList);
    };

    const updateExpense = (exp: Expense) => {
      const newList = expenses.map((e) => (e.id === exp.id ? exp : e));
      saveExpensesAndUpdateState(newList);
    };

    const deleteExpense = (id: number) => {
      const newList = expenses.filter((e) => e.id !== id);
      saveExpensesAndUpdateState(newList);
    };

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
