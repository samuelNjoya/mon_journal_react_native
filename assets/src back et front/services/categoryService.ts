//import { api } from "../src/api/axiosConfig";
import { Category } from "../context/ExpenseContext";
import { Alert } from "react-native";
import { api } from "./Api";

//  Créer une catégorie sur le serveur Laravel
// export const createCategory = async (category: Category) => {
//   try {
//     const response = await api.post("/categorie/creer", {
//       nom: category.nom,
//       type: 1, // par défaut, 
//       icon_name: category.icon,
//       icon_color: category.color,
//     });
//     return response.data;
//   } catch (error: any) {
//     // error.response?.data: message d'erreur envoyer par l'api
//    // const message = error.response.data.message;
//    // const message = error.response?.data || error.message;
//     const message = error.response?.data?.message || JSON.stringify(error.response?.data)
//     console.error("Erreur API création catégorie :", message);
//     Alert.alert("Erreur", message);
//     throw error;
//   }
// };

// service.ts (ou api.ts)

// Créer une catégorie sur le serveur Laravel
export const createCategory = async (category: Category) => {
  try {
    const response = await api.post("/categorie/creer", {
      nom: category.nom,
      type: 1, // par défaut
      icon_name: category.icon,
      icon_color: category.color,
    });
    return response.data;
  } catch (error: any) {
    let message = "Erreur inconnue lors de la création de la catégorie."; 
    if (error.response?.data?.errors) {
        // Erreur de validation (422)
        const errors = Object.values(error.response.data.errors).flat().join(' ; ');
        message = `Erreur de validation: ${errors}`;
    } else if (error.response?.data?.message) {
        // Autre erreur API (404, 500, etc.)
        message = error.response.data.message;
    } else if (error.request) {
        message = "Impossible de se connecter au serveur. Vérifiez votre connexion.";
    }

    Alert.alert("Échec de la création", message);
    throw error; // Essentiel pour que la chaîne try/catch fonctionne
  }
};

// Récupérer toutes les catégories
export const fetchCategories = async () => {
  try {
    //post pas get car le backend exige sessionToken dans le body
    const response = await api.get("/categorie");
    return response.data.data; // ton contrôleur renvoie ResourceCategorieDps::collection()
  } catch (error: any) {
    console.error("Erreur API récupération catégories :", error.response?.data || error.message);
    throw error;
  }
};


//update mise a jour d'une categorie
// export const updateCategoryApi = async (category: Category) => {
//   try {
//     const response = await api.post("/categorie/update", {
//       id: category.id,          // ID de la catégorie à mettre à jour
//       nom: category.nom,       // Nouveau nom
//       icon_name: category.icon, // Nouvelle icône
//       icon_color: category.color, // Nouvelle couleur
//     });

//     return response.data;
//   } catch (error: any) {
//     const message =
//       error.response?.data?.message || JSON.stringify(error.response?.data);
//     console.error("Erreur API mise à jour catégorie :", message);
//     Alert.alert("Erreur", message);
//     throw error;
//   }
// };

// update mise a jour d'une categorie
export const updateCategoryApi = async (category: Category) => {
  try {
    const response = await api.post("/categorie/update", {
      id: category.id,
      nom: category.nom,
      icon_name: category.icon,
      icon_color: category.color,
    });
    return response.data;
  } catch (error: any) {
    let message = "Erreur inconnue lors de la mise à jour de la catégorie.";
    // ... (Même logique de gestion d'erreur que pour createCategory) ...
    if (error.response?.data?.errors) {
        const errors = Object.values(error.response.data.errors).flat().join(' ; ');
        message = `Erreur de validation: ${errors}`;
    } else if (error.response?.data?.message) {
        message = error.response.data.message;
    } else if (error.request) {
        message = "Impossible de se connecter au serveur. Vérifiez votre connexion.";
    }
    Alert.alert("Échec de la modification", message);
    throw error;
  }
};


//Supprimer une catégorie
export const deleteCategoryApi = async (id: number,) => {
  try {
    //const response = await api.post(`/catagorie/delete`, { data: { id } });
   const response = await api.post("/categorie/delete", { id }); //  car laravel ne reçoit pas de body dans delete par defaut
    return response.data;
  } catch (error: any) {
    console.error("Erreur API suppression catégorie :", error.response?.data || error.message);
    throw error;
  }
};



// liste des budget avec categorie pour le formulaire d'ajout d'une depense
export const fetchBudgets = async () => {
  try {
    const response = await api.get("/categorie/buget_categorie_list");
    return response.data.data;
  } catch (error: any) {
    console.error("Erreur API budgets :", error.response?.data || error.message);
    throw error;
  }
};


// liste des budget avec categorie pour le filtre
export const fetchBudgetsForFilter = async () => {
  try {
    const response = await api.get("/categorie/buget_categorie_list_filter");
    return response.data.data;
  } catch (error: any) {
    console.error("Erreur API budgets :", error.response?.data || error.message);
    throw error;
  }
};


