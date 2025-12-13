import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { storage } from '../utils/storage';

const BASE_URL = 'http://192.168.1.162:8000/api';
// Configuration globale pour Axios
export const api: AxiosInstance = axios.create({ 
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Intercepteur pour ajouter automatiquement le token d'authentification
api.interceptors.request.use(

  async  (config) => {

  const token = await storage.getAuthToken();
  const user = await storage.getUser();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Inclure le sessionToken 
    if (user?.sessionToken) {
      if (config.method === 'get') {
        // Pour les requêtes GET, on ajoute le user?.sessionToken comme paramètre
        config.params = { ...config.params, sessionToken: user.sessionToken };
      } else if (config.method === 'post' && config.data) {
        // Pour les requêtes POST, on ajoute le user?.sessionToken dans le body
        config.data = { ...config.data, sessionToken:user.sessionToken };
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les réponses
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    console.error('Erreur API:', error);
    return Promise.reject(error);
  }
);

// Fonction utilitaire pour gérer les réponses
const handleResponse = <T>(response: AxiosResponse<T>): T => {
  return response.data;
};

// Fonction utilitaire pour gérer les erreurs
const handleError = (error: any) => {
  console.error('Erreur API:', error);
  throw error;
};




// Fonction générique pour les requêtes API
export const apiClient = {

  // Méthode GET pour récupérer des données
  get: async <T>(endpoint: string, params?: any): Promise<T> => {
    try {
      const response = await api.get(endpoint, { params });
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // Méthode POST pour créer des données
  post: async <T>(endpoint: string, data?: any): Promise<T> => {
    try {
      const response = await api.post(endpoint, data);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },
};