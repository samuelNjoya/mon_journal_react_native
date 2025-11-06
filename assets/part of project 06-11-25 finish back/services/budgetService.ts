import { api } from "../src/api/axiosConfig";

export const fetchBudgets = async () => {
  try {
    const response = await api.get("/catagorie/buget_categorie_list");
    return response.data.data;
  } catch (error: any) {
    console.error("Erreur API budgets :", error.response?.data || error.message);
    throw error;
  }
};

export const fetchBudgetsForFilter = async () => {
  try {
    const response = await api.get("/catagorie/buget_categorie_list_filter");
    return response.data.data;
  } catch (error: any) {
    console.error("Erreur API budgets :", error.response?.data || error.message);
    throw error;
  }
};


