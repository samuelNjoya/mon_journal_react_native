import apiClient from '../config/base';
import { storage } from '../../utils/storage';

export const authService = {
    // Connexion
    login: async (credentials: any) => {
        try {
            const response = await apiClient.post('/spayxauth/login', credentials);
            return { success: true, data: response.data };
        } catch (error: any) {
            return { success: false, error: error.response?.data || error.message };
        }
    },

    // Inscription
    register: async (userData: any) => {
        try {
            const response = await apiClient.post('/spayxauth/signup/signup', userData);
            return { success: true, data: response.data };
        } catch (error: any) {
            console.log("Erreur produit", error.data)
            return { success: false, error: error?.data || error.message };
        }
    },

    // Déconnexion
    logout: async () => {
        try {
            await apiClient.post('/auth/logout');
            return { success: true };
        } catch (error: any) {
            return { success: false, error: error.response?.data || error.message };
        }
    },

    // Rafraîchissement du token
    refreshToken: async (refreshToken: string) => {
        try {
            const refreshToken = await storage.getRefreshToken();
            const response = await apiClient.post('/auth/refresh', { refreshToken });
            const { accessToken } = response.data;
            return { success: true, data: { accessToken, refreshToken } };
        } catch (error: any) {
            return { success: false, error: error.response?.data || error.message };
        }
    },

    // Mot de passe oublié
    forgotPassword: async (email: string) => {
        try {
            await apiClient.post('/auth/forgot-password', { email });
            return { success: true };
        } catch (error: any) {
            return { success: false, error: error.response?.data || error.message };
        }
    },

    // Réinitialisation du mot de passe
    resetPassword: async (token: string, newPassword: string, oldPassword: string) => {
        try {
            await apiClient.post('/auth/reset-password', { token, newPassword, oldPassword });
            return { success: true };
        } catch (error: any) {
            return { success: false, error: error.response?.data || error.message };
        }
    },


};