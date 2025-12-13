import axios from 'axios';
import { storage } from '../../utils/storage'
import { handleApiError } from '../utils/errorHandler';

// Configuration de base d'Axios 
//const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://dev.api-customer.myfronttieres.com/api';
const API_BASE_URL =  'http://192.168.1.162:8000/api';
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercepteur pour ajouter le token d'authentification
apiClient.interceptors.request.use(
    async (config) => {
        const token = await storage.getAuthToken();
        const user = await storage.getUser()
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        if (user && user.sessionToken) {
            const lan = await storage.getLanguage()
            config.data = {
                ...config.data,
                sessionToken: user.sessionToken,
                lan: lan || "fr" // Ou fusionner directement selon vos besoins
            };
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Intercepteur pour gérer les réponses
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Token expiré ou invalide
            await storage.clearAuthToken();
            // Rediriger vers l'écran de login
            navigation.navigate('Login'); // À adapter selon votre navigation
        }
        const handledError = handleApiError(error);
        return Promise.reject(handledError);
    }
);

export default apiClient;