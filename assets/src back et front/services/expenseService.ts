import { Expense } from "../context/ExpenseContext";
import { Alert } from "react-native";
import { api } from "./Api";



export const createExpenseApi = async (expense: Expense) => {
  try {
    //  Créer un objet propre pour l'envoi
    const payload: any = {
       libelle: expense.libelle,
      montant: expense.montant,
      id_categorie_depense: expense.id_categorie_depense,
      IdBudget: expense.IdBudget ?? null,
      piece_jointe: expense.piece_jointe ?? null,
      is_repetitive: expense.is_repetitive ? 1 : 0,
      status_is_repetitive: expense.is_repetitive ? 0 : null,
      
      date_debut: expense.date_debut ?? null,
      date_fin:  expense.date_fin ?? null,

      created_at: expense.created_at ?? new Date().toISOString().split("T")[0],
    };

    const response = await api.post("/depenses/creer", payload); 
      // Cela inclut les { data: Expense, alerts?: Alert[] }
    return response.data;
  } catch (error: any) {
    let message = "Erreur inconnue lors de la création de la dépense.";
    if (error.response) {
      //  (Le serveur a répondu)
      message = error.response.data?.message || JSON.stringify(error.response.data.errors) || "Erreur de validation/serveur.";
    } else if (error.request) {
      // Pas de réponse (erreur réseau, timeout)
      message = "Impossible de se connecter au serveur. Vérifiez votre connexion Internet.";
    } 
    // Afficher l'alerte native pour les erreurs bloquantes
    Alert.alert("Erreur d'ajout", message);
    // Relancer l'erreur pour interrompre la chaîne de promesses (contexte -> formulaire)
    throw error;
  }
};

// Créer une dépense sur le serveur Laravel
export const createExpenseApi2 = async (expense: Expense) => {
  try {
    const response = await api.post("/depenses/creer", {
      libelle: expense.libelle,
      montant: expense.montant,
      id_categorie_depense: expense.id_categorie_depense,
      IdBudget: expense.IdBudget ?? null,
      piece_jointe: expense.piece_jointe ?? null,
      is_repetitive: expense.is_repetitive ? 1 : 0,
      status_is_repetitive: expense.is_repetitive ? 0 : null,
      
      date_debut: expense.date_debut ?? null,
      date_fin:  expense.date_fin ?? null,

      created_at: expense.created_at ?? new Date().toISOString().split("T")[0],
    });
    // Cela inclut les { data: Expense, alerts?: Alert[] }
    return response.data;
  } catch (error: any) {

    const message = error.response?.data?.message || JSON.stringify(error.response?.data) || "Erreur inconnue lors de la création de la dépense";
    console.error("Erreur API création dépense :", message);
    Alert.alert("Erreur", message);
    throw error;
  }
};

// Récupérer toutes les dépenses
export const fetchExpenses = async () => {
  try {
    const response = await api.get("/depenses");
    return response.data.data; // Exemple : ResourceDepense::collection() statistique depenses/statistique
  } catch (error: any) {
    console.error(
      "Erreur API récupération dépenses :",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Mettre à jour une dépense
export const updateExpenseApi = async (expense: Expense) => {
  try {
    const response = await api.post("/depenses/update", {
      // id: expense.id,
      // label: expense.label,
      // amount: expense.amount,
      // category_id: expense.categoryId,
      // budget_id: expense.budgetId,
      // date: expense.date,
      // image: expense.image ?? null,
      // is_recurring: expense.isRecurring ?? false,
      // is_recurring_active: expense.isRecurringActive ?? false,
      // start_date: expense.startDate ?? null,
      // end_date: expense.endDate ?? null,
    });

    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message || JSON.stringify(error.response?.data);
    console.error("Erreur API mise à jour dépense :", message);
    Alert.alert("Erreur", message);
    throw error;
  }
};

// Supprimer une dépense
export const deleteExpenseApi = async (id: number) => {
  try {
    const response = await api.post("/depenses/delete", { id });
    return response.data;
  } catch (error: any) {
    console.error(
      "Erreur API suppression dépense :",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Stopper le cycle de répétition d'une dépense (Route de modification générique)
export const stopRecurringApi = async (id: number) => {
  try {
    const response = await api.post("/depenses/stop_dps_repetitive", { id });
   // console.log("3.1. Réponse API reçue (Succès):", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Erreur API stop répétition :",
      error.response?.data || error.message
    );
    throw error;
  }
};

// générer une dépense répétitive
export const generateRecurringExpensesApi = async () => {
  try {
    const response = await api.get("/depenses/dps_repetitive");
    return response.data;
  } catch (error: any) {
    console.error("Erreur génération dépenses récurrentes :", error.response?.data || error.message);
    throw error;
  }
};

// Dupliquer une dépense existante
export const duplicateExpenseApi = async (id: number) => {
  try {
    const response = await api.post("/depenses/dupliquer_dps", { id });
    return response.data;
  } catch (error: any) {
    console.error(
      "Erreur API duplication dépense :",
      error.response?.data || error.message
    );
    throw error;
  }
};
