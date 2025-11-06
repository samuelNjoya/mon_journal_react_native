import { api } from "../src/api/axiosConfig";
import { Category } from "../contexts/ExpenseContext";
import { Alert } from "react-native";

//  Créer une catégorie sur le serveur Laravel
export const createCategory = async (category: Category) => {
  try {
    const response = await api.post("/catagorie/creer", {
      nom: category.nom,
      type: 1, // par défaut, 
      icon_name: category.icon,
      icon_color: category.color,
    });
    return response.data;
  } catch (error: any) {
    // error.response?.data: message d'erreur envoyer par l'api
   // const message = error.response.data.message;
   // const message = error.response?.data || error.message;
    const message = error.response?.data?.message || JSON.stringify(error.response?.data)
    console.error("Erreur API création catégorie :", message);
    Alert.alert("Erreur", message);
    throw error;
  }
};

// Récupérer toutes les catégories
export const fetchCategories = async () => {
  try {
    //post pas get car le backend exige sessionToken dans le body
    const response = await api.get("/catagorie");
    return response.data.data; // ton contrôleur renvoie ResourceCategorieDps::collection()
  } catch (error: any) {
    console.error("Erreur API récupération catégories :", error.response?.data || error.message);
    throw error;
  }
};


//update mise a jour d'une categorie
export const updateCategoryApi = async (category: Category) => {
  try {
    const response = await api.post("/catagorie/update", {
      id: category.id,          // ID de la catégorie à mettre à jour
      nom: category.nom,       // Nouveau nom
      icon_name: category.icon, // Nouvelle icône
      icon_color: category.color, // Nouvelle couleur
    });

    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message || JSON.stringify(error.response?.data);
    console.error("Erreur API mise à jour catégorie :", message);
    Alert.alert("Erreur", message);
    throw error;
  }
};


// 🔹 Supprimer une catégorie
export const deleteCategoryApi = async (id: number,) => {
  try {
    //const response = await api.post(`/catagorie/delete`, { data: { id } });
   const response = await api.post("/catagorie/delete", { id }); //  car laravel ne reçoit pas de body dans delete par defaut
    return response.data;
  } catch (error: any) {
    console.error("Erreur API suppression catégorie :", error.response?.data || error.message);
    throw error;
  }
};


